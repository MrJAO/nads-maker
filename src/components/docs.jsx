import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Docs() {
  const [activeTab, setActiveTab] = useState('guidelines');
  const navigate = useNavigate();

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <div className="docs-title" onClick={() => navigate('/1mon')}>Documentation</div>
        <nav className="docs-nav">
          <button 
            className={`docs-nav-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            Guidelines
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === '/1mon' ? 'active' : ''}`}
            onClick={() => setActiveTab('/1mon')}
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
            <h1>Terms of Service</h1>

            <h2>Last Updated: December 8, 2025</h2>

            <div className="docs-notice">
              <p><strong>AGREEMENT BY PARTICIPATION:</strong> By connecting your wallet, clicking the confirmation checkbox, or participating in any raffle or draw offered through this decentralized application (dApp), you automatically and irrevocably agree to be bound by these Terms of Service. Continued use of this dApp constitutes ongoing acceptance of these terms. If you do not agree, you must immediately cease all interaction with this dApp.</p>
            </div>

            <h2>1. Definitions and Scope</h2>
            <p><strong>"dApp"</strong> refers to this decentralized application operating on the Monad blockchain, including all associated smart contracts, user interfaces, and services.</p>
            <p><strong>"Organizer"</strong> refers to the entity or individual(s) responsible for maintaining and operating this dApp.</p>
            <p><strong>"Participant"</strong> refers to any individual who connects a wallet and engages with raffle or draw functionalities.</p>
            <p><strong>"MON"</strong> refers to the native cryptocurrency token of the Monad blockchain.</p>
            <p><strong>"Raffle"</strong> refers to the "1 MON and A Dream" system where participants pay 1 MON to enter for a chance at rewards.</p>
            <p><strong>"NFT Draw"</strong> refers to a separate eligibility-based reward system where participants who meet specific criteria may be selected for NFT rewards.</p>
            <p><strong>"Smart Contract"</strong> refers to the immutable, on-chain code governing raffle and draw mechanics.</p>

            <h2>2. Eligibility and Jurisdictional Restrictions</h2>
            <p>You represent and warrant that:</p>
            <ul>
              <li>You are at least 18 years of age or the legal age of majority in your jurisdiction.</li>
              <li>You possess full legal capacity to enter into binding agreements.</li>
              <li>You are not located in, under the control of, or a national or resident of any jurisdiction where participation in cryptocurrency raffles, draws, or similar activities is prohibited or restricted by law.</li>
            </ul>

            <h3>Prohibited Jurisdictions</h3>
            <p>Without limitation, participation is expressly prohibited for residents or nationals of the following jurisdictions: <strong>China, United States (certain states), Singapore (for gambling activities), Egypt, Algeria, Bangladesh, Nepal, Afghanistan, Iraq, Qatar, Bahrain, North Korea, Yemen, Bolivia, Thailand (for online gambling), and any jurisdiction subject to comprehensive sanctions by the United Nations, United States, European Union, or United Kingdom.</strong></p>
            <p><strong>This list is subject to change without notice.</strong> You are solely responsible for ensuring compliance with your local laws. The Organizer does not verify your jurisdiction and assumes no liability for your participation from prohibited regions.</p>

            <h2>3. Community Engagement and Entertainment Purpose</h2>
            <p>This dApp is designed exclusively as a <strong>community engagement tool and entertainment activity</strong>. It is <strong>not</strong>:</p>
            <ul>
              <li>A gambling or gaming service</li>
              <li>A financial investment opportunity</li>
              <li>A security or investment contract under any jurisdiction</li>
              <li>A money transmission service</li>
              <li>A substitute for professional financial, legal, or tax advice</li>
            </ul>
            <p>Participation is entirely optional and intended to foster interaction within the Monad ecosystem. All outcomes are determined by cryptographically verifiable randomness and are purely recreational. No financial gain, profit, or return on investment is promised, implied, or guaranteed.</p>

            <h2>4. Smart Contract and Blockchain Disclaimers</h2>
            <p>All raffle and draw operations are governed by immutable smart contracts deployed on the Monad blockchain. You acknowledge and agree that:</p>
            <ul>
              <li><strong>Irreversibility:</strong> All blockchain transactions are final and cannot be reversed, cancelled, or modified once confirmed.</li>
              <li><strong>Private Key Security:</strong> You are solely responsible for the security of your private keys, wallet credentials, and recovery phrases. Loss or compromise of these credentials may result in permanent loss of access to your funds.</li>
              <li><strong>No Custody:</strong> The Organizer does not hold, custody, or control your cryptocurrency at any time. All funds are managed exclusively by smart contracts.</li>
              <li><strong>Smart Contract Risks:</strong> Smart contracts may contain unforeseen vulnerabilities, bugs, or exploits. The Organizer is not liable for losses resulting from smart contract failures.</li>
              <li><strong>Blockchain Dependencies:</strong> This dApp relies on the Monad blockchain and third-party services (e.g., Pyth VRF). Network outages, congestion, forks, or attacks may affect functionality.</li>
              <li><strong>Gas Fees:</strong> You are responsible for all blockchain transaction fees (gas fees) required to interact with this dApp.</li>
            </ul>

            <h2>5. Cryptocurrency Risks and No Financial Guarantees</h2>
            <p>You acknowledge and accept the following risks:</p>
            <ul>
              <li><strong>Volatility:</strong> MON and any rewards distributed have no guaranteed or intrinsic value. Cryptocurrency markets are highly volatile and subject to rapid, unpredictable price fluctuations.</li>
              <li><strong>No Returns:</strong> Participation does not entitle you to any return, profit, dividend, or future value. All participation fees (1 MON per raffle) are non-refundable except as explicitly stated in the refund mechanics.</li>
              <li><strong>Total Loss Risk:</strong> You may lose the entire value of your participation fee and any rewards due to market volatility, smart contract failures, or other unforeseen events.</li>
              <li><strong>Regulatory Risk:</strong> Cryptocurrency regulations are evolving and may affect the legality, taxation, or usability of MON or this dApp in your jurisdiction.</li>
              <li><strong>No Investment Advice:</strong> Nothing in this dApp or these Terms constitutes financial, investment, legal, or tax advice. You should consult qualified professionals before participating.</li>
            </ul>

            <h2>6. User Responsibilities and Tax Obligations</h2>
            <p>You are solely responsible for:</p>
            <ul>
              <li>Ensuring your participation complies with all applicable laws, regulations, and tax obligations in your jurisdiction.</li>
              <li>Determining, calculating, and reporting any income, capital gains, or other taxes arising from participation, rewards, or refunds.</li>
              <li>Maintaining accurate records of all transactions for tax and legal purposes.</li>
              <li>Securing your wallet, private keys, and recovery phrases.</li>
              <li>Verifying the accuracy of all transaction details (addresses, amounts, gas fees) before confirmation.</li>
              <li>Claiming rewards or refunds within the designated 3-day claim window (for 1 MON and A Dream raffles).</li>
            </ul>
            <p>The Organizer does not provide tax advice, reporting services, or legal guidance. Failure to comply with tax or legal obligations is solely your responsibility.</p>

            <h2>7. Raffle Mechanics: Claims, Refunds, and Emergency Safeguards</h2>
            
            <h3>7.1 Pull-Based Claim System</h3>
            <p>All rewards and refunds for the "1 MON and A Dream" raffle operate on a <strong>pull-based system</strong>. The smart contract does not automatically transfer funds to participants. You must manually claim your funds via the dApp interface within the designated claim window.</p>

            <h3>7.2 Claim Windows</h3>
            <p>All claims (rewards or refunds) for the "1 MON and A Dream" raffle must be executed within <strong>3 days</strong> of the claim window opening. After this period expires, unclaimed funds may be transferred to the treasury. You waive all rights to unclaimed funds after the expiration period.</p>

            <h3>7.3 Refund Conditions</h3>
            <p>Refunds are enabled only if:</p>
            <ul>
              <li>A raffle fails to meet its minimum participation threshold, or</li>
              <li>A raffle is cancelled due to VRF timeout (1 day without randomness response)</li>
            </ul>
            <p>Refunds are limited to the original 1 MON participation fee. No additional compensation is provided.</p>

            <h3>7.4 Emergency Safeguards</h3>
            <p>To ensure fund security, the Organizer may:</p>
            <ul>
              <li>Regularly withdraw excess MON after completed rounds to reduce on-chain exposure.</li>
              <li>Transfer required reward amounts into the contract before each new raffle.</li>
              <li>Cancel raffles stuck in "PendingVRF" state after 1 day and enable refunds.</li>
            </ul>
            <p>All emergency actions are executed transparently via predefined smart contract functions and recorded immutably on-chain.</p>

            <h2>8. NFT Draw Terms</h2>
            <p>The NFT Draw is a separate, optional reward system distinct from the "1 MON and A Dream" raffle. You acknowledge and agree that:</p>
            
            <h3>8.1 Eligibility</h3>
            <p>To qualify for the NFT Draw, participants must participate in at least <strong>TBA</strong> (successful or unsuccessful). Participation grants eligibility but does <strong>not guarantee</strong> any reward, selection, or NFT distribution.</p>

            <h3>8.2 No Guarantees</h3>
            <p>The NFT Draw is discretionary and subject to availability. Rewards, if any, are distributed at the sole discretion of the Organizer. Eligibility does not create any enforceable right, expectation, or entitlement to receive an NFT or any other reward.</p>

            <h3>8.3 Randomized Selection</h3>
            <p>Winning participants, if any, are selected via a verifiable on-chain random number generator (Pyth VRF). Selection criteria, timing, and reward distribution are subject to change without notice.</p>

            <h3>8.4 Participation Tracking</h3>
            <p>Participation data is recorded on-chain via smart contract logs. The Organizer may use this data to determine eligibility but does not guarantee the accuracy or completeness of such records. Participants can track their eligibility status via the Profile tab.</p>

            <h3>8.5 No Financial Value</h3>
            <p>NFTs distributed through the NFT Draw, if any, have no guaranteed or intrinsic financial value. They are provided for community engagement and entertainment purposes only.</p>

            <h3>8.6 Manual Distribution</h3>
            <p>NFT rewards are manually distributed by the Organizer's admin wallet address. There is no automated claim window. Selected participants will receive their NFTs directly to their wallet address used during raffle participation.</p>

            <h2>9. Limitation of Liability and Dispute Resolution</h2>
            
            <h3>9.1 "As-Is" Service</h3>
            <p>This dApp is provided on an <strong>"as-is" and "as-available"</strong> basis without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>

            <h3>9.2 Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, the Organizer, its affiliates, officers, employees, agents, and service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or cryptocurrency, arising from or related to your use of this dApp, even if advised of the possibility of such damages.</p>
            <p>In no event shall the Organizer's total liability exceed the amount you paid to participate (1 MON per raffle).</p>

            <h3>9.3 Dispute Resolution and Arbitration</h3>
            <p>Any dispute, controversy, or claim arising out of or relating to these Terms or your use of this dApp shall be resolved through <strong>binding arbitration</strong> administered by a mutually agreed arbitration body, in accordance with its rules. Arbitration shall be conducted in English in a neutral jurisdiction agreed upon by both parties.</p>
            <p>You waive any right to participate in class actions, consolidated proceedings, or representative actions. Arbitration decisions are final and binding, with limited grounds for appeal.</p>

            <h3>9.4 Exceptions to Arbitration</h3>
            <p>Either party may seek injunctive relief in a court of competent jurisdiction to prevent irreparable harm or to enforce intellectual property rights.</p>

            <h2>10. Governing Law, Force Majeure, and Severability</h2>
            
            <h3>10.1 Governing Law</h3>
            <p>These Terms shall be governed by and construed in accordance with the laws of a neutral jurisdiction, without regard to its conflict of law principles. However, due to the decentralized nature of blockchain technology, enforcement may be limited.</p>

            <h3>10.2 Force Majeure</h3>
            <p>The Organizer shall not be liable for any failure or delay in performance caused by events beyond its reasonable control, including but not limited to:</p>
            <ul>
              <li>Blockchain network outages, congestion, or attacks</li>
              <li>Failures of third-party services (e.g., Pyth VRF, wallet providers)</li>
              <li>Acts of God, war, terrorism, pandemics, or natural disasters</li>
              <li>Government actions, sanctions, or regulatory changes</li>
              <li>Cyberattacks, hacking attempts, or security breaches</li>
            </ul>

            <h3>10.3 Severability</h3>
            <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.</p>

            <h2>11. Termination and Account Suspension</h2>
            <p>The Organizer reserves the right to terminate, suspend, or restrict your access to this dApp at any time, with or without notice, for any reason, including but not limited to:</p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Fraudulent, abusive, or malicious activity</li>
              <li>Spam, bot usage, or automated participation</li>
              <li>Participation from prohibited jurisdictions</li>
              <li>Compromised wallet or security concerns</li>
              <li>Regulatory or legal requirements</li>
            </ul>
            <p>Upon termination, you remain liable for all obligations incurred prior to termination. You may forfeit unclaimed rewards or refunds.</p>

            <h2>12. Privacy and Data Usage</h2>
            <p>This dApp operates on public blockchain infrastructure. You acknowledge that:</p>
            <ul>
              <li><strong>Public Data:</strong> Your wallet address, transaction history, and participation records are permanently recorded on the Monad blockchain and are publicly accessible.</li>
              <li><strong>No Personally Identifiable Information (PII):</strong> The Organizer does not collect, store, or process PII such as names, email addresses, or government-issued identification.</li>
              <li><strong>Analytics:</strong> The Organizer may collect anonymized usage data (e.g., average participants per raffle, total mon participated) for operational and analytical purposes.</li>
              <li><strong>Third-Party Services:</strong> This dApp integrates with third-party services (e.g., wallet providers, blockchain explorers, VRF providers) subject to their own privacy policies. The Organizer is not responsible for third-party data practices.</li>
              <li><strong>No Sale of Data:</strong> The Organizer does not sell or monetize user data.</li>
            </ul>

            <h2>13. Amendments to Terms</h2>
            <p>The Organizer reserves the right to modify, update, or replace these Terms at any time. Changes will be effective immediately upon posting to this dApp. Your continued use after changes constitutes acceptance of the revised Terms. You are responsible for reviewing these Terms periodically.</p>

            <h2>14. Contact and Feedback</h2>
            <p>For questions, concerns, or feedback regarding these Terms, please contact the Organizer via the designated support channels (e.g., Twitter/X). The Organizer is not obligated to respond to all inquiries but will make reasonable efforts to address legitimate concerns.</p>

            <h2>15. Final Acknowledgment</h2>
            <p>By participating in this dApp, you acknowledge that you have read, understood, and agreed to these Terms of Service in their entirety. You further acknowledge that:</p>
            <ul>
              <li>You are participating voluntarily for entertainment and community engagement purposes only.</li>
              <li>You understand the risks associated with cryptocurrency, smart contracts, and blockchain technology.</li>
              <li>You accept full responsibility for all consequences of your participation.</li>
              <li>You have consulted legal, financial, or tax professionals as necessary.</li>
            </ul>
            <p><strong>IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY CEASE ALL USE OF THIS DAPP.</strong></p>
          </div>
        )}

        {activeTab === '/1mon' && (
          <div className="docs-section">
            <h1>1 MON and A Dream</h1>
            
            <h2>Overview</h2>
            <p>A transparent and verifiable raffle system powered by Pyth VRF for cryptographically secure random selection.</p>

            <div className="docs-notice">
              <h3>⚠️ Important Wallet Recommendations</h3>
              <ul>
                <li><strong>Use MetaMask for the best experience.</strong> This dApp uses Wagmi for wallet integration, which is optimized for MetaMask.</li>
                <li><strong>Always read the Wallet Confirmation message.</strong> Don't rush, check the popup message before confirming any transaction.</li>
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
              <li>Visit the <strong>Profile</strong> tab to see if you were selected</li>
              <li>Click "Claim Reward" to receive your prize</li>
              <li>Unclaimed rewards after 3 days may be transferred to treasury</li>
            </ul>

            <h3>5. Refunds (Threshold Not Met)</h3>
            <ul>
              <li>If threshold is not met, refunds are enabled</li>
              <li>Participants can claim their 1 MON back within <strong>3 days</strong></li>
              <li>Visit the <strong>Profile</strong> tab and click "Claim Refund"</li>
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
              <li><strong>Track Your Status:</strong> Check the Profile tab to see your participation history and claimable rewards/refunds</li>
            </ul>

            <h2>Contract Address</h2>
            <p><code>0x26A56f3245161CE7938200F1366A1cf9549c7e20</code></p>
          </div>
        )}

        {activeTab === 'nftDraw' && (
          <div className="docs-section">
            <h1>NFT Draw</h1>
            
            <h2>Overview</h2>
            <p>An eligibility-based reward system where active raffle participants may be selected to receive exclusive NFT rewards. The NFT Draw is completely separate from the "1 MON and A Dream" raffle system and operates under different mechanics.</p>

            <div className="docs-notice">
              <h3>⚠️ Important Notice</h3>
              <p><strong>Eligibility does NOT guarantee rewards.</strong> Meeting the participation threshold grants eligibility for the draw, but selection and reward distribution are subject to availability, randomness, and the Organizer's discretion.</p>
            </div>

            <h2>How It Works</h2>

            <h3>1. Eligibility Requirements</h3>
            <ul>
              <li>Participate in at least <strong>8 raffles</strong> (successful or unsuccessful) in the "1 MON and A Dream" system</li>
              <li>Both winning and non-winning raffle participations count toward eligibility</li>
              <li>Refunded raffles also count as participation</li>
              <li>Track your progress in the <strong>Profile</strong> tab</li>
            </ul>

            <h3>2. Participation Tracking</h3>
            <ul>
              <li>Your participation count is automatically tracked on-chain via smart contract logs</li>
              <li>Visit the <strong>Profile</strong> tab to view your current participation count</li>
              <li>The frontend reads your participation data directly from the blockchain</li>
              <li>All calculations are transparent and verifiable</li>
            </ul>

            <h3>3. Draw Schedule</h3>
            <ul>
              <li><strong>Target frequency:</strong> One NFT Draw for every 8 completed raffles</li>
              <li>Exact dates and times are <strong>To Be Announced (TBA)</strong></li>
              <li>Schedule is subject to change based on raffle activity and participation levels</li>
              <li>Announcements will be made via Twitter/X and updated in this documentation</li>
            </ul>

            <h3>4. Selected Participant Process</h3>
            <ul>
              <li>Eligible wallet addresses are collected from on-chain participation data</li>
              <li>Admin triggers the NFT Draw via a separate smart contract (not yet deployed)</li>
              <li>Winning participants are selected using <strong>Pyth VRF</strong> (Verifiable Random Function) for cryptographically secure randomness</li>
              <li>Selection is completely random and transparent</li>
              <li>Selected participant addresses are emitted on-chain for full transparency</li>
            </ul>

            <h3>5. NFT Distribution</h3>
            <ul>
              <li><strong>No claim window required</strong> - NFTs are sent directly to selected participants</li>
              <li>Admin wallet manually distributes NFT rewards to selected participants</li>
              <li>NFTs are sent to the same wallet address used during raffle participation</li>
              <li>Selected participants will be notified via on-chain events and social media announcements</li>
              <li>Ensure your wallet can receive NFTs (ERC-721 or ERC-1155 compatible)</li>
            </ul>

            <h2>Key Differences from 1 MON Raffle</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>1 MON and A Dream</th>
                  <th>NFT Draw</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Entry Cost</td>
                  <td>1 MON per raffle</td>
                  <td>Free (based on participation)</td>
                </tr>
                <tr>
                  <td>Eligibility</td>
                  <td>Pay 1 MON</td>
                  <td>TBA</td>
                </tr>
                <tr>
                  <td>Reward Type</td>
                  <td>MON cryptocurrency</td>
                  <td>NFT (non-fungible token)</td>
                </tr>
                <tr>
                  <td>Claim Process</td>
                  <td>Manual claim within 3 days</td>
                  <td>Distributed by admin</td>
                </tr>
                <tr>
                  <td>Smart Contract</td>
                  <td>0x26A56f3245161CE7938200F1366A1cf9549c7e20</td>
                  <td>TBA (not yet deployed)</td>
                </tr>
                <tr>
                  <td>Selection Method</td>
                  <td>Pyth VRF</td>
                  <td>Pyth VRF</td>
                </tr>
                <tr>
                  <td>Frequency</td>
                  <td>Every week</td>
                  <td>TBA</td>
                </tr>
              </tbody>
            </table>

            <h2>Important Notes</h2>
            <ul>
              <li><strong>No Guarantees:</strong> Eligibility does not guarantee selection or reward distribution</li>
              <li><strong>Subject to Change:</strong> All mechanics, schedules, and reward details are subject to change without notice</li>
              <li><strong>NFT Value:</strong> NFTs have no guaranteed financial value and are for community engagement only</li>
              <li><strong>Wallet Compatibility:</strong> Ensure your wallet supports NFT standards (ERC-721/ERC-1155)</li>
              <li><strong>Updates:</strong> All changes will be documented on this page and announced via social media</li>
              <li><strong>Separate System:</strong> NFT Draw operates independently from the 1 MON raffle system</li>
            </ul>

            <h2>Contract Information</h2>
            <p><strong>Status:</strong> Smart contract not yet deployed</p>
            <p><strong>Contract Address:</strong> To Be Announced (TBA)</p>
            <p><strong>VRF Provider:</strong> Pyth Entropy (same as 1 MON raffle)</p>
            <p><strong>Admin Wallet:</strong> Same as 1 MON raffle system</p>

            <h2>Coming Soon</h2>
            <p>Additional features and mechanics are currently in development and will be documented here upon release. Stay tuned for updates via our social media channels and this documentation page.</p>

            <h2>Legal Disclaimer</h2>
            <p>Please review Section 8 (NFT Draw Terms) in the Guidelines tab for complete legal terms and conditions regarding the NFT Draw system.</p>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="docs-section">
            <h1>Smart Contract</h1>

            <h2>1 MON and A Dream - Smart Contract</h2>
            <p><code>0x26A56f3245161CE7938200F1366A1cf9549c7e20</code></p>
            <p>View on MonadScan: <a href="https://monadscan.com/address/0x26A56f3245161CE7938200F1366A1cf9549c7e20" target="_blank" rel="noopener noreferrer">MonadScan Explorer</a></p>

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