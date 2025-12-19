import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';
import TreasureHuntABI from '../abi/TreasureHunt.json';
import Header from '../components/Header';
import CreateRaffleTab from '../admin/CreateRaffleTab';
import CreateTHuntTab from '../admin/CreateTHuntTab';
import FinalizeCleanupTab from '../admin/FinalizeCleanupTab';
import TreasuryTab from '../admin/TreasuryTab';
import '../css/admin.css';

// ============================================
// CONTRACT CONFIGURATION
// ============================================
const CONTRACT_CONFIG = {
  address: '0x188E095Aab1f75E7F8c39480C45005854ef31fcB',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

const THUNT_CONTRACT_CONFIG = {
  address: '0x91AC7FEfB3759C36355F92eF3F3014f9aF648Bb7',
  abi: TreasureHuntABI,
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

  // Track which action triggered the transaction
  const lastActionRef = useRef(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('create');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Raffle form states
  const [rewards, setRewards] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [finalizingRaffleId, setFinalizingRaffleId] = useState(null);
  const [cancellingRaffleId, setCancellingRaffleId] = useState(null);
  const [completingRaffleId, setCompletingRaffleId] = useState(null);

  // THunt form states
  const [gridWidth, setGridWidth] = useState('');
  const [gridHeight, setGridHeight] = useState('');
  const [rewardPerTreasure, setRewardPerTreasure] = useState('');
  const [treasureCount, setTreasureCount] = useState('');
  const [thuntStartDate, setThuntStartDate] = useState('');
  const [thuntEndDate, setThuntEndDate] = useState('');
  const [raffleIdStart, setRaffleIdStart] = useState('');
  const [raffleIdEnd, setRaffleIdEnd] = useState('');
  const [isCreatingTHunt, setIsCreatingTHunt] = useState(false);
  const [endingTHuntId, setEndingTHuntId] = useState(null);
  const [completingTHuntId, setCompletingTHuntId] = useState(null);
  const [cancellingTHuntId, setCancellingTHuntId] = useState(null);

  // Get active raffle IDs
  const { data: activeRaffleIds, refetch: refetchActiveRaffles } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getActiveRaffleIds',
  });

  // Get withdrawable amount (Raffle)
  const { data: withdrawableAmount, refetch: refetchWithdrawable } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getWithdrawableAmount',
  });

  // Get active THunt IDs
  const { data: activeTHuntIds, refetch: refetchActiveTHunts } = useReadContract({
    address: THUNT_CONTRACT_CONFIG.address,
    abi: THUNT_CONTRACT_CONFIG.abi,
    functionName: 'getActiveTHuntIds',
  });

  // Get withdrawable amount (THunt)
  const { data: thuntWithdrawableAmount, refetch: refetchTHuntWithdrawable } = useReadContract({
    address: THUNT_CONTRACT_CONFIG.address,
    abi: THUNT_CONTRACT_CONFIG.abi,
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
      
      // Reset states based on which action was performed
      switch (lastActionRef.current) {
        case 'createRaffle':
          setRewards('');
          setStartDate('');
          setEndDate('');
          setThreshold('');
          setIsLoading(false);
          break;
        case 'createTHunt':
          setGridWidth('');
          setGridHeight('');
          setRewardPerTreasure('');
          setTreasureCount('');
          setThuntStartDate('');
          setThuntEndDate('');
          setRaffleIdStart('');
          setRaffleIdEnd('');
          setIsCreatingTHunt(false);
          break;
        case 'finalizeRaffle':
          setFinalizingRaffleId(null);
          break;
        case 'cancelRaffle':
          setCancellingRaffleId(null);
          break;
        case 'completeRaffle':
          setCompletingRaffleId(null);
          break;
        case 'endTHunt':
          setEndingTHuntId(null);
          break;
        case 'completeTHunt':
          setCompletingTHuntId(null);
          break;
        case 'cancelTHunt':
          setCancellingTHuntId(null);
          break;
        default:
          // Reset all loading states as fallback
          setIsLoading(false);
          setIsCreatingTHunt(false);
          setFinalizingRaffleId(null);
          setCancellingRaffleId(null);
          setCompletingRaffleId(null);
          setEndingTHuntId(null);
          setCompletingTHuntId(null);
          setCancellingTHuntId(null);
      }
      
      lastActionRef.current = null;
      refetchActiveRaffles();
      refetchWithdrawable();
      refetchActiveTHunts();
      refetchTHuntWithdrawable();
    }
  }, [isSuccess, refetchActiveRaffles, refetchWithdrawable, refetchActiveTHunts, refetchTHuntWithdrawable]);

  // ============================================
  // CONTRACT INTERACTIONS
  // ============================================
  const handleCreateRaffle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTxStatus('');
    lastActionRef.current = 'createRaffle';

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
      lastActionRef.current = null;
    }
  };

  const handleCreateTHunt = async (e) => {
    e.preventDefault();
    setIsCreatingTHunt(true);
    setTxStatus('');
    lastActionRef.current = 'createTHunt';

    try {
      await writeContract({
        address: THUNT_CONTRACT_CONFIG.address,
        abi: THUNT_CONTRACT_CONFIG.abi,
        functionName: 'createTreasureHunt',
        args: [
          BigInt(gridWidth),
          BigInt(gridHeight),
          parseEther(rewardPerTreasure),
          BigInt(treasureCount),
          toUnixTimestamp(thuntStartDate),
          toUnixTimestamp(thuntEndDate),
          BigInt(raffleIdStart),
          BigInt(raffleIdEnd),
        ],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      setTxStatus('error');
      setIsCreatingTHunt(false);
      lastActionRef.current = null;
    }
  };

  const handleFinalizeRaffle = async (raffleId) => {
    setFinalizingRaffleId(raffleId);
    setTxStatus('');
    lastActionRef.current = 'finalizeRaffle';

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
      lastActionRef.current = null;
    }
  };

  const handleEmergencyCancel = async (raffleId) => {
    setCancellingRaffleId(raffleId);
    setTxStatus('');
    lastActionRef.current = 'cancelRaffle';

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
      lastActionRef.current = null;
    }
  };

  const handleMarkCompleted = async (raffleId) => {
    setCompletingRaffleId(raffleId);
    setTxStatus('');
    lastActionRef.current = 'completeRaffle';

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
      lastActionRef.current = null;
    }
  };

  const handleEndTHunt = async (tHuntId) => {
    setEndingTHuntId(tHuntId);
    setTxStatus('');
    lastActionRef.current = 'endTHunt';

    try {
      await writeContract({
        address: THUNT_CONTRACT_CONFIG.address,
        abi: THUNT_CONTRACT_CONFIG.abi,
        functionName: 'endTreasureHunt',
        args: [tHuntId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('End THunt failed:', error);
      setTxStatus('error');
      setEndingTHuntId(null);
      lastActionRef.current = null;
    }
  };

  const handleMarkTHuntCompleted = async (tHuntId) => {
    setCompletingTHuntId(tHuntId);
    setTxStatus('');
    lastActionRef.current = 'completeTHunt';

    try {
      await writeContract({
        address: THUNT_CONTRACT_CONFIG.address,
        abi: THUNT_CONTRACT_CONFIG.abi,
        functionName: 'markCompleted',
        args: [tHuntId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Mark THunt completed failed:', error);
      setTxStatus('error');
      setCompletingTHuntId(null);
      lastActionRef.current = null;
    }
  };

  const handleForceCancelTHunt = async (tHuntId) => {
    setCancellingTHuntId(tHuntId);
    setTxStatus('');
    lastActionRef.current = 'cancelTHunt';

    try {
      await writeContract({
        address: THUNT_CONTRACT_CONFIG.address,
        abi: THUNT_CONTRACT_CONFIG.abi,
        functionName: 'forceCancel',
        args: [tHuntId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Force cancel THunt failed:', error);
      setTxStatus('error');
      setCancellingTHuntId(null);
      lastActionRef.current = null;
    }
  };

  const handleRaffleTreasuryTransfer = async (amount) => {
    lastActionRef.current = 'treasuryTransfer';
    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'treasuryTransfer',
        args: [parseEther(amount)],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Raffle transfer failed:', error);
      lastActionRef.current = null;
      throw error;
    }
  };

  const handleTHuntTreasuryTransfer = async (amount) => {
    lastActionRef.current = 'treasuryTransfer';
    try {
      await writeContract({
        address: THUNT_CONTRACT_CONFIG.address,
        abi: THUNT_CONTRACT_CONFIG.abi,
        functionName: 'treasuryTransfer',
        args: [parseEther(amount)],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('THunt transfer failed:', error);
      lastActionRef.current = null;
      throw error;
    }
  };

  // ============================================
  // TAB CONTENT COMPONENTS
  // ============================================
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

  // ============================================
  // ADMIN SUB NAVIGATION
  // ============================================
  const tabItems = [
    { label: 'Create Event', value: 'create' },
    { label: 'Treasure Hunt', value: 'thunt' },
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
        return <CreateRaffleTab 
          rewards={rewards}
          setRewards={setRewards}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          threshold={threshold}
          setThreshold={setThreshold}
          isLoading={isLoading}
          txStatus={txStatus}
          isConfirming={isConfirming}
          handleCreateRaffle={handleCreateRaffle}
        />;
      case 'thunt':
        return <CreateTHuntTab 
          gridWidth={gridWidth}
          setGridWidth={setGridWidth}
          gridHeight={gridHeight}
          setGridHeight={setGridHeight}
          rewardPerTreasure={rewardPerTreasure}
          setRewardPerTreasure={setRewardPerTreasure}
          treasureCount={treasureCount}
          setTreasureCount={setTreasureCount}
          thuntStartDate={thuntStartDate}
          setThuntStartDate={setThuntStartDate}
          thuntEndDate={thuntEndDate}
          setThuntEndDate={setThuntEndDate}
          raffleIdStart={raffleIdStart}
          setRaffleIdStart={setRaffleIdStart}
          raffleIdEnd={raffleIdEnd}
          setRaffleIdEnd={setRaffleIdEnd}
          isCreatingTHunt={isCreatingTHunt}
          txStatus={txStatus}
          isConfirming={isConfirming}
          handleCreateTHunt={handleCreateTHunt}
        />;
      case 'nftdraw':
        return <NFTDrawTab />;
      case 'nadsraffle':
        return <NadsRaffleTab />;
      case 'finalize':
        return <FinalizeCleanupTab 
          CONTRACT_CONFIG={CONTRACT_CONFIG}
          THUNT_CONTRACT_CONFIG={THUNT_CONTRACT_CONFIG}
          activeRaffleIds={activeRaffleIds}
          activeTHuntIds={activeTHuntIds}
          finalizingRaffleId={finalizingRaffleId}
          cancellingRaffleId={cancellingRaffleId}
          completingRaffleId={completingRaffleId}
          endingTHuntId={endingTHuntId}
          completingTHuntId={completingTHuntId}
          cancellingTHuntId={cancellingTHuntId}
          isConfirming={isConfirming}
          handleFinalizeRaffle={handleFinalizeRaffle}
          handleEmergencyCancel={handleEmergencyCancel}
          handleMarkCompleted={handleMarkCompleted}
          handleEndTHunt={handleEndTHunt}
          handleMarkTHuntCompleted={handleMarkTHuntCompleted}
          handleForceCancelTHunt={handleForceCancelTHunt}
        />;
      case 'treasury':
        return <TreasuryTab 
          activeRaffleIds={activeRaffleIds}
          withdrawableAmount={withdrawableAmount}
          activeTHuntIds={activeTHuntIds}
          thuntWithdrawableAmount={thuntWithdrawableAmount}
          isConfirming={isConfirming}
          handleRaffleTreasuryTransfer={handleRaffleTreasuryTransfer}
          handleTHuntTreasuryTransfer={handleTHuntTreasuryTransfer}
        />;
      default:
        return <CreateRaffleTab 
          rewards={rewards}
          setRewards={setRewards}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          threshold={threshold}
          setThreshold={setThreshold}
          isLoading={isLoading}
          txStatus={txStatus}
          isConfirming={isConfirming}
          handleCreateRaffle={handleCreateRaffle}
        />;
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
