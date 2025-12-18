import { DocData } from './guidelines';

export const treasureHuntData: DocData = {
  title: "Treasure Hunt",
  sections: [
    {
      type: "heading",
      level: 2,
      content: "Overview"
    },
    {
      type: "paragraph",
      content: "An interactive grid-based treasure hunt game where participants use keys to reveal squares and discover hidden treasures. All treasure locations are determined by cryptographically secure randomness from Pyth VRF."
    },
    {
      type: "notice",
      content: "⚠️ Important: This is a community engagement game, not gambling. Purchasing keys is for entertainment and participation purposes only. All outcomes are determined by verifiable randomness and strategy."
    },
    {
      type: "heading",
      level: 2,
      content: "How It Works"
    },
    {
      type: "heading",
      level: 3,
      content: "1. Get Keys"
    },
    {
      type: "list",
      items: [
        "Purchase keys: 1 MON = 2 keys (minimum 1 MON, maximum 100 MON per transaction)",
        "Claim bonus keys: If you participated in eligible '1 MON and A Dream' raffles, claim 1 free key per active treasure hunt",
        "Keys are global and can be used across all active treasure hunts"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "2. Commit to a Square"
    },
    {
      type: "list",
      items: [
        "Choose any unreserved square on the grid",
        "Submit a commit hash (keccak256 of squareIndex + secret) to reserve it",
        "This uses 1 key from your balance",
        "Commit-reveal prevents front-running and ensures fairness",
        "You must remember your secret to reveal later"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "3. Wait for Hunt to End"
    },
    {
      type: "list",
      items: [
        "Hunt runs from startTime to endTime",
        "Treasure locations are generated using Pyth VRF seed (requested at creation)",
        "No one knows treasure locations until squares are revealed"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "4. Reveal Your Squares"
    },
    {
      type: "list",
      items: [
        "After hunt ends, you have 3 days to reveal your committed squares",
        "Provide your secret to prove you committed to that square",
        "If your square contains treasure, you're marked as the winner for that treasure",
        "Multiple treasures can exist on the grid"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "5. Claim Treasure Rewards"
    },
    {
      type: "list",
      items: [
        "If you found treasure(s), claim your reward(s) within the 3-day window",
        "Each treasure has a fixed reward amount set by the admin",
        "Unclaimed rewards after 3 days may be transferred to treasury"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Treasure Hunt States"
    },
    {
      type: "table",
      headers: ["State", "Description"],
      rows: [
        ["Created", "Hunt created, waiting for VRF randomness"],
        ["Active", "Hunt is live, accepting square commits"],
        ["Ended", "Hunt ended, reveals and claims open (3-day window)"],
        ["Completed", "All claims processed or window expired"],
        ["Cancelled", "Hunt cancelled due to VRF timeout"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Bonus Keys Eligibility"
    },
    {
      type: "paragraph",
      content: "When creating a treasure hunt, the admin specifies a raffle ID range (e.g., raffleIdStart: 5, raffleIdEnd: 10). You can claim 1 bonus key if you:"
    },
    {
      type: "list",
      items: [
        "Participated in any raffle within that range",
        "The raffle was finalized (had a winner selected)",
        "You haven't claimed the bonus key for this hunt yet"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Commit-Reveal Mechanism"
    },
    {
      type: "paragraph",
      content: "To ensure fairness and prevent front-running:"
    },
    {
      type: "list",
      items: [
        "Commit Phase: You submit keccak256(squareIndex, secret) during the active hunt",
        "Reveal Phase: After hunt ends, you provide your secret to prove your commitment",
        "This prevents others from seeing which squares you selected",
        "You must keep your secret safe - losing it means you can't reveal your square"
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
        "Maximum Grid Size: 10,000 squares (e.g., 100x100)",
        "Claim Window: 3 days after hunt ends",
        "VRF Timeout: 1 day (hunt cancelled if randomness not received)",
        "Key Purchase: Must be whole MON amounts (1, 2, 3, etc.)",
        "Keys Per MON: 2 keys per 1 MON spent",
        "No Refunds: Keys are non-refundable once purchased",
        "Collision Handling: If treasures collide on same square, contract regenerates position with nonce",
        "Pull-Based Claims: You must manually claim your treasure rewards",
        "Auto-Complete: If no squares were reserved, hunt auto-completes with no winners"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Strategy Tips"
    },
    {
      type: "list",
      items: [
        "Grid corners and edges may be less competitive",
        "Claim bonus keys early to maximize participation",
        "Remember your secret - write it down securely",
        "Reveal within 3 days or lose your chance at treasures",
        "Multiple treasures mean multiple chances to win"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Contract Address"
    },
    {
      type: "code",
      content: "0x91AC7FEfB3759C36355F92eF3F3014f9aF648Bb7"
    }
  ]
};