import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';
import Header from '../components/Header';
import '../css/admin.css';

// ============================================
// CONTRACT CONFIGURATION
// ============================================
const CONTRACT_CONFIG = {
  address: '0x188E095Aab1f75E7F8c39480C45005854ef31fcB',
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
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  
  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  // Tab state
  const [activeTab, setActiveTab] = useState('create');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Form states
  const [rewards, setRewards] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [finalizingRaffleId, setFinalizingRaffleId] = useState(null);
  const [cancellingRaffleId, setCancellingRaffleId] = useState(null);
  const [completingRaffleId, setCompletingRaffleId] = useState(null);

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
      setCancellingRaffleId(null);
      setCompletingRaffleId(null);
      setIsTransferring(false);
      refetchActiveRaffles();
      refetchWithdrawable();
    }
  }, [isSuccess, refetchActiveRaffles, refetchWithdrawable]);

  // ============================================
  // CONTRACT INTERACTIONS
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

  const handleEmergencyCancel = async (raffleId) => {
    setCancellingRaffleId(raffleId);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'emergencyCancelRaffle',
        args: [raffleId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Emergency cancel failed:', error);
      setTxStatus('error');
      setCancellingRaffleId(null);
    }
  };

  const handleMarkCompleted = async (raffleId) => {
    setCompletingRaffleId(raffleId);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'markRaffleCompleted',
        args: [raffleId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Mark completed failed:', error);
      setTxStatus('error');
      setCompletingRaffleId(null);
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
  // TAB CONTENT COMPONENTS
  // ============================================
  const CreateEventTab = () => (
    <div className="admin-panel">
      <h1 className="admin-title">Create Event</h1>
      <p className="section-subtitle">1 MON and A Dream Raffle</p>
      
      <form className="admin-form" onSubmit={handleCreateRaffle}>
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
          <label>Threshold (Participants)</label>
          <input 
            type="number" 
            step="1"
            min="1"
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
      </form>
    </div>
  );

  const NFTDrawTab = () => (
    <div className="admin-panel">
      <h1 className="admin-title">NFT Draw</h1>
      <p className="form-placeholder">NFT Draw settings coming soon...</p>
    </div>
  );

  const NadsRaffleTab = () => (
    <div className="admin-panel">
      <h1 className="admin-title">Nads Raffle</h1>
      <p className="form-placeholder">Nads Raffle settings coming soon...</p>
    </div>
  );

  const FinalizeCleanupTab = () => {
    const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
    
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(Math.floor(Date.now() / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const formatCountdown = (seconds) => {
      if (seconds <= 0) return 'Available now';
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
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
      const participantCount = Number(raffleInfo[4]);
      const state = raffleInfo[9];
      const isActiveOrCreated = state === 0 || state === 1;
      const isPastEndTime = currentTime > endTime;
      const hasParticipants = participantCount > 0;

      if (!isActiveOrCreated) return null;

      return (
        <div className="active-raffle-card">
          <div className="raffle-card-header">
            <span className="raffle-id">Raffle #{raffleId.toString()}</span>
            <span className={`raffle-state ${isPastEndTime ? 'expired' : 'active'}`}>
              {isPastEndTime ? 'Ended' : 'Active'}
            </span>
          </div>
          <div className="raffle-card-body">
            <p>Participants: {participantCount}</p>
            <p>Threshold: {raffleInfo[2].toString()}</p>
            <p>End: {new Date(endTime * 1000).toLocaleString()}</p>
          </div>
          {isPastEndTime && (
            <div className="raffle-card-actions">
              <button
                className="finalize-btn"
                onClick={() => handleFinalizeRaffle(raffleId)}
                disabled={finalizingRaffleId === raffleId || cancellingRaffleId === raffleId || isConfirming}
              >
                {finalizingRaffleId === raffleId ? 'Finalizing...' : 'Finalize Raffle'}
              </button>
              {hasParticipants && (
                <button
                  className="cancel-btn"
                  onClick={() => handleEmergencyCancel(raffleId)}
                  disabled={finalizingRaffleId === raffleId || cancellingRaffleId === raffleId || isConfirming}
                >
                  {cancellingRaffleId === raffleId ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          )}
        </div>
      );
    };

    const EndedRaffleCard = ({ raffleId }) => {
      const { data: raffleInfo } = useReadContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'getRaffleInfo',
        args: [raffleId],
      });

      if (!raffleInfo) return null;

      const state = raffleInfo[9];
      const claimDeadline = Number(raffleInfo[7]);
      const participantCount = Number(raffleInfo[4]);
      const isEndedState = state === 3 || state === 4 || state === 6;

      if (!isEndedState) return null;

      const canMarkCompleted = currentTime > claimDeadline;
      const timeUntilMarkable = claimDeadline - currentTime;

      const getStateLabel = () => {
        if (state === 3) return 'Winner Selected';
        if (state === 4) return 'Refunds Enabled';
        if (state === 6) return 'Cancelled';
        return 'Unknown';
      };

      return (
        <div className="active-raffle-card">
          <div className="raffle-card-header">
            <span className="raffle-id">Raffle #{raffleId.toString()}</span>
            <span className="raffle-state expired">{getStateLabel()}</span>
          </div>
          <div className="raffle-card-body">
            <p>Participants: {participantCount}</p>
            <p>Threshold: {raffleInfo[2].toString()}</p>
            <p>Claim Deadline: {new Date(claimDeadline * 1000).toLocaleString()}</p>
          </div>
          <button
            className="finalize-btn"
            onClick={() => handleMarkCompleted(raffleId)}
            disabled={!canMarkCompleted || completingRaffleId === raffleId || isConfirming}
          >
            {completingRaffleId === raffleId ? 'Marking...' : 'Mark Completed'}
          </button>
          {!canMarkCompleted && (
            <p className="countdown-timer">{formatCountdown(timeUntilMarkable)}</p>
          )}
        </div>
      );
    };

    const activeRaffles = activeRaffleIds || [];
    const hasActiveRaffles = activeRaffles.length > 0;

    return (
      <div className="admin-panel">
        <h1 className="admin-title">Finalize / Cleanup</h1>

        <div className="cleanup-section">
          <h2 className="section-title">Active Raffles</h2>
          {hasActiveRaffles ? (
            <div className="raffles-list">
              {activeRaffles.map((raffleId) => (
                <ActiveRaffleCard key={raffleId.toString()} raffleId={raffleId} />
              ))}
            </div>
          ) : (
            <p className="no-raffles">No active raffles</p>
          )}
        </div>

        <div className="cleanup-section">
          <h2 className="section-title">Ended / Cleanup</h2>
          {hasActiveRaffles ? (
            <div className="raffles-list">
              {activeRaffles.map((raffleId) => (
                <EndedRaffleCard key={raffleId.toString()} raffleId={raffleId} />
              ))}
            </div>
          ) : (
            <p className="no-raffles">No raffles pending cleanup</p>
          )}
        </div>
      </div>
    );
  };

  const TreasuryTab = () => {
    const liveRaffleId = activeRaffleIds && activeRaffleIds.length > 0 ? activeRaffleIds[0] : null;

    return (
      <div className="admin-panel">
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
    );
  };

  // ============================================
  // ADMIN SUB NAVIGATION
  // ============================================
  const tabItems = [
    { label: 'Create Event', value: 'create' },
    { label: 'NFT Draw', value: 'nftdraw' },
    { label: 'Nads Raffle', value: 'nadsraffle' },
    { label: 'Finalize/Cleanup', value: 'finalize' },
    { label: 'Treasury', value: 'treasury' }
  ];

  const currentTabLabel = tabItems.find(item => item.value === activeTab)?.label || 'Create Event';

  const handleTabChange = (value) => {
    setActiveTab(value);
    setDropdownOpen(false);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateEventTab />;
      case 'nftdraw':
        return <NFTDrawTab />;
      case 'nadsraffle':
        return <NadsRaffleTab />;
      case 'finalize':
        return <FinalizeCleanupTab />;
      case 'treasury':
        return <TreasuryTab />;
      default:
        return <CreateEventTab />;
    }
  };

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

  // Admin view
  return (
    <div className="nads-container">
      <Header />

      {/* Admin Sub Navigation */}
      <div className="admin-sub-nav-container">
        {/* Desktop Horizontal Tabs */}
        <nav className="admin-sub-nav-tabs">
          {tabItems.map((item) => (
            <button
              key={item.value}
              className={`admin-sub-nav-tab ${activeTab === item.value ? 'active' : ''}`}
              onClick={() => handleTabChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Dropdown */}
        <button 
          className="admin-sub-nav-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="current-label">{currentTabLabel}</span>
          <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
        </button>

        {dropdownOpen && (
          <>
            <div className="admin-sub-nav-overlay" onClick={() => setDropdownOpen(false)}></div>
            <div className="admin-sub-nav-dropdown">
              {tabItems.map((item) => (
                <button
                  key={item.value}
                  className={`admin-sub-nav-item ${activeTab === item.value ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <main className="nads-main">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default Admin;