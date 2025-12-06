import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';

// ============================================
// CONTRACT CONFIGURATION
// ============================================
const CONTRACT_CONFIG = {
  address: '0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

// Convert datetime-local to Unix timestamp (seconds)
const toUnixTimestamp = (dateString) => {
  return Math.floor(new Date(dateString).getTime() / 1000);
};

function Admin() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  
  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  // Form states
  const [raffleType, setRaffleType] = useState('1mon');
  const [rewards, setRewards] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [finalizingRaffleId, setFinalizingRaffleId] = useState(null);

  // Treasury states
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Get active raffle IDs
  const { data: activeRaffleIds, refetch: refetchActiveRaffles } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getActiveRaffleIds',
  });

  // Get withdrawable amount
  const { data: withdrawableAmount, refetch: refetchWithdrawable } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getWithdrawableAmount',
  });

  // Switch to Monad when admin connects
  useEffect(() => {
    if (isConnected && isAdmin) {
      switchChain?.({ chainId: monadMainnet.id });
    }
  }, [isConnected, isAdmin, switchChain]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isSuccess) {
      setTxStatus('success');
      setRewards('');
      setStartDate('');
      setEndDate('');
      setThreshold('');
      setTransferAmount('');
      setIsLoading(false);
      setFinalizingRaffleId(null);
      setIsTransferring(false);
      refetchActiveRaffles();
      refetchWithdrawable();
    }
  }, [isSuccess, refetchActiveRaffles, refetchWithdrawable]);

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

  // ============================================
  // CONTRACT INTERACTION
  // ============================================
  const handleCreateRaffle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'createRaffle',
        args: [
          toUnixTimestamp(startDate),
          toUnixTimestamp(endDate),
          BigInt(threshold),
          parseEther(rewards),
        ],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      setTxStatus('error');
      setIsLoading(false);
    }
  };

  const handleFinalizeRaffle = async (raffleId) => {
    setFinalizingRaffleId(raffleId);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'finalizeRaffle',
        args: [raffleId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Finalize failed:', error);
      setTxStatus('error');
      setFinalizingRaffleId(null);
    }
  };

  const handleTreasuryTransfer = async (e) => {
    e.preventDefault();
    setIsTransferring(true);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'treasuryTransfer',
        args: [parseEther(transferAmount)],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Transfer failed:', error);
      setTxStatus('error');
      setIsTransferring(false);
    }
  };

  // ============================================
  // ACTIVE RAFFLES SECTION
  // ============================================
  const ActiveRafflesList = () => {
    if (!activeRaffleIds || activeRaffleIds.length === 0) {
      return <p className="no-raffles">No active raffles</p>;
    }

    return (
      <div className="active-raffles-section">
        <h2 className="section-title">Active Raffles</h2>
        {activeRaffleIds.map((raffleId) => (
          <ActiveRaffleCard key={raffleId.toString()} raffleId={raffleId} />
        ))}
      </div>
    );
  };

  const ActiveRaffleCard = ({ raffleId }) => {
    const { data: raffleInfo } = useReadContract({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'getRaffleInfo',
      args: [raffleId],
    });

    if (!raffleInfo) return null;

    const endTime = Number(raffleInfo[1]);
    const isPastDeadline = Date.now() / 1000 > endTime;
    const state = raffleInfo[9];
    const isActiveOrCreated = state === 0 || state === 1; // Created or Active

    return (
      <div className="active-raffle-card">
        <div className="raffle-card-header">
          <span className="raffle-id">Raffle #{raffleId.toString()}</span>
          <span className={`raffle-state ${isPastDeadline ? 'expired' : 'active'}`}>
            {isPastDeadline ? 'Past Deadline' : 'Active'}
          </span>
        </div>
        <div className="raffle-card-body">
          <p>Participants: {raffleInfo[4].toString()}</p>
          <p>Threshold: {raffleInfo[2].toString()}</p>
          <p>End: {new Date(endTime * 1000).toLocaleString()}</p>
        </div>
        {isPastDeadline && isActiveOrCreated && (
          <button
            className="finalize-btn"
            onClick={() => handleFinalizeRaffle(raffleId)}
            disabled={finalizingRaffleId === raffleId || isConfirming}
          >
            {finalizingRaffleId === raffleId ? 'Finalizing...' : 'Finalize Raffle'}
          </button>
        )}
      </div>
    );
  };

  // Check if there's a live raffle
  const hasLiveRaffle = () => {
    if (!activeRaffleIds || activeRaffleIds.length === 0) return null;
    // Return first active raffle ID if exists
    return activeRaffleIds.length > 0 ? activeRaffleIds[0] : null;
  };

  // ============================================
  // HEADER COMPONENT
  // ============================================
  const Header = ({ showAdmin = false }) => (
    <header className="nads-header">
      <div className="nads-header-left">
        <div className="nads-logo">NadsMaker</div>
        <button className="docs-btn" onClick={() => navigate('/docs')}>Documentation</button>
        {showAdmin && (
          <button className="admin-btn" onClick={() => navigate('/admin')}>Admin</button>
        )}
      </div>
      <div className="nads-nav">
        <button className="nads-btn accent" onClick={() => navigate('/nadsmaker')}>1 MON</button>
        <button className="nads-btn" onClick={() => navigate('/nft-draw')}>NFT Draw</button>
        <button className="nads-btn" onClick={() => navigate('/profile')}>Profile</button>
        <button className="nads-btn primary" onClick={handleWalletClick}>
          {isConnected ? shortenAddress(address) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );

  // Not connected state
  if (!isConnected) {
    return (
      <div className="nads-container">
        <Header />
        <main className="nads-main">
          <p className="placeholder-text">Please connect your wallet</p>
        </main>
      </div>
    );
  }

  // Not admin state
  if (!isAdmin) {
    return (
      <div className="nads-container">
        <Header />
        <main className="nads-main">
          <p className="placeholder-text">Access Denied</p>
        </main>
      </div>
    );
  }

  const liveRaffleId = hasLiveRaffle();

  // Admin view
  return (
    <div className="nads-container">
      <Header showAdmin={true} />

      <main className="nads-main">
        <div className="admin-panel">
          <h1 className="admin-title">Create Event</h1>
          
          <form className="admin-form" onSubmit={handleCreateRaffle}>
            <div className="form-group">
              <label>Raffle Type</label>
              <div className="radio-group">
                <button 
                  type="button"
                  className={`radio-btn ${raffleType === '1mon' ? 'active' : ''}`}
                  onClick={() => setRaffleType('1mon')}
                  disabled={isLoading}
                >
                  1 MON Raffle
                </button>
                <button 
                  type="button"
                  className={`radio-btn ${raffleType === 'nft' ? 'active' : ''}`}
                  onClick={() => setRaffleType('nft')}
                  disabled={isLoading}
                >
                  NFT Draw
                </button>
              </div>
            </div>

            {raffleType === '1mon' ? (
              <>
                <div className="form-group">
                  <label>Rewards (MON)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 100"
                    value={rewards}
                    onChange={(e) => setRewards(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="datetime-local" 
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="datetime-local" 
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Threshold (MON)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 50"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {txStatus === 'success' && (
                  <p className="tx-status success">Transaction successful!</p>
                )}
                {txStatus === 'error' && (
                  <p className="tx-status error">Transaction failed. Please try again.</p>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading || isConfirming}
                >
                  {isLoading || isConfirming ? 'Creating...' : 'Create Raffle'}
                </button>
              </>
            ) : (
              <p className="form-placeholder">NFT Draw settings coming soon...</p>
            )}
          </form>

          <ActiveRafflesList />
        </div>

        {/* Treasury Transfer Panel */}
        <div className="admin-panel treasury-panel">
          <h1 className="admin-title">Treasury Transfer</h1>

          <div className="treasury-info">
            {liveRaffleId && (
              <div className="treasury-row">
                <span className="treasury-label">Live Raffle</span>
                <span className="treasury-value live">
                  Yes (Raffle #{liveRaffleId.toString()})
                </span>
              </div>
            )}

            <div className="treasury-row highlight">
              <span className="treasury-label">Withdrawable Amount</span>
              <span className="treasury-value highlight">
                {withdrawableAmount ? formatEther(withdrawableAmount) : '0'} MON
              </span>
            </div>
          </div>

          <form className="treasury-form" onSubmit={handleTreasuryTransfer}>
            <div className="form-group">
              <label>Transfer Amount (MON)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                max={withdrawableAmount ? formatEther(withdrawableAmount) : '0'}
                className="form-input"
                placeholder="e.g. 50"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                disabled={isTransferring || isConfirming}
                required
              />
            </div>

            {txStatus === 'success' && (
              <p className="tx-status success">Transfer successful!</p>
            )}
            {txStatus === 'error' && (
              <p className="tx-status error">Transfer failed. Please try again.</p>
            )}

            <button 
              type="submit" 
              className="submit-btn treasury-btn"
              disabled={isTransferring || isConfirming || !withdrawableAmount || withdrawableAmount === 0n}
            >
              {isTransferring || isConfirming ? 'Transferring...' : 'Transfer to Treasury'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Admin;