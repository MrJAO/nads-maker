import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';

function FinalizeCleanupTab({ 
  CONTRACT_CONFIG,
  THUNT_CONTRACT_CONFIG,
  activeRaffleIds,
  activeTHuntIds,
  finalizingRaffleId,
  cancellingRaffleId,
  completingRaffleId,
  endingTHuntId,
  completingTHuntId,
  cancellingTHuntId,
  isConfirming,
  handleFinalizeRaffle,
  handleEmergencyCancel,
  handleMarkCompleted,
  handleEndTHunt,
  handleMarkTHuntCompleted,
  handleForceCancelTHunt
}) {
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

  const ActiveTHuntCard = ({ tHuntId }) => {
    const { data: huntInfo } = useReadContract({
      address: THUNT_CONTRACT_CONFIG.address,
      abi: THUNT_CONTRACT_CONFIG.abi,
      functionName: 'getTHuntInfo',
      args: [tHuntId],
    });

    if (!huntInfo) return null;

    const endTime = Number(huntInfo[4]);
    const treasureCount = Number(huntInfo[2]);
    const treasuresFound = Number(huntInfo[7]);
    const state = huntInfo[9];
    const isActiveOrCreated = state === 0 || state === 1;
    const isPastEndTime = currentTime > endTime;

    if (!isActiveOrCreated) return null;

    return (
      <div className="active-raffle-card">
        <div className="raffle-card-header">
          <span className="raffle-id">Hunt #{tHuntId.toString()}</span>
          <span className={`raffle-state ${isPastEndTime ? 'expired' : 'active'}`}>
            {state === 0 ? 'Created' : isPastEndTime ? 'Ended' : 'Active'}
          </span>
        </div>
        <div className="raffle-card-body">
          <p>Treasures: {treasuresFound}/{treasureCount}</p>
          <p>Grid Size: {huntInfo[0].toString()}</p>
          <p>End: {new Date(endTime * 1000).toLocaleString()}</p>
        </div>
        {isPastEndTime && state === 1 && (
          <div className="raffle-card-actions">
            <button
              className="finalize-btn"
              onClick={() => handleEndTHunt(tHuntId)}
              disabled={endingTHuntId === tHuntId || isConfirming}
            >
              {endingTHuntId === tHuntId ? 'Ending...' : 'End Hunt'}
            </button>
          </div>
        )}
        {state === 0 && (
          <div className="raffle-card-actions">
            <button
              className="cancel-btn"
              onClick={() => handleForceCancelTHunt(tHuntId)}
              disabled={cancellingTHuntId === tHuntId || isConfirming}
            >
              {cancellingTHuntId === tHuntId ? 'Cancelling...' : 'Force Cancel (VRF Timeout)'}
            </button>
          </div>
        )}
      </div>
    );
  };

const EndedTHuntCard = ({ tHuntId }) => {
    
  const { data: huntInfo } = useReadContract({
    address: THUNT_CONTRACT_CONFIG.address,
    abi: THUNT_CONTRACT_CONFIG.abi,
    functionName: 'getTHuntInfo',
    args: [tHuntId],
  });

  if (!huntInfo) return null;

    const state = huntInfo[9];
    const claimDeadline = Number(huntInfo[8]);
    const treasureCount = Number(huntInfo[2]);
    const treasuresFound = Number(huntInfo[7]);
    const isEndedState = state === 2;

    if (!isEndedState) return null;

    const canMarkCompleted = currentTime > claimDeadline;
    const timeUntilMarkable = claimDeadline - currentTime;

    return (
      <div className="active-raffle-card">
        <div className="raffle-card-header">
          <span className="raffle-id">Hunt #{tHuntId.toString()}</span>
          <span className="raffle-state expired">Ended</span>
        </div>
        <div className="raffle-card-body">
          <p>Treasures Found: {treasuresFound}/{treasureCount}</p>
          <p>Grid Size: {huntInfo[0].toString()}</p>
          <p>Claim Deadline: {new Date(claimDeadline * 1000).toLocaleString()}</p>
        </div>
        <button
          className="finalize-btn"
          onClick={() => handleMarkTHuntCompleted(tHuntId)}
          disabled={!canMarkCompleted || completingTHuntId === tHuntId || isConfirming}
        >
          {completingTHuntId === tHuntId ? 'Marking...' : 'Mark Completed'}
        </button>
        {!canMarkCompleted && (
          <p className="countdown-timer">{formatCountdown(timeUntilMarkable)}</p>
        )}
      </div>
    );
  };

  const activeRaffles = activeRaffleIds || [];
  const activeTHunts = activeTHuntIds || [];
  const hasActiveRaffles = activeRaffles.length > 0;
  const hasActiveTHunts = activeTHunts.length > 0;

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
        <h2 className="section-title">Ended Raffles / Cleanup</h2>
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

      <div className="cleanup-section">
        <h2 className="section-title">Active Treasure Hunts</h2>
        {hasActiveTHunts ? (
          <div className="raffles-list">
            {activeTHunts.map((tHuntId) => (
              <ActiveTHuntCard key={tHuntId.toString()} tHuntId={tHuntId} />
            ))}
          </div>
        ) : (
          <p className="no-raffles">No active treasure hunts</p>
        )}
      </div>

      <div className="cleanup-section">
        <h2 className="section-title">Ended Hunts / Cleanup</h2>
        {hasActiveTHunts ? (
          <div className="raffles-list">
            {activeTHunts.map((tHuntId) => (
              <EndedTHuntCard key={tHuntId.toString()} tHuntId={tHuntId} />
            ))}
          </div>
        ) : (
          <p className="no-raffles">No hunts pending cleanup</p>
        )}
      </div>
    </div>
  );
}

export default FinalizeCleanupTab;