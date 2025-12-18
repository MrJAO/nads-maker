export interface Section {
  type: 'heading' | 'paragraph' | 'notice' | 'list' | 'table' | 'code';
  level?: 1 | 2 | 3;
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  tableData?: { [key: string]: string }[];
}

export interface DocData {
  title: string;
  sections: Section[];
}

export const guidelinesData: DocData = {
  title: "Terms of Service",
  sections: [
    {
      type: "heading",
      level: 2,
      content: "Last Updated: December 18, 2025"
    },
    {
      type: "notice",
      content: "AGREEMENT BY PARTICIPATION: By connecting your wallet, clicking the confirmation checkbox, or participating in any raffle, treasure hunt, or draw offered through this decentralized application (dApp), you automatically and irrevocably agree to be bound by these Terms of Service. Continued use of this dApp constitutes ongoing acceptance of these terms. If you do not agree, you must immediately cease all interaction with this dApp."
    },
    {
      type: "heading",
      level: 2,
      content: "1. Definitions and Scope"
    },
    {
      type: "paragraph",
      content: '"dApp" refers to this decentralized application operating on the Monad blockchain, including all associated smart contracts, user interfaces, and services.'
    },
    {
      type: "paragraph",
      content: '"Organizer" refers to the entity or individual(s) responsible for maintaining and operating this dApp.'
    },
    {
      type: "paragraph",
      content: '"Participant" refers to any individual who connects a wallet and engages with raffle, treasure hunt, or draw functionalities.'
    },
    {
      type: "paragraph",
      content: '"MON" refers to the native cryptocurrency token of the Monad blockchain.'
    },
    {
      type: "paragraph",
      content: '"Raffle" refers to the "1 MON and A Dream" system where participants pay 1 MON to enter for a chance at rewards.'
    },
    {
      type: "paragraph",
      content: '"Treasure Hunt" refers to an interactive grid-based game where participants purchase keys to reveal squares and discover hidden treasures. This is a community engagement activity, not gambling.'
    },
    {
      type: "paragraph",
      content: '"Keys" refers to the consumable tokens purchased with MON that allow participation in Treasure Hunt activities. Keys have no monetary value and are for entertainment purposes only.'
    },
    {
      type: "paragraph",
      content: '"NFT Draw" refers to a separate eligibility-based reward system where participants who meet specific criteria may be selected for NFT rewards.'
    },
    {
      type: "paragraph",
      content: '"Smart Contract" refers to the immutable, on-chain code governing raffle, treasure hunt, and draw mechanics.'
    },
    {
      type: "heading",
      level: 2,
      content: "2. Eligibility and Jurisdictional Restrictions"
    },
    {
      type: "paragraph",
      content: "You represent and warrant that:"
    },
    {
      type: "list",
      items: [
        "You are at least 18 years of age or the legal age of majority in your jurisdiction.",
        "You possess full legal capacity to enter into binding agreements.",
        "You are not located in, under the control of, or a national or resident of any jurisdiction where participation in cryptocurrency raffles, treasure hunts, draws, or similar activities is prohibited or restricted by law."
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "Prohibited Jurisdictions"
    },
    {
      type: "paragraph",
      content: "Without limitation, participation is expressly prohibited for residents or nationals of the following jurisdictions: China, United States (certain states), Singapore (for gambling activities), Egypt, Algeria, Bangladesh, Nepal, Afghanistan, Iraq, Qatar, Bahrain, North Korea, Yemen, Bolivia, Thailand (for online gambling), and any jurisdiction subject to comprehensive sanctions by the United Nations, United States, European Union, or United Kingdom."
    },
    {
      type: "paragraph",
      content: "This list is subject to change without notice. You are solely responsible for ensuring compliance with your local laws. The Organizer does not verify your jurisdiction and assumes no liability for your participation from prohibited regions."
    },
    {
      type: "heading",
      level: 2,
      content: "3. Community Engagement and Entertainment Purpose"
    },
    {
      type: "paragraph",
      content: "This dApp is designed exclusively as a community engagement tool and entertainment activity. It is not:"
    },
    {
      type: "list",
      items: [
        "A gambling or gaming service",
        "A financial investment opportunity",
        "A security or investment contract under any jurisdiction",
        "A money transmission service",
        "A substitute for professional financial, legal, or tax advice"
      ]
    },
    {
      type: "paragraph",
      content: "Participation is entirely optional and intended to foster interaction within the Monad ecosystem. All outcomes are determined by cryptographically verifiable randomness and are purely recreational. No financial gain, profit, or return on investment is promised, implied, or guaranteed."
    },
    {
      type: "heading",
      level: 3,
      content: "Treasure Hunt Entertainment Clarification"
    },
    {
      type: "paragraph",
      content: "The Treasure Hunt feature is a skill-based, interactive game designed for community engagement and entertainment. Key purchases represent participation in a fun, strategic activity where outcomes depend on timing, strategy, and cryptographically secure randomness. Purchasing keys does NOT constitute gambling, betting, or wagering. Keys are consumable entertainment items with no intrinsic monetary value, similar to arcade tokens or game credits."
    },
    {
      type: "heading",
      level: 2,
      content: "4. Smart Contract and Blockchain Disclaimers"
    },
    {
      type: "paragraph",
      content: "All raffle, treasure hunt, and draw operations are governed by immutable smart contracts deployed on the Monad blockchain. You acknowledge and agree that:"
    },
    {
      type: "list",
      items: [
        "Irreversibility: All blockchain transactions are final and cannot be reversed, cancelled, or modified once confirmed.",
        "Private Key Security: You are solely responsible for the security of your private keys, wallet credentials, and recovery phrases. Loss or compromise of these credentials may result in permanent loss of access to your funds.",
        "No Custody: The Organizer does not hold, custody, or control your cryptocurrency at any time. All funds are managed exclusively by smart contracts.",
        "Smart Contract Risks: Smart contracts may contain unforeseen vulnerabilities, bugs, or exploits. The Organizer is not liable for losses resulting from smart contract failures.",
        "Blockchain Dependencies: This dApp relies on the Monad blockchain and third-party services (e.g., Pyth VRF). Network outages, congestion, forks, or attacks may affect functionality.",
        "Gas Fees: You are responsible for all blockchain transaction fees (gas fees) required to interact with this dApp."
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "5. Cryptocurrency Risks and No Financial Guarantees"
    },
    {
      type: "paragraph",
      content: "You acknowledge and accept the following risks:"
    },
    {
      type: "list",
      items: [
        "Volatility: MON and any rewards distributed have no guaranteed or intrinsic value. Cryptocurrency markets are highly volatile and subject to rapid, unpredictable price fluctuations.",
        "No Returns: Participation does not entitle you to any return, profit, dividend, or future value. All participation fees (1 MON per raffle, MON spent on keys) are non-refundable except as explicitly stated in the refund mechanics.",
        "Total Loss Risk: You may lose the entire value of your participation fee, key purchases, and any rewards due to market volatility, smart contract failures, or other unforeseen events.",
        "Regulatory Risk: Cryptocurrency regulations are evolving and may affect the legality, taxation, or usability of MON or this dApp in your jurisdiction.",
        "No Investment Advice: Nothing in this dApp or these Terms constitutes financial, investment, legal, or tax advice. You should consult qualified professionals before participating."
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "6. User Responsibilities and Tax Obligations"
    },
    {
      type: "paragraph",
      content: "You are solely responsible for:"
    },
    {
      type: "list",
      items: [
        "Ensuring your participation complies with all applicable laws, regulations, and tax obligations in your jurisdiction.",
        "Determining, calculating, and reporting any income, capital gains, or other taxes arising from participation, rewards, or refunds.",
        "Maintaining accurate records of all transactions for tax and legal purposes.",
        "Securing your wallet, private keys, and recovery phrases.",
        "Verifying the accuracy of all transaction details (addresses, amounts, gas fees) before confirmation.",
        "Claiming rewards or refunds within the designated claim windows (3 days for raffles and treasure hunts).",
        "Safely storing your Treasure Hunt commit secrets. Lost secrets cannot be recovered and will result in inability to reveal squares."
      ]
    },
    {
      type: "paragraph",
      content: "The Organizer does not provide tax advice, reporting services, or legal guidance. Failure to comply with tax or legal obligations is solely your responsibility."
    },
    {
      type: "heading",
      level: 2,
      content: "7. Raffle Mechanics: Claims, Refunds, and Emergency Safeguards"
    },
    {
      type: "heading",
      level: 3,
      content: "7.1 Pull-Based Claim System"
    },
    {
      type: "paragraph",
      content: "All rewards and refunds for the \"1 MON and A Dream\" raffle operate on a pull-based system. The smart contract does not automatically transfer funds to participants. You must manually claim your funds via the dApp interface within the designated claim window."
    },
    {
      type: "heading",
      level: 3,
      content: "7.2 Claim Windows"
    },
    {
      type: "paragraph",
      content: "All claims (rewards or refunds) for the \"1 MON and A Dream\" raffle must be executed within 3 days of the claim window opening. After this period expires, unclaimed funds may be transferred to the treasury. You waive all rights to unclaimed funds after the expiration period."
    },
    {
      type: "heading",
      level: 3,
      content: "7.3 Refund Conditions"
    },
    {
      type: "paragraph",
      content: "Refunds are enabled only if:"
    },
    {
      type: "list",
      items: [
        "A raffle fails to meet its minimum participation threshold, or",
        "A raffle is cancelled due to VRF timeout (1 day without randomness response), or",
        "An ended raffle (threshold met) cannot be finalized after 24 hours due to emergencies (VRF timeout, excessively high VRF fees, or other technical issues)"
      ]
    },
    {
      type: "paragraph",
      content: "Refunds are limited to the original 1 MON participation fee. No additional compensation is provided."
    },
    {
      type: "heading",
      level: 3,
      content: "7.4 Emergency Safeguards"
    },
    {
      type: "paragraph",
      content: "To ensure fund security, the Organizer may:"
    },
    {
      type: "list",
      items: [
        "Regularly withdraw excess MON after completed rounds to reduce on-chain exposure.",
        "Transfer required reward amounts into the contract before each new raffle.",
        "Cancel raffles stuck in \"PendingVRF\" state after 1 day and enable refunds.",
        "Cancel ended raffles (threshold met) that cannot be finalized after 24 hours due to emergencies and enable refunds."
      ]
    },
    {
      type: "paragraph",
      content: "All emergency actions are executed transparently via predefined smart contract functions and recorded immutably on-chain."
    },
    {
      type: "heading",
      level: 2,
      content: "8. Treasure Hunt Mechanics: Keys, Reveals, and Claims"
    },
    {
      type: "heading",
      level: 3,
      content: "8.1 Key Purchase and Usage"
    },
    {
      type: "paragraph",
      content: "Keys are purchased with MON (1 MON = 2 keys) and are used to reserve squares on the treasure hunt grid. Key purchases are final and non-refundable. Keys have no monetary value and cannot be transferred, sold, or exchanged. Keys are for entertainment and participation purposes only."
    },
    {
      type: "heading",
      level: 3,
      content: "8.2 Commit-Reveal Mechanism"
    },
    {
      type: "paragraph",
      content: "To ensure fairness, the Treasure Hunt uses a commit-reveal system. During the active hunt period, you commit to a square by submitting a hash of your chosen square index and a secret. After the hunt ends, you must reveal your secret within 3 days to check if your square contains treasure. You are solely responsible for remembering and storing your secret. Lost secrets cannot be recovered by the Organizer."
    },
    {
      type: "heading",
      level: 3,
      content: "8.3 Treasure Location Randomness"
    },
    {
      type: "paragraph",
      content: "Treasure locations are determined by Pyth VRF randomness requested at hunt creation. Treasure positions are generated using the VRF seed and are unknown until squares are revealed. The smart contract prevents treasure collisions by regenerating positions with nonces if duplicates occur."
    },
    {
      type: "heading",
      level: 3,
      content: "8.4 Treasure Claims"
    },
    {
      type: "paragraph",
      content: "If your revealed square contains treasure, you must claim your reward within 3 days of the hunt ending. Unclaimed rewards after the claim window expires may be transferred to the treasury. You waive all rights to unclaimed rewards after expiration."
    },
    {
      type: "heading",
      level: 3,
      content: "8.5 Bonus Keys"
    },
    {
      type: "paragraph",
      content: "Participants who joined eligible \"1 MON and A Dream\" raffles (as specified by the admin during hunt creation) may claim 1 free bonus key per active treasure hunt. Bonus keys are subject to the same usage terms as purchased keys."
    },
    {
      type: "heading",
      level: 3,
      content: "8.6 No Guarantees"
    },
    {
      type: "paragraph",
      content: "Purchasing keys and reserving squares does NOT guarantee finding treasure or receiving any reward. Treasure locations are determined by cryptographically secure randomness. Outcomes depend on strategy, timing, and luck. The Organizer makes no representations or warranties about the likelihood of finding treasure."
    },
    {
      type: "heading",
      level: 3,
      content: "8.7 Emergency Cancellation"
    },
    {
      type: "paragraph",
      content: "If a treasure hunt is stuck in \"Created\" state for more than 1 day due to VRF timeout, the admin may cancel the hunt. Cancelled hunts do NOT refund key purchases or return used keys. Keys remain in your balance for future hunts."
    },
    {
      type: "heading",
      level: 2,
      content: "9. NFT Draw Terms"
    },
    {
      type: "paragraph",
      content: "The NFT Draw is a separate, optional reward system distinct from the \"1 MON and A Dream\" raffle and Treasure Hunt. You acknowledge and agree that:"
    },
    {
      type: "heading",
      level: 3,
      content: "9.1 Eligibility"
    },
    {
      type: "paragraph",
      content: "To qualify for the NFT Draw, participants must participate in at least TBA (successful or unsuccessful). Participation grants eligibility but does not guarantee any reward, selection, or NFT distribution."
    },
    {
      type: "heading",
      level: 3,
      content: "9.2 No Guarantees"
    },
    {
      type: "paragraph",
      content: "The NFT Draw is discretionary and subject to availability. Rewards, if any, are distributed at the sole discretion of the Organizer. Eligibility does not create any enforceable right, expectation, or entitlement to receive an NFT or any other reward."
    },
    {
      type: "heading",
      level: 3,
      content: "9.3 Randomized Selection"
    },
    {
      type: "paragraph",
      content: "Winning participants, if any, are selected via a verifiable on-chain random number generator (Pyth VRF). Selection criteria, timing, and reward distribution are subject to change without notice."
    },
    {
      type: "heading",
      level: 3,
      content: "9.4 Participation Tracking"
    },
    {
      type: "paragraph",
      content: "Participation data is recorded on-chain via smart contract logs. The Organizer may use this data to determine eligibility but does not guarantee the accuracy or completeness of such records. Participants can track their eligibility status via the Profile tab."
    },
    {
      type: "heading",
      level: 3,
      content: "9.5 No Financial Value"
    },
    {
      type: "paragraph",
      content: "NFTs distributed through the NFT Draw, if any, have no guaranteed or intrinsic financial value. They are provided for community engagement and entertainment purposes only."
    },
    {
      type: "heading",
      level: 3,
      content: "9.6 Manual Distribution"
    },
    {
      type: "paragraph",
      content: "NFT rewards are manually distributed by the Organizer's admin wallet address. There is no automated claim window. Selected participants will receive their NFTs directly to their wallet address used during raffle participation."
    },
    {
      type: "heading",
      level: 2,
      content: "10. Treasure Hunt Specific Risks"
    },
    {
      type: "paragraph",
      content: "In addition to the general risks outlined above, you acknowledge and accept the following Treasure Hunt-specific risks:"
    },
    {
      type: "list",
      items: [
        "Lost Secrets: If you lose your commit secret, you cannot reveal your square and will forfeit any potential treasure rewards. The Organizer cannot recover lost secrets.",
        "Competition Risk: Other participants may reserve squares near your selections, reducing your chances of finding treasure.",
        "Timing Risk: Delayed reveals may result in missed claim windows (3 days after hunt ends).",
        "Grid Collision: While the smart contract prevents treasure collisions, popular squares may be reserved quickly by other participants.",
        "Key Consumption: Keys are consumed upon committing to squares, regardless of whether treasure is found.",
        "No Refunds on Keys: Key purchases are final and non-refundable, even if the hunt is cancelled or you choose not to participate.",
        "Auto-Complete: If no participants reserve any squares, the hunt auto-completes with no winners or rewards distributed.",
        "VRF Dependency: Treasure locations depend on Pyth VRF. Delays or failures may result in hunt cancellation without key refunds.",
        "Reveal Requirement: You must actively reveal your squares after the hunt ends. No automatic reveals are performed.",
        "Strategic Disadvantage: Revealing squares early may give other participants strategic information about treasure locations."
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "11. Limitation of Liability and Dispute Resolution"
    },
    {
      type: "heading",
      level: 3,
      content: "11.1 \"As-Is\" Service"
    },
    {
      type: "paragraph",
      content: "This dApp is provided on an \"as-is\" and \"as-available\" basis without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement."
    },
    {
      type: "heading",
      level: 3,
      content: "11.2 Limitation of Liability"
    },
    {
      type: "paragraph",
      content: "To the maximum extent permitted by law, the Organizer, its affiliates, officers, employees, agents, and service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, cryptocurrency, keys, or treasure rewards, arising from or related to your use of this dApp, even if advised of the possibility of such damages."
    },
    {
      type: "paragraph",
      content: "In no event shall the Organizer's total liability exceed the amount you paid to participate (1 MON per raffle or MON spent on keys)."
    },
    {
      type: "heading",
      level: 3,
      content: "11.3 Dispute Resolution and Arbitration"
    },
    {
      type: "paragraph",
      content: "Any dispute, controversy, or claim arising out of or relating to these Terms or your use of this dApp shall be resolved through binding arbitration administered by a mutually agreed arbitration body, in accordance with its rules. Arbitration shall be conducted in English in a neutral jurisdiction agreed upon by both parties."
    },
    {
      type: "paragraph",
      content: "You waive any right to participate in class actions, consolidated proceedings, or representative actions. Arbitration decisions are final and binding, with limited grounds for appeal."
    },
    {
      type: "heading",
      level: 3,
      content: "11.4 Exceptions to Arbitration"
    },
    {
      type: "paragraph",
      content: "Either party may seek injunctive relief in a court of competent jurisdiction to prevent irreparable harm or to enforce intellectual property rights."
    },
    {
      type: "heading",
      level: 2,
      content: "12. Governing Law, Force Majeure, and Severability"
    },
    {
      type: "heading",
      level: 3,
      content: "12.1 Governing Law"
    },
    {
      type: "paragraph",
      content: "These Terms shall be governed by and construed in accordance with the laws of a neutral jurisdiction, without regard to its conflict of law principles. However, due to the decentralized nature of blockchain technology, enforcement may be limited."
    },
    {
      type: "heading",
      level: 3,
      content: "12.2 Force Majeure"
    },
    {
      type: "paragraph",
      content: "The Organizer shall not be liable for any failure or delay in performance caused by events beyond its reasonable control, including but not limited to:"
    },
    {
      type: "list",
      items: [
        "Blockchain network outages, congestion, or attacks",
        "Failures of third-party services (e.g., Pyth VRF, wallet providers)",
        "Acts of God, war, terrorism, pandemics, or natural disasters",
        "Government actions, sanctions, or regulatory changes",
        "Cyberattacks, hacking attempts, or security breaches"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "12.3 Severability"
    },
    {
      type: "paragraph",
      content: "If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable."
    },
    {
      type: "heading",
      level: 2,
      content: "13. Termination and Account Suspension"
    },
    {
      type: "paragraph",
      content: "The Organizer reserves the right to terminate, suspend, or restrict your access to this dApp at any time, with or without notice, for any reason, including but not limited to:"
    },
    {
      type: "list",
      items: [
        "Violation of these Terms",
        "Fraudulent, abusive, or malicious activity",
        "Spam, bot usage, or automated participation",
        "Participation from prohibited jurisdictions",
        "Compromised wallet or security concerns",
        "Regulatory or legal requirements"
      ]
    },
    {
      type: "paragraph",
      content: "Upon termination, you remain liable for all obligations incurred prior to termination. You may forfeit unclaimed rewards, refunds, keys, or treasure claims."
    },
    {
      type: "heading",
      level: 2,
      content: "14. Privacy and Data Usage"
    },
    {
      type: "paragraph",
      content: "This dApp operates on public blockchain infrastructure. You acknowledge that:"
    },
    {
      type: "list",
      items: [
        "Public Data: Your wallet address, transaction history, and participation records are permanently recorded on the Monad blockchain and are publicly accessible.",
        "No Personally Identifiable Information (PII): The Organizer does not collect, store, or process PII such as names, email addresses, or government-issued identification.",
        "Analytics: The Organizer may collect anonymized usage data (e.g., average participants per raffle, total mon participated, keys purchased) for operational and analytical purposes.",
        "Third-Party Services: This dApp integrates with third-party services (e.g., wallet providers, blockchain explorers, VRF providers) subject to their own privacy policies. The Organizer is not responsible for third-party data practices.",
        "No Sale of Data: The Organizer does not sell or monetize user data."
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "15. Amendments to Terms"
    },
    {
      type: "paragraph",
      content: "The Organizer reserves the right to modify, update, or replace these Terms at any time. Changes will be effective immediately upon posting to this dApp. Your continued use after changes constitutes acceptance of the revised Terms. You are responsible for reviewing these Terms periodically."
    },
    {
      type: "heading",
      level: 2,
      content: "16. Contact and Feedback"
    },
    {
      type: "paragraph",
      content: "For questions, concerns, or feedback regarding these Terms, please contact the Organizer via the designated support channels (e.g., Twitter/X). The Organizer is not obligated to respond to all inquiries but will make reasonable efforts to address legitimate concerns."
    },
    {
      type: "heading",
      level: 2,
      content: "17. Final Acknowledgment"
    },
    {
      type: "paragraph",
      content: "By participating in this dApp, you acknowledge that you have read, understood, and agreed to these Terms of Service in their entirety. You further acknowledge that:"
    },
    {
      type: "list",
      items: [
        "You are participating voluntarily for entertainment and community engagement purposes only.",
        "You understand the risks associated with cryptocurrency, smart contracts, blockchain technology, and specifically Treasure Hunt key purchases and reveals.",
        "You accept full responsibility for all consequences of your participation, including lost secrets, key consumption, and missed claim windows.",
        "You have consulted legal, financial, or tax professionals as necessary."
      ]
    },
    {
      type: "paragraph",
      content: "IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY CEASE ALL USE OF THIS DAPP."
    }
  ]
};