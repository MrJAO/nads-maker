import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Docs() {
  const [activeTab, setActiveTab] = useState('guidelines');
  const navigate = useNavigate();

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <div className="docs-title" onClick={() => navigate('/nadsmaker')}>Documentation</div>
        <nav className="docs-nav">
          <button 
            className={`docs-nav-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            Guidelines
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === '1mon' ? 'active' : ''}`}
            onClick={() => setActiveTab('1mon')}
          >
            1 MON and A Dream
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === 'nftDraw' ? 'active' : ''}`}
            onClick={() => setActiveTab('nftDraw')}
          >
            NFT Draw
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            Smart Contract
          </button>
        </nav>

        {/* Sidebar Links */}
        <div className="docs-sidebar-links">
          <a href="https://github.com/MrJAO/nads-maker" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            <span className="sidebar-link-icon">📦</span>
            <span>GitHub</span>
          </a>
          <a href="https://x.com/CryptoModJAO" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            <span className="sidebar-link-icon">𝕏</span>
            <span>Twitter</span>
          </a>
          <div className="sidebar-support">
            <span className="sidebar-link-icon">💬</span>
            <span>If you have any questions or experienced a problem, message me on X/Twitter</span>
          </div>
        </div>
      </aside>

      <main className="docs-content">
        {activeTab === 'guidelines' && (
          <div className="docs-section">
            <h1>Guidelines</h1>

            <h2>1. Entertainment & Community Focus</h2>
            <p>This raffle is designed as a community engagement tool and entertainment activity, not a financial investment or gambling opportunity. Participation is optional and intended to foster interaction within the Monad ecosystem. The threshold requirement is a community-driven goal (e.g., minimum number of participants or total MON raised) to ensure fairness and participation, not a profit-seeking mechanism. All outcomes are random and for fun. This raffle is not a security, investment contract, or financial product under any jurisdiction.</p>

            <h2>2. No Financial Guarantee</h2>
            <p>Participation does not guarantee any return, profit, or future value of MON or rewards. The organizer does not promise, suggest, or imply any financial gain from this activity. All outcomes are random and purely recreational.</p>

            <h2>3. Threshold Mechanics</h2>
            <p>The threshold is a community participation benchmark required to activate the raffle. If unmet, refunds will be enabled via smart contract and participants can claim their 1 MON back. If the threshold is met, a participant will be selected using Pyth VRF (Verifiable Random Function) and can claim their reward. All claims must be made within <strong>3 days</strong> of the claim window opening. After the claim window expires, unclaimed funds may be transferred to the treasury.</p>

            <h2>4. Tax & Legal Responsibility</h2>
            <p>Participants are solely responsible for determining and reporting any tax obligations (income, capital gains, etc.) that may arise from participation. This dApp does not provide legal or tax advice. By engaging, you confirm your compliance with local laws.</p>

            <h2>5. Jurisdictional Disclaimer</h2>
            <p>By interacting with this dApp, you represent and warrant that you are not located in, under the control of, or a citizen/resident of any jurisdiction where participation in this raffle may violate local laws.</p>
            <p>The organizer does not verify your jurisdiction and is not liable for any legal consequences arising from participation in prohibited regions. You assume full responsibility for complying with your country or region's applicable laws. This raffle is not available where it may conflict with local regulations.</p>

            <h2>6. Refunds, Rewards & Emergency Clause</h2>
            
            <h3>Pull-Based Claims</h3>
            <p>All refunds and rewards use a <strong>pull-based system</strong>. This means participants must manually claim their funds via the dApp within the 3-day claim window. The contract does not automatically send funds to your wallet. This design ensures maximum security and prevents potential exploits.</p>

            <h3>How to Claim</h3>
            <ul>
              <li><strong>Selected Participant:</strong> Visit the Profile page and click "Claim Reward" within 3 days of participant selection.</li>
              <li><strong>Refunds:</strong> If threshold is not met, visit the Profile page and click "Claim Refund" within 3 days of refunds being enabled.</li>
            </ul>

            <h3>Emergency Safeguard</h3>
            <p>To ensure maximum fund safety, the organizer will regularly withdraw excess MON after each completed round and store them securely. This reduces exposure to potential on-chain vulnerabilities.</p>
            <p>For every new raffle round, the organizer will transfer the required reward amount into the contract to fund prizes.</p>
            <p>If VRF fails to respond within 1 day, the raffle can be cancelled and participants can claim refunds. All such actions are transparently executed via predefined smart contract functions and are immutably recorded on-chain.</p>

            <h2>7. Risk Acknowledgment</h2>
            <p>By participating, you acknowledge the following:</p>
            <ul>
              <li>MON and any distributed rewards may fluctuate in value and have no guaranteed or intrinsic worth.</li>
              <li>You bear all responsibility for your participation risks.</li>
              <li>You are responsible for claiming your rewards or refunds within the 3-day claim window.</li>
              <li>This raffle is not a substitute for legal, financial, or tax advice.</li>
            </ul>
            <p>Participants are encouraged to consult appropriate professionals before engaging.</p>
          </div>
        )}

        {activeTab === '1mon' && (
          <div className="docs-section">
            <h1>1 MON and A Dream</h1>
            
            <h2>Overview</h2>
            <p>A transparent and verifiable raffle system powered by Pyth VRF for cryptographically secure random selection.</p>

            <div className="docs-notice">
              <h3>⚠️ Important Wallet Recommendations</h3>
              <ul>
                <li><strong>Use MetaMask for the best experience.</strong> This dApp uses Wagmi for wallet integration, which is optimized for MetaMask.</li>
                <li><strong>Use a dummy or sub wallet address for additional security.</strong> Never connect your main wallet with significant funds to any dApp.</li>
              </ul>
            </div>

            <h2>How It Works</h2>
            
            <h3>1. Join a Raffle</h3>
            <ul>
              <li>Connect your wallet</li>
              <li>Pay exactly <strong>1 MON</strong> to enter</li>
              <li>One entry per wallet per raffle</li>
              <li>Join anytime during the raffle period</li>
            </ul>

            <h3>2. Threshold Requirement</h3>
            <ul>
              <li>Each raffle has a minimum participant threshold</li>
              <li>If threshold is met → Winning participant is selected</li>
              <li>If threshold is not met → All participants can claim refunds</li>
            </ul>

            <h3>3. Participant Selection (Threshold Met)</h3>
            <ul>
              <li>After the raffle ends, admin triggers finalization</li>
              <li>Contract requests randomness from Pyth VRF</li>
              <li>VRF provides cryptographically secure random number</li>
              <li>Winning participant is selected from participants array using the random number</li>
              <li>Winning participant address and reward amount are emitted on-chain</li>
            </ul>

            <h3>4. Claiming Rewards</h3>
            <ul>
              <li>Selected participant must claim their reward within <strong>3 days</strong></li>
              <li>Visit the Profile page to see if you were selected</li>
              <li>Click "Claim Reward" to receive your prize</li>
              <li>Unclaimed rewards after 3 days may be transferred to treasury</li>
            </ul>

            <h3>5. Refunds (Threshold Not Met)</h3>
            <ul>
              <li>If threshold is not met, refunds are enabled</li>
              <li>Participants can claim their 1 MON back within <strong>3 days</strong></li>
              <li>Visit the Profile page and click "Claim Refund"</li>
              <li>Unclaimed refunds after 3 days may be transferred to treasury</li>
            </ul>

            <h2>Raffle States</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Created</td>
                  <td>Raffle created, waiting for start time</td>
                </tr>
                <tr>
                  <td>Active</td>
                  <td>Raffle is open, accepting participants</td>
                </tr>
                <tr>
                  <td>PendingVRF</td>
                  <td>Waiting for randomness from Pyth VRF</td>
                </tr>
                <tr>
                  <td>WinnerSelected</td>
                  <td>Participant selected, awaiting reward claim</td>
                </tr>
                <tr>
                  <td>RefundsEnabled</td>
                  <td>Threshold not met, refunds available</td>
                </tr>
                <tr>
                  <td>Cancelled</td>
                  <td>Raffle cancelled (VRF timeout), refunds available</td>
                </tr>
                <tr>
                  <td>Completed</td>
                  <td>Raffle fully finalized</td>
                </tr>
              </tbody>
            </table>

            <h2>Important Notes</h2>
            <ul>
              <li><strong>Claim Window:</strong> 3 days for both rewards and refunds</li>
              <li><strong>Participation Amount:</strong> Exactly 1 MON (no more, no less)</li>
              <li><strong>One Entry Per Wallet:</strong> You cannot join the same raffle twice</li>
              <li><strong>Pull-Based System:</strong> You must manually claim your funds</li>
            </ul>

            <h2>Contract Address</h2>
            <p><code>0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE</code></p>
          </div>
        )}

        {activeTab === 'nftDraw' && (
          <div className="docs-section">
            <h1>NFT Draw</h1>
            <p className="docs-placeholder">Coming Soon...</p>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="docs-section">
            <h1>Smart Contract</h1>

            <h2>Contract Address</h2>
            <p><code>0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE</code></p>
            <p>View on MonadScan: <a href="https://monadscan.com/address/0x3A4Df4c34ff710f9F81347020eb5ff83dF4dF4BE" target="_blank" rel="noopener noreferrer">MonadScan Explorer</a></p>

            <h2>Immutable Addresses</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Admin</td>
                  <td><code>0x14d5aa304Af9c1aeFf1F37375f85bA0cbFb6C104</code></td>
                </tr>
                <tr>
                  <td>Treasury</td>
                  <td><code>0x6779387e262e3eC8C81F62DCD3B2348931B5254d</code></td>
                </tr>
                <tr>
                  <td>Pyth Entropy (VRF)</td>
                  <td><code>0xD458261E832415CFd3BAE5E416FdF3230ce6F134</code></td>
                </tr>
              </tbody>
            </table>

            <h2>Constants</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Participation Amount</td>
                  <td>1 MON</td>
                </tr>
                <tr>
                  <td>Claim Window</td>
                  <td>3 days</td>
                </tr>
                <tr>
                  <td>VRF Timeout</td>
                  <td>1 day</td>
                </tr>
              </tbody>
            </table>

            <h2>Admin Functions</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Function</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>createRaffle()</code></td>
                  <td>Creates a new raffle with start time, end time, threshold, and reward amount</td>
                </tr>
                <tr>
                  <td><code>finalizeRaffle()</code></td>
                  <td>Triggers after deadline; requests VRF if threshold met, enables refunds if not</td>
                </tr>
                <tr>
                  <td><code>cancelStuckRaffle()</code></td>
                  <td>Cancels a raffle stuck in PendingVRF state after 1-day timeout</td>
                </tr>
                <tr>
                  <td><code>markRaffleCompleted()</code></td>
                  <td>Marks expired raffles as completed for cleanup</td>
                </tr>
                <tr>
                  <td><code>injectGas()</code></td>
                  <td>Sends MON to contract for rewards and gas</td>
                </tr>
                <tr>
                  <td><code>treasuryTransfer()</code></td>
                  <td>Transfers specified amount to treasury (validates against reserved funds)</td>
                </tr>
              </tbody>
            </table>

            <h2>User Functions</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Function</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>joinRaffle()</code></td>
                  <td>Pay 1 MON to join a raffle</td>
                </tr>
                <tr>
                  <td><code>claimReward()</code></td>
                  <td>Selected participant claims their reward within 3-day window</td>
                </tr>
                <tr>
                  <td><code>claimRefund()</code></td>
                  <td>Participant claims refund within 3-day window</td>
                </tr>
              </tbody>
            </table>

            <h2>View Functions</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Function</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>getRaffleInfo()</code></td>
                  <td>Returns all raffle details for a given raffleId</td>
                </tr>
                <tr>
                  <td><code>getParticipants()</code></td>
                  <td>Returns array of participant addresses for a raffle</td>
                </tr>
                <tr>
                  <td><code>isParticipant()</code></td>
                  <td>Checks if an address joined a specific raffle</td>
                </tr>
                <tr>
                  <td><code>canClaimReward()</code></td>
                  <td>Checks if user can claim reward now</td>
                </tr>
                <tr>
                  <td><code>canClaimRefund()</code></td>
                  <td>Checks if user can claim refund now</td>
                </tr>
                <tr>
                  <td><code>getUserClaimStatus()</code></td>
                  <td>Returns winner status, claimable status, and claimable amount</td>
                </tr>
                <tr>
                  <td><code>getRaffleStats()</code></td>
                  <td>Returns success status, threshold %, refund totals, completion status</td>
                </tr>
                <tr>
                  <td><code>getReservedFunds()</code></td>
                  <td>Returns total MON owed to users (unclaimed rewards + refunds)</td>
                </tr>
                <tr>
                  <td><code>getWithdrawableAmount()</code></td>
                  <td>Returns balance minus reserved funds</td>
                </tr>
                <tr>
                  <td><code>getActiveRaffleIds()</code></td>
                  <td>Returns array of active raffle IDs</td>
                </tr>
                <tr>
                  <td><code>getActiveRaffleCount()</code></td>
                  <td>Returns number of active raffles</td>
                </tr>
              </tbody>
            </table>

            <h2>Security Features</h2>
            <ul>
              <li><strong>ReentrancyGuard:</strong> Prevents reentrancy attacks on all state-changing functions</li>
              <li><strong>Pull-Based Claims:</strong> Users claim their own funds, preventing DoS attacks</li>
              <li><strong>Reserved Funds Protection:</strong> Treasury transfers validate against owed amounts</li>
              <li><strong>VRF Timeout Handler:</strong> Stuck raffles can be cancelled after 1 day</li>
              <li><strong>Immutable Addresses:</strong> Admin, Treasury, and Pyth addresses cannot be changed</li>
              <li><strong>Single Winner Enforcement:</strong> Only one selected participant per raffle, verified by contract</li>
              <li><strong>Double-Claim Prevention:</strong> Mappings prevent claiming rewards/refunds twice</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default Docs;