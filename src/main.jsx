import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource/press-start-2p'
import './global.css'
import App from './App.jsx'
import NadsMaker from './components/NadsMaker.jsx'
import Docs from './components/docs.jsx'
import NFTDraw from './components/nftDraw.jsx'
import Admin from './components/admin.jsx'
import PrevRaffle from './components/prevRaffle.jsx'
import MonAnalytics from './components/1monAnalytics.jsx'
import Profile from './components/profile.jsx'
import WalletProvider from './walletIntegration/WalletProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/1mon" element={<NadsMaker />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/nft-draw" element={<NFTDraw />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/prev-raffle" element={<PrevRaffle />} />
          <Route path="/1mon-analytics" element={<MonAnalytics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </StrictMode>,
)