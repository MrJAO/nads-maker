import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';

// ============================================
// CONTRACT CONFIGURATION
// ============================================
const CONTRACT_CONFIG = {
  address: '0x26A56f3245161CE7938200F1366A1cf9549c7e20',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

function NadsMaker() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [currentRaffleId, setCurrentRaffleId] = useState(null);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Get active raffle IDs
  const { data: activeRaffleIds } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getActiveRaffleIds',
  });

  // Get raffle info for the first active raffle
  const { data: raffleInfo, refetch: refetchRaffleInfo } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getRaffleInfo',
    args: currentRaffleId ? [currentRaffleId] : undefined,
    enabled: !!currentRaffleId,
  });

  // Check if user has already participated
  const { data: hasParticipated, refetch: refetchParticipation } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'isParticipant',
    args: currentRaffleId && address ? [currentRaffleId, address] : undefined,
    enabled: !!currentRaffleId && !!address,
  });

  // Get next raffle ID (total count)
  const { data: nextRaffleId } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextRaffleId',
  });

  // Get last completed raffle when no active raffle exists
  const lastRaffleId = nextRaffleId && nextRaffleId > 0n ? nextRaffleId - 1n : null;
  const hasActiveRaffle = activeRaffleIds && activeRaffleIds.length > 0;
  
  const { data: lastRaffleInfo } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getRaffleInfo',
    args: lastRaffleId ? [lastRaffleId] : undefined,
    enabled: !hasActiveRaffle && !!lastRaffleId,
  });

  // Set current raffle ID when active raffles load
  useEffect(() => {
    if (activeRaffleIds && activeRaffleIds.length > 0) {
      setCurrentRaffleId(activeRaffleIds[0]);
    }
  }, [activeRaffleIds]);

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
      setIsLoading(false);
      refetchRaffleInfo();
      refetchParticipation();
    }
  }, [isSuccess, refetchRaffleInfo, refetchParticipation]);

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

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = () => {
    if (!raffleInfo) return 0;
    const current = Number(raffleInfo[4]);
    const threshold = Number(raffleInfo[2]);
    return threshold > 0 ? Math.min((current / threshold) * 100, 100) : 0;
  };

  const calculateLastRoundProgress = () => {
    if (!lastRaffleInfo) return 0;
    const current = Number(lastRaffleInfo[4]);
    const threshold = Number(lastRaffleInfo[2]);
    return threshold > 0 ? Math.min((current / threshold) * 100, 100) : 0;
  };

  const isLastRoundThresholdMet = () => {
    if (!lastRaffleInfo) return false;
    const current = Number(lastRaffleInfo[4]);
    const threshold = Number(lastRaffleInfo[2]);
    return current >= threshold;
  };

  // Get raffle status with all states
  const getRaffleStatus = () => {
    if (!raffleInfo) return { status: 'none', text: 'No active raffle', canJoin: false };
    
    const state = raffleInfo[9];
    const startTime = Number(raffleInfo[0]);
    const endTime = Number(raffleInfo[1]);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime < startTime) {
      return { status: 'pending', text: `Raffle starts at ${formatDate(raffleInfo[0])}`, canJoin: false };
    }
    
    if (currentTime > endTime || (state !== 0 && state !== 1)) {
      return { status: 'ended', text: 'No Live Raffle available', canJoin: false };
    }
    
    return { status: 'live', text: '● LIVE', canJoin: true };
  };

  // ============================================
  // CONTRACT INTERACTION - Participate in Raffle
  // ============================================
  const handleParticipate = async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    if (!currentRaffleId || !getRaffleStatus().canJoin || hasParticipated) {
      setTxStatus('error');
      return;
    }

    setIsLoading(true);
    setTxStatus('');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'joinRaffle',
        args: [currentRaffleId],
        value: parseEther('1'),
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      setTxStatus('error');
      setIsLoading(false);
    }
  };

  // Display data from contract or placeholder
  const displayData = raffleInfo ? {
    cost: '1',
    rewards: formatEther(raffleInfo[3]),
    startDate: formatDate(raffleInfo[0]),
    endDate: formatDate(raffleInfo[1]),
    threshold: raffleInfo[2].toString(),
    currentProgress: raffleInfo[4].toString(),
    state: raffleInfo[9],
  } : {
    cost: '1',
    rewards: '0',
    startDate: 'Loading...',
    endDate: 'Loading...',
    threshold: '0',
    currentProgress: '0',
  };

  const displayLastRound = !hasActiveRaffle && lastRaffleInfo;
  const lastRoundData = displayLastRound ? {
    cost: '1',
    rewards: formatEther(lastRaffleInfo[3]),
    startDate: formatDate(lastRaffleInfo[0]),
    endDate: formatDate(lastRaffleInfo[1]),
    threshold: lastRaffleInfo[2].toString(),
    currentProgress: lastRaffleInfo[4].toString(),
    state: lastRaffleInfo[9],
  } : displayData;

  const raffleStatus = getRaffleStatus();

  const toggleMusic = () => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
  };

  // ============================================
  // FAQ COMPONENT
  // ============================================
  const ImportantFAQs = () => (
    <div className="faq-section">
      <h2 className="faq-title">Important FAQs</h2>
      
      <div className="faq-item">
        <p className="faq-question">1. Rewards/Refunds Mechanism</p>
        <p className="faq-answer">The system calculates participants Rewards/Refunds first then include it in the Reserved Funds which an organizer/admin/developer can't drain/rug/transfer. This ensure that the participants would able to claim their Rewards/Refunds within 3 days without any problem.</p>
      </div>

      <div className="faq-item">
        <p className="faq-question">2. Claim Windows</p>
        <p className="faq-answer">Participants must claim their Rewards/Refunds within 3 days. All unclaimed Rewards/Refunds will be transferred to Treasury Address. Always claim within the deadline.</p>
      </div>

      <div className="faq-item">
        <p className="faq-question">3. Wallet Integration</p>
        <p className="faq-answer">This dApp uses WAGMI integration and for the best experience use "Metamask" wallet. If the popup confirmation shows "Likely to Fail" or "Network Error Fee", decline the confirmation and try again. DON'T RUSH and ALWAYS READ THE MESSAGE.</p>
      </div>

      <div className="faq-item">
        <p className="faq-question">4. Threshold Mechanism</p>
        <p className="faq-answer">If the participant threshold is not met by the end date, the raffle is considered unsuccessful and all participants can claim a full refund of their 1 MON participation fee.</p>
      </div>

      <div className="faq-item">
        <p className="faq-question">5. Winning Participant</p>
        <p className="faq-answer">A participant will be selected using Pyth Network's verifiable randomness (VRF), ensuring a fair and tamper-proof selection process.</p>
      </div>
    </div>
  );

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

      {/* Sub Navigation */}
      <div className="sub-nav">
        <button className="sub-nav-btn active">Live</button>
        <button className="sub-nav-btn" onClick={() => navigate('/prev-raffle')}>Previous Activities</button>
        <button className="sub-nav-btn" onClick={() => navigate('/1mon-analytics')}>Analytics</button>
      </div>
      
