import { DocData } from './guidelines';

export const onemonData: DocData = {
  title: "1 MON and A Dream",
  sections: [
    {
      type: "heading",
      level: 2,
      content: "Overview"
    },
    {
      type: "paragraph",
      content: "A transparent and verifiable raffle system powered by Pyth VRF for cryptographically secure random selection."
    },
    {
      type: "notice",
      content: "⚠️ Important Wallet Recommendations\n\n• Use MetaMask for the best experience. This dApp uses Wagmi for wallet integration, which is optimized for MetaMask.\n• Always read the Wallet Confirmation message. Don't rush, check the popup message before confirming any transaction.\n• Use a dummy or sub wallet address for additional security. Never connect your main wallet with significant funds to any dApp."
    },
    {
      type: "heading",
      level: 2,
      content: "How It Works"
    },
    {
      type: "heading",
      level: 3,
      content: "1. Join a Raffle"
    },
    {
      type: "list",
      items: [
        "Connect your wallet",
        "Pay exactly 1 MON to enter",
        "One entry per wallet per raffle",
        "Join anytime during the raffle period"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "2. Threshold Requirement"
    },
    {
      type: "list",
      items: [
        "Each raffle has a minimum participant threshold",
        "If threshold is met → Winning participant is selected",
        "If threshold is not met → All participants can claim refunds"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "3. Participant Selection (Threshold Met)"
    },
    {
      type: "list",
      items: [
        "After the raffle ends, admin triggers finalization",
        "Contract requests randomness from Pyth VRF",
        "VRF provides cryptographically secure random number",
        "Winning participant is selected from participants array using the random number",
        "Winning participant address and reward amount are emitted on-chain"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "4. Claiming Rewards"
    },
    {
      type: "list",
      items: [
        "Selected participant must claim their reward within 3 days",
        "Visit the Profile tab to see if you were selected",
        "Click \"Claim Reward\" to receive your prize",
        "Unclaimed rewards after 3 days may be transferred to treasury"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "5. Refunds (Threshold Not Met or Emergency Cancellation)"
    },
    {
      type: "list",
      items: [
        "If threshold is not met, refunds are enabled",
        "If raffle cannot be finalized after 24 hours due to emergencies (VRF timeout, high fees), admin can cancel and enable refunds",
        "Participants can claim their 1 MON back within 3 days",
        "Visit the Profile tab and click \"Claim Refund\"",
        "Unclaimed refunds after 3 days may be transferred to treasury"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Raffle States"
    },
    {
      type: "table",
      headers: ["State", "Description"],
      rows: [
        ["Created", "Raffle created, waiting for start time"],
        ["Active", "Raffle is open, accepting participants"],
        ["PendingVRF", "Waiting for randomness from Pyth VRF"],
        ["WinnerSelected", "Participant selected, awaiting reward claim"],
        ["RefundsEnabled", "Threshold not met, refunds available"],
        ["Cancelled", "Raffle cancelled (VRF timeout or emergency), refunds available"],
        ["Completed", "Raffle fully finalized"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Important Notes"
    },
    {
      type: "list",
      items: [
        "Claim Window: 3 days for both rewards and refunds",
        "Participation Amount: Exactly 1 MON (no more, no less)",
        "One Entry Per Wallet: You cannot join the same raffle twice",
        "Pull-Based System: You must manually claim your funds",
        "Emergency Cancellations: If a raffle cannot be finalized after 24 hours, admin may cancel it and enable refunds",
        "Track Your Status: Check the Profile tab to see your participation history and claimable rewards/refunds"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Contract Address"
    },
    {
      type: "code",
      content: "0x188E095Aab1f75E7F8c39480C45005854ef31fcB"
    }
  ]
};