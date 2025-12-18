import { useState, useRef, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain, useSignMessage } from 'wagmi';
import { parseEther, formatEther, keccak256, encodePacked, toBytes } from 'viem';
import { monadMainnet } from '../walletIntegration/config';
import TreasureHuntABI from '../abi/TreasureHunt.json';
import Header from './Header';
import SubNav from './SubNav';
import '../css/treasureHunt.css';

// ============================================
// CONTRACT CONFIGURATION
// ============================================
const CONTRACT_CONFIG = {
  address: '0x91AC7FEfB3759C36355F92eF3F3014f9aF648Bb7',
  abi: TreasureHuntABI,
  chainId: monadMainnet.id,
};

// ============================================
// SIGNATURE-BASED SECRET GENERATION
// ============================================
const generateSecretMessage = (tHuntId, squareIndex, address) => {
  return `TreasureHunt Commit\n\nHunt ID: ${tHuntId}\nSquare: ${squareIndex}\nWallet: ${address}\n\nSign this message to commit your square selection. This signature will be used to reveal your square after the hunt ends.`;
};

const signatureToSecret = (signature) => {
  return keccak256(signature);
};

const generateCommitHash = (squareIndex, secret) => {
  return keccak256(encodePacked(['uint256', 'bytes32'], [BigInt(squareIndex), secret]));
};

// ============================================
// LOCAL STORAGE FOR TRACKING COMMITTED SQUARES
// ============================================
const STORAGE_KEY = 'treasureHunt_commits';

const getStoredCommits = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeCommit = (tHuntId, squareIndex, address) => {
  const commits = getStoredCommits();
  const key = `${tHuntId}_${squareIndex}_${address}`;
  commits[key] = { tHuntId, squareIndex, address, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(commits));
};

const removeCommit = (tHuntId, squareIndex, address) => {
  const commits = getStoredCommits();
  const key = `${tHuntId}_${squareIndex}_${address}`;
  delete commits[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(commits));
};

const getUserCommittedSquares = (tHuntId, address) => {
  const commits = getStoredCommits();
  const prefix = `${tHuntId}_`;
  const suffix = `_${address}`;
  const squares = [];
  
  for (const key of Object.keys(commits)) {
    if (key.startsWith(prefix) && key.endsWith(suffix)) {
      const squareIndex = parseInt(key.replace(prefix, '').replace(suffix, ''));
      squares.push(squareIndex);
    }
  }
  
  return squares;
};

