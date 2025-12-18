function CreateRaffleTab({ 
  rewards, 
  setRewards, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  threshold, 
  setThreshold, 
  isLoading, 
  txStatus, 
  isConfirming, 
  handleCreateRaffle 
}) {
  return (
    <div className="admin-panel">
      <h1 className="admin-title">Create 1 MON Raffle</h1>
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
}

export default CreateRaffleTab;