<main className="nads-main">
        <div className="raffle-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            <h1 className="raffle-title" style={{ marginBottom: 0 }}>1 MON and A Dream</h1>
            <button 
              onClick={toggleMusic}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                transition: 'transform 0.2s',
                padding: '5px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? '🔊' : '🔇'}
            </button>
          </div>

          <audio ref={audioRef} src="/1_MON_and_a_Dream.m4a" loop />
          
          {raffleStatus.status === 'live' ? (
            <>
              <div className="raffle-status live">{raffleStatus.text}</div>

              <div className="raffle-info">
                <div className="raffle-row">
                  <span className="raffle-label">Cost</span>
                  <span className="raffle-value">{displayData.cost} MON</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Rewards</span>
                  <span className="raffle-value highlight">{displayData.rewards} MON</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Start Date</span>
                  <span className="raffle-value">{displayData.startDate}</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">End Date</span>
                  <span className="raffle-value">{displayData.endDate}</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Threshold</span>
                  <span className="raffle-value">{displayData.threshold} Participants</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{displayData.currentProgress} / {displayData.threshold} Participants</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="progress-percent">{calculateProgress().toFixed(1)}%</div>
              </div>

              {/* Guidelines Notice */}
              <p className="guidelines-notice">
                Please read the{' '}
                <span 
                  className="guidelines-link" 
                  onClick={() => navigate('/docs')}
                >
                  Guidelines
                </span>
                {' '}before participating.
              </p>

              {/* Agreement Checkbox */}
              <label className="agreement-label">
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="agreement-checkbox"
                />
                <span className="agreement-text">
                  By checking this box, I confirm that I have read, understood, and agree to the Guidelines. I acknowledge that this raffle is for entertainment purposes only, not a financial investment or gambling activity, and that participation involves risks, including potential loss of MON. I further agree to comply with all applicable laws in my jurisdiction.
                </span>
              </label>

              {/* Transaction Status */}
              {txStatus === 'success' && (
                <p className="tx-status success">Participation successful!</p>
              )}
              {txStatus === 'error' && (
                <p className="tx-status error">Transaction failed. Please try again.</p>
              )}

              {/* Participate Button */}
              <button 
                className={`participate-btn ${(!agreed || hasParticipated) ? 'disabled' : ''}`}
                disabled={!agreed || isLoading || isConfirming || hasParticipated}
                onClick={handleParticipate}
              >
                {hasParticipated ? 'Already Participated' :
                 isLoading || isConfirming ? 'Processing...' : 
                 isConnected ? 'Participate (1 MON)' : 'Connect Wallet to Participate'}
              </button>
            </>
          ) : (hasActiveRaffle && raffleStatus.status === 'ended') || displayLastRound ? (
            <>
              <div className="raffle-status not-live">{raffleStatus.text}</div>
              
              <div className="last-round-section">
                <h3 className="last-round-title">Last Round Stats</h3>
                
                <div className="raffle-info">
                  <div className="raffle-row">
                    <span className="raffle-label">Raffle ID</span>
                    <span className="raffle-value">#{lastRaffleId?.toString()}</span>
                  </div>
                  <div className="raffle-row">
                    <span className="raffle-label">Rewards</span>
                    <span className="raffle-value highlight">{lastRoundData.rewards} MON</span>
                  </div>
                  <div className="raffle-row">
                    <span className="raffle-label">Start Date</span>
                    <span className="raffle-value">{lastRoundData.startDate}</span>
                  </div>
                  <div className="raffle-row">
                    <span className="raffle-label">End Date</span>
                    <span className="raffle-value">{lastRoundData.endDate}</span>
                  </div>
                  <div className="raffle-row">
                    <span className="raffle-label">Threshold Status</span>
                    <span className={`raffle-value ${isLastRoundThresholdMet() ? 'threshold-met' : 'threshold-not-met'}`}>
                      {isLastRoundThresholdMet() ? '✓ Threshold Met' : '✗ Threshold Not Met'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Final Progress</span>
                    <span>{lastRoundData.currentProgress} / {lastRoundData.threshold} Participants</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${isLastRoundThresholdMet() ? 'success' : 'failed'}`}
                      style={{ width: `${calculateLastRoundProgress()}%` }}
                    ></div>
                  </div>
                  <div className="progress-percent">{calculateLastRoundProgress().toFixed(1)}%</div>
                </div>
              </div>
            </>
          ) : hasActiveRaffle && raffleStatus.status === 'pending' ? (
            <>
              <div className="raffle-status pending">{raffleStatus.text}</div>
              
              <div className="raffle-info">
                <div className="raffle-row">
                  <span className="raffle-label">Cost</span>
                  <span className="raffle-value">{displayData.cost} MON</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Rewards</span>
                  <span className="raffle-value highlight">{displayData.rewards} MON</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Start Date</span>
                  <span className="raffle-value">{displayData.startDate}</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">End Date</span>
                  <span className="raffle-value">{displayData.endDate}</span>
                </div>
                <div className="raffle-row">
                  <span className="raffle-label">Threshold</span>
                  <span className="raffle-value">{displayData.threshold} Participants</span>
                </div>
              </div>

              <p className="pending-notice">This raffle has not started yet. Check back at the start time to participate!</p>
            </>
          ) : (
            <p className="no-raffle-message">No active raffle at the moment. Check back soon!</p>
          )}
        </div>

        {/* Important FAQs - Separate Section */}
        <ImportantFAQs />
      </main>
    </div>
  );
}

export default NadsMaker;
