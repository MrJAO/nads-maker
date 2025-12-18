import { DocData } from './guidelines';

export const smartContractData: DocData = {
  title: "Smart Contract",
  sections: [
    {
      type: "heading",
      level: 2,
      content: "1 MON and A Dream - Smart Contract"
    },
    {
      type: "code",
      content: "0x188E095Aab1f75E7F8c39480C45005854ef31fcB"
    },
    {
      type: "paragraph",
      content: "View on MonadScan: https://monadscan.com/address/0x188E095Aab1f75E7F8c39480C45005854ef31fcB"
    },
    {
      type: "heading",
      level: 2,
      content: "Immutable Addresses"
    },
    {
      type: "table",
      headers: ["Name", "Address"],
      rows: [
        ["Admin", "0x14d5aa304Af9c1aeFf1F37375f85bA0cbFb6C104"],
        ["Treasury", "0x6779387e262e3eC8C81F62DCD3B2348931B5254d"],
        ["Pyth Entropy (VRF)", "0xD458261E832415CFd3BAE5E416FdF3230ce6F134"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Constants"
    },
    {
      type: "table",
      headers: ["Name", "Value"],
      rows: [
        ["Participation Amount", "1 MON"],
        ["Claim Window", "3 days"],
        ["VRF Timeout", "1 day"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Admin Functions"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["createRaffle()", "Creates a new raffle with start time, end time, threshold, and reward amount"],
        ["finalizeRaffle()", "Triggers after deadline; requests VRF if threshold met, enables refunds if not"],
        ["cancelStuckRaffle()", "Cancels a raffle stuck in PendingVRF state after 1-day timeout"],
        ["cancelEndedRaffle()", "Cancels ended raffles (threshold met) that cannot be finalized after 24 hours due to emergencies (VRF timeout, high VRF fees); enables refunds"],
        ["markRaffleCompleted()", "Marks expired raffles as completed for cleanup"],
        ["injectGas()", "Sends MON to contract for rewards and gas"],
        ["treasuryTransfer()", "Transfers specified amount to treasury (validates against reserved funds)"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "User Functions"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["joinRaffle()", "Pay 1 MON to join a raffle"],
        ["claimReward()", "Selected participant claims their reward within 3-day window"],
        ["claimRefund()", "Participant claims refund within 3-day window"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "View Functions"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["getRaffleInfo()", "Returns all raffle details for a given raffleId"],
        ["getParticipants()", "Returns array of participant addresses for a raffle"],
        ["isParticipant()", "Checks if an address joined a specific raffle"],
        ["canClaimReward()", "Checks if user can claim reward now"],
        ["canClaimRefund()", "Checks if user can claim refund now"],
        ["getUserClaimStatus()", "Returns winner status, claimable status, and claimable amount"],
        ["getRaffleStats()", "Returns success status, threshold %, refund totals, completion status"],
        ["getReservedFunds()", "Returns total MON owed to users (unclaimed rewards + refunds)"],
        ["getWithdrawableAmount()", "Returns balance minus reserved funds"],
        ["getActiveRaffleIds()", "Returns array of active raffle IDs"],
        ["getActiveRaffleCount()", "Returns number of active raffles"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Security Features"
    },
    {
      type: "list",
      items: [
        "ReentrancyGuard: Prevents reentrancy attacks on all state-changing functions",
        "Pull-Based Claims: Users claim their own funds, preventing DoS attacks",
        "Reserved Funds Protection: Treasury transfers validate against owed amounts",
        "VRF Timeout Handler: Stuck raffles can be cancelled after 1 day",
        "Immutable Addresses: Admin, Treasury, and Pyth addresses cannot be changed",
        "Single Winner Enforcement: Only one selected participant per raffle, verified by contract",
        "Double-Claim Prevention: Mappings prevent claiming rewards/refunds twice"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Treasure Hunt - Smart Contract"
    },
    {
      type: "code",
      content: "0x91AC7FEfB3759C36355F92eF3F3014f9aF648Bb7"
    },
    {
      type: "paragraph",
      content: "View on MonadScan: https://monadscan.com/address/0x91AC7FEfB3759C36355F92eF3F3014f9aF648Bb7"
    },
    {
      type: "heading",
      level: 2,
      content: "Immutable Addresses (Treasure Hunt)"
    },
    {
      type: "table",
      headers: ["Name", "Address"],
      rows: [
        ["Admin", "0x14d5aa304Af9c1aeFf1F37375f85bA0cbFb6C104"],
        ["Treasury", "0x6779387e262e3eC8C81F62DCD3B2348931B5254d"],
        ["Pyth Entropy (VRF)", "0xD458261E832415CFd3BAE5E416FdF3230ce6F134"],
        ["1MON Contract", "0x188E095Aab1f75E7F8c39480C45005854ef31fcB"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Constants (Treasure Hunt)"
    },
    {
      type: "table",
      headers: ["Name", "Value"],
      rows: [
        ["Max Grid Size", "10,000 squares"],
        ["Claim Window", "3 days"],
        ["VRF Timeout", "1 day"],
        ["Keys Per MON", "2 keys"],
        ["Min Key Purchase", "1 MON"],
        ["Max Key Purchase", "100 MON"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Admin Functions (Treasure Hunt)"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["createTreasureHunt()", "Creates new hunt with grid size, treasure count, rewards, time range, and raffle eligibility range"],
        ["endTreasureHunt()", "Ends active hunt after endTime; opens 3-day claim window for reveals and claims"],
        ["markCompleted()", "Marks hunt as completed after claim window expires"],
        ["forceCancel()", "Cancels hunt stuck in Created state after 1-day VRF timeout"],
        ["treasuryTransfer()", "Transfers specified amount to treasury (validates against reserved funds)"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "User Functions (Treasure Hunt)"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["claimBonusKey()", "Claim 1 free key if eligible from specified raffle range"],
        ["buyKeys()", "Purchase keys: send whole MON amounts (1-100 MON), receive 2 keys per MON"],
        ["commitSquare()", "Reserve a square by submitting keccak256(squareIndex, secret); uses 1 key"],
        ["revealSquare()", "After hunt ends, reveal your square with the secret to check for treasure"],
        ["claimTreasure()", "Claim your treasure reward within 3-day window"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "View Functions (Treasure Hunt)"
    },
    {
      type: "table",
      headers: ["Function", "Description"],
      rows: [
        ["getTHuntInfo()", "Returns all hunt details including grid size, treasures, rewards, and state"],
        ["getKeyBalance()", "Returns user's current key balance"],
        ["isSquareReserved()", "Checks if a square is already reserved"],
        ["isSquareRevealed()", "Checks if a square has been revealed"],
        ["getSquareOpener()", "Returns address that reserved a square"],
        ["getReservedSquareCount()", "Returns total reserved squares for a hunt"],
        ["getRevealedSquareCount()", "Returns total revealed squares for a hunt"],
        ["canClaimBonusKey()", "Checks if user can claim bonus key for a hunt"],
        ["canClaimTreasure()", "Checks if user can claim a specific treasure"],
        ["getUserTHuntStatus()", "Returns user's key balance, bonus status, and treasure wins/claims"],
        ["getUserTreasures()", "Returns arrays of won, claimable, and claimed treasure IDs"],
        ["getActiveTHuntIds()", "Returns array of active treasure hunt IDs"],
        ["getActiveTHuntCount()", "Returns number of active treasure hunts"],
        ["getWithdrawableAmount()", "Returns balance minus reserved funds"],
        ["getReservedSquares()", "Returns array of all reserved square indices"],
        ["getRevealedSquaresWithResults()", "Returns revealed squares with treasure status and openers (only after hunt ends)"]
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Security Features (Treasure Hunt)"
    },
    {
      type: "list",
      items: [
        "ReentrancyGuard: Prevents reentrancy attacks on all state-changing functions",
        "No Contracts: Only EOAs (externally owned accounts) can interact, preventing bot abuse",
        "Commit-Reveal: Prevents front-running by requiring two-step square selection",
        "Pull-Based Claims: Users claim their own treasure rewards",
        "Reserved Funds Protection: Treasury transfers validate against unclaimed rewards",
        "VRF Timeout Handler: Stuck hunts can be cancelled after 1 day",
        "Collision Prevention: Treasures cannot occupy same square; nonce-based regeneration",
        "Double-Claim Prevention: Mappings prevent claiming same treasure twice",
        "Bonus Key Tracking: Each user can claim bonus key only once per hunt",
        "Key Balance System: Global key management prevents double-spending",
        "Immutable Addresses: Admin, Treasury, Pyth, and OneMON contract addresses cannot be changed",
        "Auto-Complete: Hunts with zero reserved squares auto-complete on end"
      ]
    }
  ]
};