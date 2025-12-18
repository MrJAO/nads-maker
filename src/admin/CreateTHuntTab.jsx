function CreateTHuntTab({ 
  gridWidth,
  setGridWidth,
  gridHeight,
  setGridHeight,
  rewardPerTreasure,
  setRewardPerTreasure,
  treasureCount,
  setTreasureCount,
  thuntStartDate,
  setThuntStartDate,
  thuntEndDate,
  setThuntEndDate,
  raffleIdStart,
  setRaffleIdStart,
  raffleIdEnd,
  setRaffleIdEnd,
  isCreatingTHunt,
  txStatus,
  isConfirming,
  handleCreateTHunt
}) {
  const totalSquares = (parseInt(gridWidth) || 0) * (parseInt(gridHeight) || 0);
  const maxTreasures = totalSquares > 0 ? totalSquares : 1;

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Create Treasure Hunt</h1>
      <p className="section-subtitle">Grid-based treasure hunt game</p>
      
      <form className="admin-form" onSubmit={handleCreateTHunt}>
        <div className="form-row">
          <div className="form-group half">
            <label>Grid Width (1-100)</label>
            <input 
              type="number" 
              step="1"
              min="1"
              max="100"
              className="form-input"
              placeholder="e.g. 10"
              value={gridWidth}
              onChange={(e) => {
                const val = Math.floor(Number(e.target.value));
                if (val >= 0 && val <= 100) {
                  setGridWidth(val.toString());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              disabled={isCreatingTHunt}
              required
            />
          </div>

          <div className="form-group half">
            <label>Grid Height (1-100)</label>
            <input 
              type="number" 
              step="1"
              min="1"
              max="100"
              className="form-input"
              placeholder="e.g. 10"
              value={gridHeight}
              onChange={(e) => {
                const val = Math.floor(Number(e.target.value));
                if (val >= 0 && val <= 100) {
                  setGridHeight(val.toString());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              disabled={isCreatingTHunt}
              required
            />
          </div>
        </div>

        {totalSquares > 0 && (
          <div className="grid-preview">
            <span>Grid: {gridWidth} × {gridHeight} = {totalSquares} squares</span>
          </div>
        )}

        <div className="form-group">
          <label>Reward Per Treasure (MON)</label>
          <input 
            type="number" 
            step="0.01"
            min="0"
            className="form-input"
            placeholder="e.g. 10"
            value={rewardPerTreasure}
            onChange={(e) => setRewardPerTreasure(e.target.value)}
            disabled={isCreatingTHunt}
            required
          />
        </div>

        <div className="form-group">
          <label>Treasure Count (max: {maxTreasures})</label>
          <input 
            type="number" 
            step="1"
            min="1"
            max={maxTreasures}
            className="form-input"
            placeholder="e.g. 5"
            value={treasureCount}
            onChange={(e) => {
              const val = Math.floor(Number(e.target.value));
              if (val >= 0 && val <= maxTreasures) {
                setTreasureCount(val.toString());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                e.preventDefault();
              }
            }}
            disabled={isCreatingTHunt}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input 
            type="datetime-local" 
            className="form-input"
            value={thuntStartDate}
            onChange={(e) => setThuntStartDate(e.target.value)}
            disabled={isCreatingTHunt}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input 
            type="datetime-local" 
            className="form-input"
            value={thuntEndDate}
            onChange={(e) => setThuntEndDate(e.target.value)}
            disabled={isCreatingTHunt}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Raffle ID Start</label>
            <input 
              type="number" 
              step="1"
              min="0"
              className="form-input"
              placeholder="e.g. 1"
              value={raffleIdStart}
              onChange={(e) => {
                const val = Math.floor(Number(e.target.value));
                if (val >= 0) {
                  setRaffleIdStart(val.toString());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              disabled={isCreatingTHunt}
              required
            />
          </div>

          <div className="form-group half">
            <label>Raffle ID End</label>
            <input 
              type="number" 
              step="1"
              min="0"
              className="form-input"
              placeholder="e.g. 5"
              value={raffleIdEnd}
              onChange={(e) => {
                const val = Math.floor(Number(e.target.value));
                if (val >= 0) {
                  setRaffleIdEnd(val.toString());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              disabled={isCreatingTHunt}
              required
            />
          </div>
        </div>

        {totalSquares > 0 && treasureCount && (
          <div className="summary-preview">
            <p>Total Rewards: {(parseFloat(rewardPerTreasure) || 0) * (parseInt(treasureCount) || 0)} MON</p>
          </div>
        )}

        {txStatus === 'success' && (
          <p className="tx-status success">Transaction successful!</p>
        )}
        {txStatus === 'error' && (
          <p className="tx-status error">Transaction failed. Please try again.</p>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isCreatingTHunt || isConfirming || totalSquares === 0}
        >
          {isCreatingTHunt || isConfirming ? 'Creating...' : 'Create Treasure Hunt'}
        </button>
      </form>
    </div>
  );
}

export default CreateTHuntTab;