function TreasureHunt() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [currentTHuntId, setCurrentTHuntId] = useState(null);
  const [keyAmount, setKeyAmount] = useState('1');
  const [treasureDiscoveries, setTreasureDiscoveries] = useState([]);
  const [userCommittedSquares, setUserCommittedSquares] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  
  const mapRef = useRef(null);

  // ============================================
  // CONTRACT READS
  // ============================================
  
  const { data: activeTHuntIds, refetch: refetchActiveIds } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getActiveTHuntIds',
  });

  const { data: huntInfo, refetch: refetchHuntInfo } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getTHuntInfo',
    args: currentTHuntId ? [currentTHuntId] : undefined,
    enabled: !!currentTHuntId,
  });

  const { data: userKeyBalance, refetch: refetchKeyBalance } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getKeyBalance',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: reservedSquaresData, refetch: refetchReservedSquares } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getReservedSquares',
    args: currentTHuntId ? [currentTHuntId] : undefined,
    enabled: !!currentTHuntId,
  });

  const { data: revealedSquaresData, refetch: refetchRevealedSquares } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getRevealedSquaresWithResults',
    args: currentTHuntId ? [currentTHuntId] : undefined,
    enabled: !!currentTHuntId && huntInfo && (Number(huntInfo[11]) === 2 || Number(huntInfo[11]) === 3),
  });

  const { data: userStatus, refetch: refetchUserStatus } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getUserTHuntStatus',
    args: currentTHuntId && address ? [currentTHuntId, address] : undefined,
    enabled: !!currentTHuntId && !!address,
  });

  const { data: userTreasures, refetch: refetchUserTreasures } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getUserTreasures',
    args: currentTHuntId && address ? [currentTHuntId, address] : undefined,
    enabled: !!currentTHuntId && !!address,
  });

  const { data: canClaimBonus, refetch: refetchBonusCheck } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'canClaimBonusKey',
    args: currentTHuntId && address ? [currentTHuntId, address] : undefined,
    enabled: !!currentTHuntId && !!address,
  });

  const { data: reservedSquareCount, refetch: refetchReservedCount } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getReservedSquareCount',
    args: currentTHuntId ? [currentTHuntId] : undefined,
    enabled: !!currentTHuntId,
  });

  // ============================================
  // PARSED HUNT INFO
  // ============================================
  const parsedHuntInfo = huntInfo ? {
    gridWidth: Number(huntInfo[0]),
    gridHeight: Number(huntInfo[1]),
    rewardPerTreasure: huntInfo[2],
    treasureCount: Number(huntInfo[3]),
    startTime: Number(huntInfo[4]),
    endTime: Number(huntInfo[5]),
    raffleIdStart: Number(huntInfo[6]),
    raffleIdEnd: Number(huntInfo[7]),
    treasuresFound: Number(huntInfo[8]),
    treasuresClaimed: Number(huntInfo[9]),
    claimDeadline: Number(huntInfo[10]),
    state: Number(huntInfo[11]),
  } : null;

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (activeTHuntIds && activeTHuntIds.length > 0) {
      setCurrentTHuntId(activeTHuntIds[0]);
    } else {
      setCurrentTHuntId(null);
    }
  }, [activeTHuntIds]);

  useEffect(() => {
    if (currentTHuntId && address) {
      const committed = getUserCommittedSquares(currentTHuntId.toString(), address);
      setUserCommittedSquares(committed);
    }
  }, [currentTHuntId, address]);

  useEffect(() => {
    if (isConnected) {
      switchChain?.({ chainId: monadMainnet.id });
    }
  }, [isConnected, switchChain]);

  useEffect(() => {
    if (isSuccess) {
      setTxStatus('success');
      setIsProcessing(false);
      setPendingAction(null);
      refetchHuntInfo();
      refetchKeyBalance();
      refetchReservedSquares();
      refetchRevealedSquares();
      refetchUserStatus();
      refetchBonusCheck();
      refetchReservedCount();
      refetchUserTreasures();
      
      if (currentTHuntId && address) {
        const committed = getUserCommittedSquares(currentTHuntId.toString(), address);
        setUserCommittedSquares(committed);
      }
      
      setTimeout(() => setTxStatus(''), 3000);
    }
  }, [isSuccess, refetchHuntInfo, refetchKeyBalance, refetchReservedSquares, refetchRevealedSquares, refetchUserStatus, refetchBonusCheck, refetchReservedCount, refetchUserTreasures, currentTHuntId, address]);

  useEffect(() => {
    if (!currentTHuntId) return;

    const interval = setInterval(() => {
      refetchReservedSquares();
      refetchHuntInfo();
      refetchReservedCount();
      if (parsedHuntInfo && (parsedHuntInfo.state === 2 || parsedHuntInfo.state === 3)) {
        refetchRevealedSquares();
        refetchUserTreasures();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTHuntId, refetchReservedSquares, refetchHuntInfo, refetchReservedCount, refetchRevealedSquares, refetchUserTreasures, parsedHuntInfo]);

  useEffect(() => {
    if (!revealedSquaresData || !parsedHuntInfo) return;
    if (parsedHuntInfo.state !== 2 && parsedHuntInfo.state !== 3) return;

    const [revealedIndices, isTreasureArr, openers] = revealedSquaresData;
    const discoveries = [];

    for (let i = 0; i < revealedIndices.length; i++) {
      if (isTreasureArr[i]) {
        discoveries.push({
          squareIndex: Number(revealedIndices[i]),
          finder: openers[i],
          reward: parsedHuntInfo.rewardPerTreasure,
          timestamp: Date.now() - (revealedIndices.length - i) * 60000,
        });
      }
    }

    setTreasureDiscoveries(discoveries.slice(-10).reverse());
  }, [revealedSquaresData, parsedHuntInfo]);

  useEffect(() => {
    setSelectedSquare(null);
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  }, [currentTHuntId]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mapRef.current && mapRef.current.contains(e.target)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    let initialDistance = 0;
    let initialZoom = 1;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = zoom;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const scale = distance / initialDistance;
        setZoom(Math.max(0.5, Math.min(3, initialZoom * scale)));
      }
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('touchstart', handleTouchStart);
      mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('touchstart', handleTouchStart);
        mapElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [zoom]);

  // ============================================
  // CONTRACT INTERACTIONS
  // ============================================

  const handleBuyKeys = async () => {
    const amount = parseInt(keyAmount);
    if (!amount || amount < 1 || amount > 100) {
      setTxStatus('error');
      return;
    }

    setIsProcessing(true);
    setTxStatus('');
    setPendingAction('buy');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'buyKeys',
        value: parseEther(amount.toString()),
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Buy keys failed:', error);
      setTxStatus('error');
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  const handleClaimBonusKey = async () => {
    if (!currentTHuntId || !canClaimBonus) return;

    setIsProcessing(true);
    setTxStatus('');
    setPendingAction('bonus');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'claimBonusKey',
        args: [currentTHuntId],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Claim bonus failed:', error);
      setTxStatus('error');
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  const handleCommitSquare = async () => {
    if (selectedSquare === null || !currentTHuntId || !address) return;

    setIsProcessing(true);
    setTxStatus('');
    setPendingAction('commit');

    try {
      // Generate message and request signature
      const message = generateSecretMessage(currentTHuntId.toString(), selectedSquare, address);
      const signature = await signMessageAsync({ message });
      
      // Convert signature to secret and generate commit hash
      const secret = signatureToSecret(signature);
      const commitHash = generateCommitHash(selectedSquare, secret);

      // Store commit reference locally (no secret needed, just tracking)
      storeCommit(currentTHuntId.toString(), selectedSquare, address);

      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'commitSquare',
        args: [currentTHuntId, BigInt(selectedSquare), commitHash],
        chainId: monadMainnet.id,
      });

      setSelectedSquare(null);
    } catch (error) {
      console.error('Commit square failed:', error);
      // Remove stored commit if transaction failed
      if (currentTHuntId && selectedSquare !== null && address) {
        removeCommit(currentTHuntId.toString(), selectedSquare, address);
      }
      setTxStatus('error');
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  const handleRevealSquare = async (squareIndex) => {
    if (!currentTHuntId || !address) return;

    setIsProcessing(true);
    setTxStatus('');
    setPendingAction('reveal');

    try {
      // Regenerate the secret by signing the same message
      const message = generateSecretMessage(currentTHuntId.toString(), squareIndex, address);
      const signature = await signMessageAsync({ message });
      const secret = signatureToSecret(signature);

      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'revealSquare',
        args: [currentTHuntId, BigInt(squareIndex), secret],
        chainId: monadMainnet.id,
      });

      // Remove commit tracking after successful reveal
      removeCommit(currentTHuntId.toString(), squareIndex, address);
    } catch (error) {
      console.error('Reveal square failed:', error);
      setTxStatus('error');
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  const handleRevealAll = async () => {
    if (!currentTHuntId || !address || userCommittedSquares.length === 0) return;

    for (const squareIndex of userCommittedSquares) {
      await handleRevealSquare(squareIndex);
    }
  };

  const handleClaimTreasure = async (treasureIndex) => {
    if (!currentTHuntId) return;

    setIsProcessing(true);
    setTxStatus('');
    setPendingAction('claim');

    try {
      await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'claimTreasure',
        args: [currentTHuntId, BigInt(treasureIndex)],
        chainId: monadMainnet.id,
      });
    } catch (error) {
      console.error('Claim treasure failed:', error);
      setTxStatus('error');
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const indexToCoordinate = (index) => {
    if (!parsedHuntInfo) return '';
    const col = index % parsedHuntInfo.gridWidth;
    const row = Math.floor(index / parsedHuntInfo.gridWidth);
    const letter = String.fromCharCode(65 + col);
    const number = row + 1;
    return `${letter}${number}`;
  };

  const getHuntStatus = () => {
    if (!parsedHuntInfo) return { status: 'none', text: 'No Active Hunt', className: 'status-none' };
    
    const { state, startTime, endTime } = parsedHuntInfo;
    const currentTime = Math.floor(Date.now() / 1000);

    if (state === 1 && currentTime >= startTime && currentTime < endTime) {
      return { status: 'live', text: '● LIVE', className: 'status-live' };
    } else if (state === 1 && currentTime < startTime) {
      return { status: 'pending', text: 'STARTING SOON', className: 'status-pending' };
    } else if (state === 2) {
      return { status: 'ended', text: 'ENDED - REVEAL PHASE', className: 'status-ended' };
    } else if (state === 3) {
      return { status: 'completed', text: 'COMPLETED', className: 'status-completed' };
    } else if (state === 0) {
      return { status: 'pending', text: 'PENDING VRF', className: 'status-pending' };
    } else if (state === 4) {
      return { status: 'cancelled', text: 'CANCELLED', className: 'status-cancelled' };
    }
    
    return { status: 'none', text: 'No Active Hunt', className: 'status-none' };
  };

  const isSquareReserved = (index) => {
    if (!reservedSquaresData) return false;
    return reservedSquaresData.some(i => Number(i) === index);
  };

  const isSquareRevealed = (index) => {
    if (!revealedSquaresData) return false;
    const [revealedIndices] = revealedSquaresData;
    return revealedIndices.some(i => Number(i) === index);
  };

  const isUserSquare = (index) => {
    return userCommittedSquares.includes(index);
  };

  const getSquareResult = (index) => {
    if (!revealedSquaresData) return null;
    if (parsedHuntInfo && parsedHuntInfo.state !== 2 && parsedHuntInfo.state !== 3) return null;
    
    const [revealedIndices, isTreasureArr] = revealedSquaresData;
    const revealedIndex = revealedIndices.findIndex(i => Number(i) === index);
    if (revealedIndex === -1) return null;
    return isTreasureArr[revealedIndex];
  };

  const getUnrevealedUserSquares = () => {
    if (!parsedHuntInfo || parsedHuntInfo.state !== 2) return [];
    return userCommittedSquares.filter(sq => !isSquareRevealed(sq));
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.treasure-square')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSquareClick = (index) => {
    if (isSquareReserved(index)) return;
    if (parsedHuntInfo && parsedHuntInfo.state !== 1) return;
    setSelectedSquare(index);
  };

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // ============================================
  // RENDER DATA
  // ============================================

  const gridWidth = parsedHuntInfo ? parsedHuntInfo.gridWidth : 5;
  const gridHeight = parsedHuntInfo ? parsedHuntInfo.gridHeight : 5;
  const totalSquares = gridWidth * gridHeight;
  const totalRewards = parsedHuntInfo ? formatEther(BigInt(parsedHuntInfo.rewardPerTreasure) * BigInt(parsedHuntInfo.treasureCount)) : '0';
  const treasuresFound = parsedHuntInfo ? parsedHuntInfo.treasuresFound : 0;
  const totalTreasures = parsedHuntInfo ? parsedHuntInfo.treasureCount : 0;
  const keyBalance = userKeyBalance ? Number(userKeyBalance) : 0;
  const reservedCount = reservedSquareCount ? Number(reservedSquareCount) : 0;
  const huntStatusData = getHuntStatus();
  const unrevealedSquares = getUnrevealedUserSquares();
  const claimableTreasures = userTreasures ? userTreasures[1] : [];

  return (
    <div className="nads-container">
      <Header />
      <SubNav />
      
      <main className="nads-main">
        <div className="treasure-hunt-wrapper">
          {/* Hunt Status & Total Rewards */}
          <div className="hunt-header">
            <div className={`hunt-status ${huntStatusData.className}`}>
              {huntStatusData.text}
            </div>
            <div className="total-rewards">
              <span className="rewards-label">Total Rewards:</span>
              <span className="rewards-value">{totalRewards} MON</span>
            </div>
          </div>

          {/* Wallet Info Panel */}
          <div className="treasure-info-panel wallet-panel">
            <div className="info-row">
              <span className="info-label">Wallet Address:</span>
              <span className="info-value">{address ? formatAddress(address) : 'Not Connected'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Key Count:</span>
              <span className="info-value">{keyBalance}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Start Date:</span>
              <span className="info-value">{parsedHuntInfo ? formatDate(parsedHuntInfo.startTime) : 'N/A'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">End Date:</span>
              <span className="info-value">{parsedHuntInfo ? formatDate(parsedHuntInfo.endTime) : 'N/A'}</span>
            </div>

            {parsedHuntInfo && parsedHuntInfo.state === 2 && (
              <div className="info-row">
                <span className="info-label">Claim Deadline:</span>
                <span className="info-value highlight">{formatDate(parsedHuntInfo.claimDeadline)}</span>
              </div>
            )}
          </div>

          {/* Key Management Panel */}
          <div className="key-panel">
            <div className="key-purchase">
              <input 
                type="number" 
                min="1" 
                max="100" 
                step="1"
                value={keyAmount}
                onChange={(e) => {
                  const val = Math.floor(Number(e.target.value));
                  if (val >= 0 && val <= 100) {
                    setKeyAmount(val.toString());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(paste)) {
                    e.preventDefault();
                  }
                }}
                className="key-input"
                placeholder="1-100 MON"
                disabled={isProcessing || isConfirming}
              />
              <button 
                className="key-btn buy-btn"
                onClick={handleBuyKeys}
                disabled={isProcessing || isConfirming || !isConnected}
              >
                {isProcessing && pendingAction === 'buy' ? 'Processing...' : `Buy Keys (${keyAmount} MON = ${parseInt(keyAmount || 0) * 2} Keys)`}
              </button>
            </div>
            
            {canClaimBonus && (
              <button 
                className="key-btn bonus-btn"
                onClick={handleClaimBonusKey}
                disabled={isProcessing || isConfirming}
              >
                Claim Bonus Key (Raffle Participant)
              </button>
            )}
          </div>

          {/* Reveal Panel (shown during Ended state) */}
          {parsedHuntInfo && parsedHuntInfo.state === 2 && unrevealedSquares.length > 0 && (
            <div className="reveal-panel">
              <h3>Reveal Your Squares</h3>
              <p>You have {unrevealedSquares.length} unrevealed square(s). Sign a message to reveal each square and see if you found treasure!</p>
              <div className="reveal-squares-list">
                {unrevealedSquares.map((sq) => (
                  <button
                    key={sq}
                    className="reveal-btn"
                    onClick={() => handleRevealSquare(sq)}
                    disabled={isProcessing || isConfirming}
                  >
                    Reveal {indexToCoordinate(sq)}
                  </button>
                ))}
              </div>
              {unrevealedSquares.length > 1 && (
                <button
                  className="reveal-all-btn"
                  onClick={handleRevealAll}
                  disabled={isProcessing || isConfirming}
                >
                  Reveal All
                </button>
              )}
            </div>
          )}

          {/* Claim Panel (shown when user has claimable treasures) */}
          {claimableTreasures && claimableTreasures.length > 0 && (
            <div className="claim-panel">
              <h3>🎉 Claim Your Treasures!</h3>
              <p>You found {claimableTreasures.length} treasure(s)!</p>
              <div className="claim-treasures-list">
                {claimableTreasures.map((treasureIndex) => (
                  <button
                    key={treasureIndex.toString()}
                    className="claim-btn"
                    onClick={() => handleClaimTreasure(Number(treasureIndex))}
                    disabled={isProcessing || isConfirming}
                  >
                    Claim Treasure #{Number(treasureIndex) + 1} ({formatEther(parsedHuntInfo.rewardPerTreasure)} MON)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game Info Panel */}
          <div className="treasure-info-panel">
            <div className="info-row">
              <span className="info-label">Grid Size:</span>
              <span className="info-value">{gridWidth}x{gridHeight}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Reserved:</span>
              <span className="info-value">{reservedCount} / {totalSquares}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Treasures Found:</span>
              <span className="info-value highlight">
                {treasuresFound} / {totalTreasures}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Your Squares:</span>
              <span className="info-value">{userCommittedSquares.length}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Selected:</span>
              <span className="info-value">
                {selectedSquare !== null ? indexToCoordinate(selectedSquare) : 'None'}
              </span>
            </div>
          </div>

          {huntStatusData.status === 'none' ? (
            <div className="no-hunt-message">
              <p>No active treasure hunt at the moment. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Map Container */}
              <div 
                className="map-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={mapRef}
              >
                <div 
                  className="treasure-map"
                  style={{
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                    gridTemplateColumns: `repeat(${gridWidth}, 50px)`,
                    gridTemplateRows: `repeat(${gridHeight}, 50px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                  }}
                >
                  {Array.from({ length: totalSquares }).map((_, index) => {
                    const reserved = isSquareReserved(index);
                    const revealed = isSquareRevealed(index);
                    const isUserSq = isUserSquare(index);
                    const hasTreasure = revealed ? getSquareResult(index) : null;
                    const isSelected = selectedSquare === index;
                    const canSelect = !reserved && parsedHuntInfo && parsedHuntInfo.state === 1;

                    return (
                      <div
                        key={index}
                        className={`treasure-square 
                          ${reserved ? 'reserved' : ''} 
                          ${revealed ? 'revealed' : ''} 
                          ${isSelected ? 'selected' : ''} 
                          ${isUserSq ? 'user-square' : ''}
                          ${!canSelect ? 'disabled' : ''}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canSelect) handleSquareClick(index);
                        }}
                      >
                        <div className="square-inner">
                          <div className="square-front">
                            {reserved && !revealed ? (
                              <span className="reserved-label">{isUserSq ? '🔒 Yours' : '🔒'}</span>
                            ) : revealed ? (
                              <span className="revealed-label">Revealed</span>
                            ) : (
                              <>
                                <div className="square-shine"></div>
                                <span className="square-keyhole">🎁</span>
                              </>
                            )}
                          </div>
                          <div className="square-back">
                            {revealed && hasTreasure !== null && (
                              <div className="square-result">
                                {hasTreasure ? (
                                  <span className="treasure-icon">🏆</span>
                                ) : (
                                  <span className="empty-icon">💨</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls Panel */}
              <div className="controls-panel">
                <div className="zoom-controls">
                  <span className="zoom-label">Zoom:</span>
                  <span className="zoom-display">{(zoom * 100).toFixed(0)}%</span>
                  <button className="control-btn reset-btn" onClick={handleResetView}>
                    RESET VIEW
                  </button>
                </div>
                
                {txStatus === 'success' && (
                  <p className="tx-status success">Transaction successful!</p>
                )}
                {txStatus === 'error' && (
                  <p className="tx-status error">Transaction failed. Please try again.</p>
                )}
                
                {parsedHuntInfo && parsedHuntInfo.state === 1 && (
                  <button 
                    className={`open-square-btn ${selectedSquare === null || keyBalance === 0 ? 'disabled' : ''}`}
                    onClick={handleCommitSquare}
                    disabled={selectedSquare === null || isProcessing || isConfirming || keyBalance === 0}
                  >
                    {!isConnected ? 'Connect Wallet' :
                     keyBalance === 0 ? 'No Keys Available' :
                     isProcessing && pendingAction === 'commit' ? 'Signing & Committing...' :
                     selectedSquare !== null ? `Commit Square ${indexToCoordinate(selectedSquare)}` : 
                     'Select a Square'}
                  </button>
                )}

                {parsedHuntInfo && parsedHuntInfo.state === 2 && (
                  <p className="phase-info">
                    Hunt has ended! Sign to reveal your squares and claim any treasures before the deadline.
                  </p>
                )}

                {parsedHuntInfo && parsedHuntInfo.state === 3 && (
                  <p className="phase-info">
                    This treasure hunt has been completed.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Treasure Discovery Feed (only shown after hunt ends) */}
          {treasureDiscoveries.length > 0 && parsedHuntInfo && (parsedHuntInfo.state === 2 || parsedHuntInfo.state === 3) && (
            <div className="discovery-feed">
              <h3 className="feed-title">Treasure Winners</h3>
              <div className="feed-list">
                {treasureDiscoveries.map((discovery, idx) => (
                  <div key={idx} className="feed-item">
                    <span className="feed-address">{formatAddress(discovery.finder)}</span>
                    <span className="feed-square">{indexToCoordinate(discovery.squareIndex)}</span>
                    <span className="feed-reward">{formatEther(discovery.reward)} MON</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Notice */}
          <div className="notice-panel info-notice">
            <p><strong>Important:</strong> Participating in this Treasure Hunt means you agree to and understand the <a href="/docs">Guidelines</a>.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TreasureHunt;
