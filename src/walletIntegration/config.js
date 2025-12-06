import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Monad Mainnet Chain Configuration
export const monadMainnet = {
  id: 143,
  name: 'Monad Mainnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.monad.xyz'],
      webSocket: ['wss://rpc.monad.xyz'],
    },
    public: {
      http: ['https://rpc.monad.xyz'],
      webSocket: ['wss://rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision',
      url: 'https://monadvision.com',
    },
    monadscan: {
      name: 'Monadscan',
      url: 'https://monadscan.com',
    },
  },
};

export const config = createConfig({
  chains: [monadMainnet],
  connectors: [injected()],
  transports: {
    [monadMainnet.id]: http('https://rpc.monad.xyz'),
  },
});

export const ADMIN_ADDRESS = '0x14d5aa304Af9c1aeFf1F37375f85bA0cbFb6C104';

// Canonical Contracts on Monad
export const MONAD_CONTRACTS = {
  WMON: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
  MULTICALL3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  PERMIT2: '0x000000000022d473030f116ddee9f6b43ac78ba3',
};
