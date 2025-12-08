import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract, useReadContracts, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';

const CONTRACT_CONFIG = {
  address: '0x26A56f3245161CE7938200F1366A1cf9549c7e20',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

function Profile() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();

  const [claimingRaffleId, setClaimingRaffleId] = useState(null);
  const [txStatus, setTxStatus] = useState('');

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  // Get active raffle IDs
  const { data: activeRaffleIds, refetch: refetchActiveRaffles } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getActiveRaffleIds',
  });

  // Get next raffle ID to determine current raffle
  const { data: nextRaffleId } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextRaffleId',
  });

  // Check user participation in raffles 5-13 for NFT Draw eligibility
  const nftDrawRaffleIds = [5, 6, 7, 8, 9, 10, 11, 12, 13];
  const { data: participationData } = useReadContracts({
    contracts: nftDrawRaffleIds.map(id => ({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'isParticipant',
      args: [id, address],
    })),
    enabled: !!address,
  });

  // Calculate NFT Draw eligibility
  const getNFTDrawEligibility = () => {
    if (!nextRaffleId || !participationData) {
      return { status: 'Not Yet', color: '#888' };
    }

    const currentRaffleId = Number(nextRaffleId) - 1;
    const participationCount = participationData.filter(p => p.result === true).length;

    // If past raffle #13
    if (currentRaffleId > 13) {
      if (participationCount >= 8) {
        return { status: 'Eligible', color: '#4ade80' };
      } else {
        return { status: 'Not Eligible', color: '#ef4444' };
      }
    }

    // Still within raffle 5-13 range
    if (participationCount >= 8) {
      return { status: 'Eligible', color: '#4ade80' };
    } else {
      return { status: 'Not Yet', color: '#888' };
    }
  };

  const nftDrawEligibility = getNFTDrawEligibility();

  // Switch to Monad when user connects
  useEffect(() => {
    if (isConnected) {
      switchChain?.({ chainId: monadMainnet.id });
    }
  }, [isConnected, switchChain]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isSuccess) {
      setTxStatus('success');
      setClaimingRaffleId(null);
      refetchActiveRaffles();
    }
  }, [isSuccess, refetchActiveRaffles]);

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClaimReward = async (raffleId) => {
    setClaimingRaffleId(raffleId);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'claimReward',
        args: [raffleId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Claim failed:', error);
      setTxStatus('error');
      setClaimingRaffleId(null);
    }
  };

  const handleClaimRefund = async (raffleId) => {
    setClaimingRaffleId(raffleId);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'claimRefund',
        args: [raffleId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Claim failed:', error);
      setTxStatus('error');
      setClaimingRaffleId(null);
    }
  };

  const ClaimablesList = () => {
    if (!activeRaffleIds || activeRaffleIds.length === 0 || !address) {
      return <p className="no-claims">No rewards or refunds available</p>;
    }

    const claimableItems = activeRaffleIds.map((raffleId) => (
      <ClaimableCard key={raffleId.toString()} raffleId={raffleId} />
    ));

    const hasClaimables = claimableItems.some(item => item !== null);

    if (!hasClaimables) {
      return <p className="no-claims">No rewards or refunds available</p>;
    }

    return <div className="claimables-container">{claimableItems}</div>;
  };

  const ClaimableCard = ({ raffleId }) => {
    // Always call hooks at the top
    const { data: userClaimStatus } = useReadContract({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getUserClaimStatus',
      args: [raffleId, address],
    });

    const { data: raffleInfo } = useReadContract({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getRaffleInfo',
      args: [raffleId],
    });

    // Now check conditions after all hooks
    if (!userClaimStatus || !raffleInfo) return null;

    const [isWinner, canClaimRewardNow, canClaimRefundNow, claimableAmount] = userClaimStatus;

    if (!canClaimRewardNow && !canClaimRefundNow) return null;

    const claimDeadline = Number(raffleInfo[7]);
    const timeLeft = claimDeadline - Math.floor(Date.now() / 1000);
    const daysLeft = Math.floor(timeLeft / 86400);
    const hoursLeft = Math.floor((timeLeft % 86400) / 3600);
    const minutesLeft = Math.floor((timeLeft % 3600) / 60);

    const claimType = canClaimRewardNow ? 'Reward' : 'Refund';
    const handleClaim = canClaimRewardNow ? handleClaimReward : handleClaimRefund;

    return (
      <div className="claimable-card">
        <div className="claimable-header">
          <h3 className="claimable-type">{claimType} Available</h3>
          <span className="claimable-raffle-id">Raffle #{raffleId.toString()}</span>
        </div>

        <div className="claimable-info">
          <div className="claimable-row">
            <span className="claimable-label">Amount</span>
            <span className="claimable-amount">{formatEther(claimableAmount)} MON</span>
          </div>

          <div className="claimable-row">
            <span className="claimable-label">Claim Window</span>
            <span className="claimable-deadline">
              {daysLeft}d {hoursLeft}h {minutesLeft}m left
            </span>
          </div>

          <div className="claimable-row">
            <span className="claimable-label">Deadline</span>
            <span className="claimable-date">
              {new Date(claimDeadline * 1000).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          className="claim-btn"
          onClick={() => handleClaim(raffleId)}
          disabled={claimingRaffleId === raffleId || isConfirming}
        >
          {claimingRaffleId === raffleId || isConfirming ? 'Claiming...' : `Claim ${claimType}`}
        </button>
      </div>
    );
  };

  return (
    <div className="nads-container">
      <header className="nads-header">
        <div className="nads-header-left">
          <div className="nads-logo">NadsMaker</div>
          <button className="docs-btn" onClick={() => navigate('/docs')}>Documentation</button>
          {isAdmin && (
            <button className="admin-btn" onClick={() => navigate('/admin')}>Admin</button>
          )}
        </div>
        <div className="nads-nav">
          <button className="nads-btn" onClick={() => navigate('/1mon')}>1 MON</button>
          <button className="nads-btn" onClick={() => navigate('/nft-draw')}>NFT Draw</button>
          <button className="nads-btn" onClick={() => navigate('/profile')}>Profile</button>
          <button className="nads-btn primary" onClick={handleWalletClick}>
            {isConnected ? shortenAddress(address) : 'Connect Wallet'}
          </button>
        </div>
      </header>

      <main className="nads-main profile-main">
        {!isConnected ? (
          <p className="placeholder-text">Please connect your wallet</p>
        ) : (
          <>
            <div className="profile-address-section">
              <h2 className="profile-address-label">Your Wallet</h2>
              <p className="profile-address">{address}</p>
            </div>

            <div className="eligibility-sections">
              <div className="eligibility-card">
                <h3 className="eligibility-title">NFT Draw</h3>
                <div className="eligibility-info">
                  <div className="eligibility-row">
                    <span className="eligibility-label">Draw Eligibility:</span>
                    <span className="eligibility-status" style={{ color: nftDrawEligibility.color }}>
                      {nftDrawEligibility.status}
                    </span>
                  </div>
                  <div className="eligibility-row">
                    <span className="eligibility-label">Start Date:</span>
                    <span className="eligibility-value">TBA</span>
                  </div>
                  <div className="eligibility-row">
                    <span className="eligibility-label">End Date:</span>
                    <span className="eligibility-value">TBA</span>
                  </div>
                </div>
              </div>

              <div className="eligibility-card">
                <h3 className="eligibility-title">Nads Raffle</h3>
                <div className="eligibility-info">
                  <div className="eligibility-row">
                    <span className="eligibility-label">Draw Eligibility:</span>
                    <span className="eligibility-status" style={{ color: '#888' }}>
                      Coming Soon
                    </span>
                  </div>
                  <div className="eligibility-row">
                    <span className="eligibility-label">Start Date:</span>
                    <span className="eligibility-value">TBA</span>
                  </div>
                  <div className="eligibility-row">
                    <span className="eligibility-label">End Date:</span>
                    <span className="eligibility-value">TBA</span>
                  </div>
                </div>
              </div>
            </div>

            {txStatus === 'success' && (
              <p className="tx-status success">Claim successful!</p>
            )}
            {txStatus === 'error' && (
              <p className="tx-status error">Claim failed. Please try again.</p>
            )}

            <ClaimablesList />
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;