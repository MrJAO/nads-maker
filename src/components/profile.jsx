import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract, useReadContracts, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';
import Header from './Header';
import '../css/profile.css';

const CONTRACT_CONFIG = {
  address: '0x188E095Aab1f75E7F8c39480C45005854ef31fcB',
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
      <Header />

      <main className="nads-main profile-main">
        {!isConnected ? (
          <p className="placeholder-text">Please connect your wallet</p>
        ) : (
          <>
            <div className="profile-address-section">
              <h2 className="profile-address-label">Your Wallet</h2>
              <p className="profile-address">{address}</p>
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