import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { ADMIN_ADDRESS, monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';

const CONTRACT_CONFIG = {
  address: '0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

function PrevRaffle() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  // Get total raffle count
  const { data: nextRaffleId } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextRaffleId',
  });

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
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const openExplorer = (addr) => {
    window.open(`https://monadvision.com/address/${addr}`, '_blank');
  };

  // Generate array of completed raffle IDs to fetch
  const completedRaffleIds = nextRaffleId && nextRaffleId > 1n 
    ? Array.from({ length: Number(nextRaffleId) - 1 }, (_, i) => BigInt(Number(nextRaffleId) - 1 - i))
    : [];

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
        <button className="sub-nav-btn" onClick={() => navigate('/1mon')}>Live</button>
        <button className="sub-nav-btn active">Previous Activities</button>
        <button className="sub-nav-btn" onClick={() => navigate('/1mon-analytics')}>Analytics</button>
      </div>
      
      <main className="nads-main prev-raffle-main">
        
        <div className="prev-raffle-container">
          {completedRaffleIds.length > 0 ? (
            completedRaffleIds.map((raffleId) => (
              <RaffleCard key={raffleId.toString()} raffleId={raffleId} />
            ))
          ) : (
            <p className="no-raffle-message">No completed raffles yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

function RaffleCard({ raffleId }) {
  const { data: raffleInfo } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getRaffleInfo',
    args: [raffleId],
  });

  if (!raffleInfo) return null;

  const endTime = Number(raffleInfo[1]);
  const threshold = Number(raffleInfo[2]);
  const rewardAmount = raffleInfo[3];
  const participantCount = Number(raffleInfo[4]);
  const winner = raffleInfo[5];
  const refundsClaimedCount = Number(raffleInfo[8]);
  const state = raffleInfo[9];

  // Only show completed raffles
  // if (state !== 5) return null; // 5 = Completed

  if (Date.now() / 1000 < endTime) return null;

  const isSuccessful = participantCount >= threshold;
  const thresholdPercent = threshold > 0 ? ((participantCount / threshold) * 100).toFixed(0) : 0;
  const totalRefundAmount = participantCount;

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const openExplorer = (addr) => {
    window.open(`https://monadvision.com/address/${addr}`, '_blank');
  };

  return (
    <div className={`prev-raffle-card ${isSuccessful ? 'successful' : 'unsuccessful'}`}>
      <div className={`raffle-card-status ${isSuccessful ? 'successful' : 'unsuccessful'}`}>
        {isSuccessful ? '✓ Successful' : '✗ Unsuccessful'}
      </div>

      <div className="raffle-card-dates">
        <span>Ended: {formatDate(endTime)}</span>
      </div>

      {isSuccessful ? (
        <div className="raffle-card-info">
          <div className="raffle-card-row">
            <span className="card-label">Raffle ID</span>
            <span className="card-value">#{raffleId.toString()}</span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Rewards</span>
            <span className="card-value highlight">{formatEther(rewardAmount)} MON</span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Winner</span>
            <span 
              className="card-value clickable"
              onClick={() => openExplorer(winner)}
            >
              {shortenAddress(winner)}
            </span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Participants</span>
            <span className="card-value">{participantCount}</span>
          </div>
        </div>
      ) : (
        <div className="raffle-card-info">
          <div className="raffle-card-row">
            <span className="card-label">Raffle ID</span>
            <span className="card-value">#{raffleId.toString()}</span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Threshold</span>
            <span className="card-value warning">{thresholdPercent}% filled</span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Total Refund</span>
            <span className="card-value">{totalRefundAmount} MON</span>
          </div>
          <div className="raffle-card-row">
            <span className="card-label">Refund Status</span>
            <span className="card-value success-text">
              {refundsClaimedCount}/{participantCount} claimed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrevRaffle;