import { DocData } from './guidelines';

export const nftDrawData: DocData = {
  title: "NFT Draw",
  sections: [
    {
      type: "heading",
      level: 2,
      content: "Overview"
    },
    {
      type: "paragraph",
      content: "An eligibility-based reward system where active raffle participants may be selected to receive exclusive NFT rewards. The NFT Draw is completely separate from the \"1 MON and A Dream\" raffle system and operates under different mechanics."
    },
    {
      type: "notice",
      content: "⚠️ Important Notice\n\nEligibility does NOT guarantee rewards. Meeting the participation threshold grants eligibility for the draw, but selection and reward distribution are subject to availability, randomness, and the Organizer's discretion."
    },
    {
      type: "heading",
      level: 2,
      content: "How It Works"
    },
    {
      type: "heading",
      level: 3,
      content: "1. Eligibility Requirements"
    },
    {
      type: "list",
      items: [
        "Participate in at least TBA (successful or unsuccessful) in the \"1 MON and A Dream\" system",
        "Both winning and non-winning raffle participations count toward eligibility",
        "Refunded raffles also count as participation",
        "Track your progress in the NFT Draw tab"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "2. Participation Tracking"
    },
    {
      type: "list",
      items: [
        "Your participation count is automatically tracked on-chain via smart contract logs",
        "Visit the NFT Draw tab to view your current participation count",
        "The frontend reads your participation data directly from the blockchain",
        "All calculations are transparent and verifiable"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "3. Draw Schedule"
    },
    {
      type: "list",
      items: [
        "Target frequency: One NFT Draw for every (TBA) completed raffles",
        "Exact dates and times are To Be Announced (TBA)",
        "Schedule is subject to change based on raffle activity and participation levels",
        "Announcements will be made via Twitter/X and updated in this documentation"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "4. Selected Participant Process"
    },
    {
      type: "list",
      items: [
        "Eligible wallet addresses are collected from on-chain participation data",
        "Admin triggers the NFT Draw via a separate smart contract (not yet deployed)",
        "Winning participants are selected using Pyth VRF (Verifiable Random Function) for cryptographically secure randomness",
        "Selection is completely random and transparent",
        "Selected participant addresses are emitted on-chain for full transparency"
      ]
    },
    {
      type: "heading",
      level: 3,
      content: "5. NFT Distribution"
    },
    {
      type: "list",
      items: [
        "No claim window required - NFTs are sent directly to selected participants",
        "Admin wallet manually distributes NFT rewards to selected participants",
        "NFTs are sent to the same wallet address used during raffle participation",
        "Selected participants will be notified via on-chain events and social media announcements",
        "Ensure your wallet can receive NFTs (ERC-721 or ERC-1155 compatible)"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Key Differences from 1 MON Raffle"
    },
    {
      type: "table",
      headers: ["Feature", "1 MON and A Dream", "NFT Draw"],
      rows: [
        ["Entry Cost", "1 MON per raffle", "Free (based on participation)"],
        ["Eligibility", "Pay 1 MON", "TBA"],
        ["Reward Type", "MON cryptocurrency", "NFT (non-fungible token)"],
        ["Claim Process", "Manual claim within 3 days", "Distributed by admin"],
        ["Smart Contract", "0x188E095Aab1f75E7F8c39480C45005854ef31fcB", "TBA (not yet deployed)"],
        ["Selection Method", "Pyth VRF", "Pyth VRF"],
        ["Frequency", "Every week", "TBA"]
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
        "No Guarantees: Eligibility does not guarantee selection or reward distribution",
        "Subject to Change: All mechanics, schedules, and reward details are subject to change without notice",
        "NFT Value: NFTs have no guaranteed financial value and are for community engagement only",
        "Wallet Compatibility: Ensure your wallet supports NFT standards (ERC-721/ERC-1155)",
        "Updates: All changes will be documented on this page and announced via social media",
        "Separate System: NFT Draw operates independently from the 1 MON raffle system"
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Contract Information"
    },
    {
      type: "paragraph",
      content: "Status: Smart contract not yet deployed"
    },
    {
      type: "paragraph",
      content: "Contract Address: To Be Announced (TBA)"
    },
    {
      type: "paragraph",
      content: "VRF Provider: Pyth Entropy (same as 1 MON raffle)"
    },
    {
      type: "paragraph",
      content: "Admin Wallet: Same as 1 MON raffle system"
    },
    {
      type: "heading",
      level: 2,
      content: "Coming Soon"
    },
    {
      type: "paragraph",
      content: "Additional features and mechanics are currently in development and will be documented here upon release. Stay tuned for updates via our social media channels and this documentation page."
    },
    {
      type: "heading",
      level: 2,
      content: "Legal Disclaimer"
    },
    {
      type: "paragraph",
      content: "Please review Section 8 (NFT Draw Terms) in the Guidelines tab for complete legal terms and conditions regarding the NFT Draw system."
    }
  ]
};