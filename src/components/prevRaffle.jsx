import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { monadMainnet } from '../walletIntegration/config';
import OneMONABI from '../abi/OneMON.json';
import Header from './Header';
import SubNav from './SubNav';
import '../css/prevRaffle.css';

const CONTRACT_CONFIG = {
  address: '0x188E095Aab1f75E7F8c39480C45005854ef31fcB',
  abi: OneMONABI,
  chainId: monadMainnet.id,
};

function PrevRaffle() {

  // Get total raffle count
  const { data: nextRaffleId } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextRaffleId',
  });

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
      <Header />
      <SubNav />
      
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
  const isCancelled = state === 6; // 6 = Cancelled
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

  // Determine card type
  const getCardType = () => {
    if (isCancelled) return 'cancelled';
    if (isSuccessful) return 'successful';
    return 'unsuccessful';
  };

  const getStatusText = () => {
    if (isCancelled) return '⊘ Cancelled';
    if (isSuccessful) return '✓ Successful';
    return '✗ Unsuccessful';
  };

  const cardType = getCardType();

  return (
    <div className={`prev-raffle-card ${cardType}`}>
      <div className={`raffle-card-status ${cardType}`}>
        {getStatusText()}
      </div>

      <div className="raffle-card-dates">
        <span>Ended: {formatDate(endTime)}</span>
      </div>

      {isSuccessful && !isCancelled ? (
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
            <span className={`card-value ${isCancelled ? '' : 'warning'}`}>{thresholdPercent}% filled</span>
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
