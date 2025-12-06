import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useReadContract, useReadContracts } from 'wagmi';
import { ADMIN_ADDRESS } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';

const CONTRACT_ADDRESS = '0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE';
const ENTRY_FEE = 1;

function MonAnalytics() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    totalParticipants: 0,
    roundParticipants: 0,
    totalRewards: 0,
    totalMonParticipated: 0,
  });

  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeChart, setActiveChart] = useState('participants');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  // Read nextRaffleId
  const { data: nextRaffleId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: OneMONABI,
    functionName: 'nextRaffleId',
  });

  // Generate raffle IDs for last 24 raffles
  const raffleIds = useMemo(() => {
    if (!nextRaffleId) return [];
    const count = Math.min(24, Number(nextRaffleId) - 1);
    const start = Math.max(1, Number(nextRaffleId) - 24);
    return Array.from({ length: count }, (_, i) => start + i);
  }, [nextRaffleId]);

  // Batch read all raffle info
  const { data: rafflesData, isError: rafflesError, isLoading: rafflesLoading } = useReadContracts({
    contracts: raffleIds.map(id => ({
      address: CONTRACT_ADDRESS,
      abi: OneMONABI,
      functionName: 'getRaffleInfo',
      args: [id],
    })),
  });

  // Batch read all participants
  const { data: participantsData, isError: participantsError, isLoading: participantsLoading } = useReadContracts({
    contracts: raffleIds.map(id => ({
      address: CONTRACT_ADDRESS,
      abi: OneMONABI,
      functionName: 'getParticipants',
      args: [id],
    })),
  });

  // Process data when loaded
  useEffect(() => {
    if (!rafflesData || !participantsData || rafflesLoading || participantsLoading) {
      setIsLoading(true);
      return;
    }

    if (rafflesError || participantsError) {
      setError('Analytics is currently not syncing or working');
      setIsLoading(false);
      return;
    }

    try {
      // Process raffles
      const raffles = rafflesData.map((r, idx) => {
        if (!r.result) return null;
        return {
          id: raffleIds[idx],
          startTime: Number(r.result[0]),
          endTime: Number(r.result[1]),
          threshold: Number(r.result[2]),
          rewardAmount: Number(r.result[3]) / 1e18,
          participantCount: Number(r.result[4]),
          winner: r.result[5],
          rewardClaimed: r.result[6],
          claimDeadline: Number(r.result[7]),
          refundsClaimedCount: Number(r.result[8]),
          state: Number(r.result[9]),
        };
      }).filter(Boolean);

      // Get unique participants
      const allParticipants = new Set();
      participantsData.forEach(p => {
        if (p.result && Array.isArray(p.result)) {
          p.result.forEach(addr => allParticipants.add(addr.toLowerCase()));
        }
      });

      const totalParticipants = allParticipants.size;

      // Calculate stats
      const completedRaffles = raffles.filter(r => r.state === 5 && r.rewardClaimed);
      const totalRewards = completedRaffles.reduce((sum, r) => sum + r.rewardAmount, 0);
      const totalMon = raffles.reduce((sum, r) => sum + (r.participantCount * ENTRY_FEE), 0);
      const avgParticipants = raffles.length > 0 
        ? Math.floor(raffles.reduce((sum, r) => sum + r.participantCount, 0) / raffles.length) 
        : 0;

      // Map each raffle to chart data
      const participantsHistory = raffles.map(r => r.participantCount);
      const rewardsHistory = raffles.map(r => 
        (r.state === 5 && r.rewardClaimed) ? Math.floor(r.rewardAmount) : 0
      );
      const raffleLabels = raffles.map(r => `#${r.id}`);

      setAnalyticsData({
        totalParticipants,
        roundParticipants: avgParticipants,
        totalRewards: Math.floor(totalRewards),
        totalMonParticipated: Math.floor(totalMon),
        participantsHistory,
        rewardsHistory,
        raffleLabels,
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Analytics processing error:', err);
      setError('Analytics is currently not syncing or working');
      setIsLoading(false);
    }
  }, [rafflesData, participantsData, rafflesLoading, participantsLoading, rafflesError, participantsError]);

  // Animate numbers
  useEffect(() => {
    if (!analyticsData) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalParticipants: Math.floor(analyticsData.totalParticipants * easeOut),
        roundParticipants: Math.floor(analyticsData.roundParticipants * easeOut),
        totalRewards: Math.floor(analyticsData.totalRewards * easeOut),
        totalMonParticipated: Math.floor(analyticsData.totalMonParticipated * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [analyticsData]);

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

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getMaxValue = (data) => {
    return Math.max(...data, 1);
  };

  if (isLoading) {
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
            <button className="nads-btn" onClick={() => navigate('//1mon')}>1 MON</button>
            <button className="nads-btn" onClick={() => navigate('/nft-draw')}>NFT Draw</button>
            <button className="nads-btn" onClick={() => navigate('/profile')}>Profile</button>
            <button className="nads-btn primary" onClick={handleWalletClick}>
              {isConnected ? shortenAddress(address) : 'Connect Wallet'}
            </button>
          </div>
        </header>
        <div className="sub-nav">
          <button className="sub-nav-btn" onClick={() => navigate('/1mon')}>Live</button>
          <button className="sub-nav-btn" onClick={() => navigate('/prev-raffle')}>Previous Activities</button>
          <button className="sub-nav-btn active">Analytics</button>
        </div>
        <main className="nads-main analytics-main">
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
            Loading analytics...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
        <div className="sub-nav">
          <button className="sub-nav-btn" onClick={() => navigate('/1mon')}>Live</button>
          <button className="sub-nav-btn" onClick={() => navigate('/prev-raffle')}>Previous Activities</button>
          <button className="sub-nav-btn active">Analytics</button>
        </div>
        <main className="nads-main analytics-main">
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#ff6b6b' }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

  const currentChartData = activeChart === 'participants' 
    ? analyticsData.participantsHistory 
    : analyticsData.rewardsHistory;

  const maxChartValue = getMaxValue(currentChartData);

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

      <div className="sub-nav">
        <button className="sub-nav-btn" onClick={() => navigate('/1mon')}>Live</button>
        <button className="sub-nav-btn" onClick={() => navigate('/prev-raffle')}>Previous Activities</button>
        <button className="sub-nav-btn active">Analytics</button>
      </div>
      
      <main className="nads-main analytics-main">
        <h1 className="page-title">1 MON Analytics</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem' }}>Past 24 Raffle Data</p>

        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="analytics-icon">👥</div>
            <div className="analytics-value">{formatNumber(animatedValues.totalParticipants)}</div>
            <div className="analytics-label">Unique Participants</div>
            <div className="analytics-subtitle">Last 24 Raffles</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">🎯</div>
            <div className="analytics-value">{formatNumber(animatedValues.roundParticipants)}</div>
            <div className="analytics-label">Round Participants</div>
            <div className="analytics-subtitle">Average per round</div>
          </div>

          <div className="analytics-card highlight">
            <div className="analytics-icon">🏆</div>
            <div className="analytics-value">{formatNumber(animatedValues.totalRewards)}</div>
            <div className="analytics-label">Total Rewards</div>
            <div className="analytics-subtitle">MON distributed</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">💰</div>
            <div className="analytics-value">{formatNumber(animatedValues.totalMonParticipated)}</div>
            <div className="analytics-label">Total 1 MON Participated</div>
            <div className="analytics-subtitle">MON in all rounds</div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">
              {activeChart === 'participants' ? 'Participants History' : 'Rewards History'}
            </h2>
            <div className="chart-toggle">
              <button 
                className={`chart-toggle-btn ${activeChart === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveChart('participants')}
              >
                Participants
              </button>
              <button 
                className={`chart-toggle-btn ${activeChart === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveChart('rewards')}
              >
                Rewards
              </button>
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-y-axis">
              <span>{formatNumber(maxChartValue)}</span>
              <span>{formatNumber(Math.floor(maxChartValue / 2))}</span>
              <span>0</span>
            </div>
            <div className="chart-bars">
              {currentChartData.map((value, index) => (
                <div 
                  key={index}
                  className="chart-bar-wrapper"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className={`chart-bar ${activeChart} ${hoveredBar === index ? 'hovered' : ''}`}
                    style={{ 
                      height: `${maxChartValue > 0 ? (value / maxChartValue) * 100 : 0}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {hoveredBar === index && (
                      <div className="chart-tooltip">
                        {formatNumber(value)} {activeChart === 'rewards' ? 'MON' : ''}
                      </div>
                    )}
                  </div>
                  <span className="chart-label">{analyticsData.raffleLabels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MonAnalytics;