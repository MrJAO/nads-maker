import { useState } from 'react';
import { formatEther } from 'viem';

function TreasuryTab({ 
  activeRaffleIds,
  withdrawableAmount,
  activeTHuntIds,
  thuntWithdrawableAmount,
  isConfirming,
  handleRaffleTreasuryTransfer,
  handleTHuntTreasuryTransfer
}) {
  const [selectedTreasury, setSelectedTreasury] = useState('raffle');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  const liveRaffleId = activeRaffleIds && activeRaffleIds.length > 0 ? activeRaffleIds[0] : null;
  const liveTHuntId = activeTHuntIds && activeTHuntIds.length > 0 ? activeTHuntIds[0] : null;

  const currentWithdrawable = selectedTreasury === 'raffle' ? withdrawableAmount : thuntWithdrawableAmount;
  const currentLiveId = selectedTreasury === 'raffle' ? liveRaffleId : liveTHuntId;
  const currentLabel = selectedTreasury === 'raffle' ? 'Raffle' : 'Hunt';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTransferring(true);
    setTxStatus('');
    
    try {
      if (selectedTreasury === 'raffle') {
        await handleRaffleTreasuryTransfer(transferAmount);
      } else {
        await handleTHuntTreasuryTransfer(transferAmount);
      }
      setTxStatus('success');
      setTransferAmount('');
    } catch (error) {
      setTxStatus('error');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Treasury Transfer</h1>

      {/* Treasury Type Selector */}
      <div className="form-group">
        <label>Select Treasury Type</label>
        <select 
          className="form-input"
          value={selectedTreasury}
          onChange={(e) => {
            setSelectedTreasury(e.target.value);
            setTransferAmount('');
            setTxStatus('');
          }}
        >
          <option value="raffle">1 MON Raffle Treasury</option>
          <option value="thunt">Treasure Hunt Treasury</option>
        </select>
      </div>

      {/* Treasury Info Section */}
      <div className="treasury-section">
        
        <div className="treasury-info">
          {currentLiveId && (
            <div className="treasury-row">
              <span className="treasury-label">Live {currentLabel}</span>
              <span className="treasury-value live">
                Yes ({currentLabel} #{currentLiveId.toString()})
              </span>
            </div>
          )}

          <div className="treasury-row highlight">
            <span className="treasury-label">Withdrawable Amount</span>
            <span className="treasury-value highlight">
              {currentWithdrawable ? formatEther(currentWithdrawable) : '0'} MON
            </span>
          </div>
        </div>

        <form className="treasury-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transfer Amount (MON)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              max={currentWithdrawable ? formatEther(currentWithdrawable) : '0'}
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
            disabled={isTransferring || isConfirming || !currentWithdrawable || currentWithdrawable === 0n}
          >
            {isTransferring || isConfirming ? 'Transferring...' : `Transfer ${currentLabel} Funds`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TreasuryTab;