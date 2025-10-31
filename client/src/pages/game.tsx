import { useState, useEffect, useRef } from 'react';
import { Trophy, Wallet, X, ChevronDown, Moon, Sun, Play, RotateCcw } from 'lucide-react';

const BASE_CHAIN_ID = '0x2105';
const BASE_CHAIN_CONFIG = {
  chainId: BASE_CHAIN_ID,
  chainName: 'Base',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface LeaderboardEntry {
  address: string;
  score: number;
  timestamp: number;
}

export default function CatchingGame() {
  const [darkMode, setDarkMode] = useState(true);
  const [account, setAccount] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [score, setScore] = useState(0);
  const [missedItems, setMissedItems] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [basketPos, setBasketPos] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const itemInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('catchItemsLeaderboard');
      if (stored) {
        const scores: LeaderboardEntry[] = JSON.parse(stored);
        setLeaderboard(scores.sort((a, b) => b.score - a.score).slice(0, 10));
      }
    } catch (error) {
      console.log('Loading leaderboard...');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'okx') => {
    try {
      let provider;
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          alert('Please install MetaMask!');
          return;
        }
        provider = window.ethereum;
      } else if (walletType === 'okx') {
        if (!window.okxwallet) {
          alert('Please install OKX Wallet!');
          return;
        }
        provider = window.okxwallet;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const chainId = await provider.request({ method: 'eth_chainId' });

      if (chainId !== BASE_CHAIN_ID) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [BASE_CHAIN_CONFIG],
            });
          }
        }
      }

      setAccount(accounts[0]);
      setShowWalletMenu(false);
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsGuest(false);
    setShowWalletMenu(false);
  };

  const playAsGuest = () => {
    setIsGuest(true);
    setShowWalletMenu(false);
  };

  const startGame = () => {
    setScore(0);
    setMissedItems(0);
    setItems([]);
    setGameActive(true);
    setGameOver(false);
    setBasketPos(50);

    itemInterval.current = setInterval(() => {
      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85,
        y: 0,
        emoji: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍒', '🍑'][Math.floor(Math.random() * 8)]
      };
      setItems(prev => [...prev, newItem]);
    }, 1200);

    gameInterval.current = setInterval(() => {
      setItems(prev => {
        const updated = prev.map(item => ({ ...item, y: item.y + 2.5 }));
        const missed = updated.filter(item => item.y >= 100);
        if (missed.length > 0) {
          setMissedItems(m => m + missed.length);
        }
        return updated.filter(item => item.y < 100);
      });
    }, 50);
  };

  const stopGame = () => {
    if (gameInterval.current) clearInterval(gameInterval.current);
    if (itemInterval.current) clearInterval(itemInterval.current);
    setGameActive(false);
    setGameOver(true);

    if (account && score > 0) {
      try {
        const shortAddr = `${account.slice(0, 6)}...${account.slice(-4)}`;
        const scoreData: LeaderboardEntry = {
          address: shortAddr,
          score: score,
          timestamp: Date.now()
        };
        
        const stored = localStorage.getItem('catchItemsLeaderboard');
        const existing: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
        existing.push(scoreData);
        localStorage.setItem('catchItemsLeaderboard', JSON.stringify(existing));
        loadLeaderboard();
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }

    if (isGuest && score > 0) {
      setTimeout(() => {
        alert(`Great game! Your score: ${score}\n\nConnect your wallet to save scores to the leaderboard!`);
      }, 500);
    }
  };

  useEffect(() => {
    if (missedItems >= 10 && gameActive) {
      stopGame();
    }
  }, [missedItems, gameActive]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft') {
        setBasketPos(prev => Math.max(0, prev - 6));
      } else if (e.key === 'ArrowRight') {
        setBasketPos(prev => Math.min(85, prev + 6));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameActive) return;
    const touchX = e.touches[0].clientX;
    const gameArea = e.currentTarget;
    const rect = gameArea.getBoundingClientRect();
    const percentage = ((touchX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(0, Math.min(85, percentage - 5)));
  };

  useEffect(() => {
    if (!gameActive) return;

    items.forEach(item => {
      if (item.y > 82 && item.y < 95) {
        const distance = Math.abs(item.x - basketPos);
        if (distance < 10) {
          setScore(prev => prev + 10);
          setItems(prev => prev.filter(i => i.id !== item.id));
        }
      }
    });
  }, [items, basketPos, gameActive]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  
  const cardClass = darkMode 
    ? 'bg-white/10 backdrop-blur-md border border-white/20' 
    : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-purple-300' : 'text-purple-600';
  const gameAreaBg = darkMode 
    ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900' 
    : 'bg-gradient-to-b from-sky-300 via-blue-200 to-green-100';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-4 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2" data-testid="text-game-title">
              <span className="text-3xl md:text-5xl">🎮</span>
              Catch Items
            </h1>
            <p className={`${textSecondary} text-xs md:text-sm mt-1`} data-testid="text-subtitle">
              Web3 Game on Base Network
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 md:p-3 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300' 
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600'
              }`}
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              {!account && !isGuest ? (
                <>
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
                    data-testid="button-connect-wallet"
                  >
                    <Wallet className="w-4 md:w-5 h-4 md:h-5" />
                    <span className="hidden sm:inline">Connect</span>
                    <ChevronDown className="w-3 md:w-4 h-3 md:h-4" />
                  </button>

                  {showWalletMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                      <div className={`absolute right-0 mt-2 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden z-50 min-w-[220px] border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={() => connectWallet('metamask')}
                          className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                          data-testid="button-metamask"
                        >
                          <span className="text-2xl">🦊</span>
                          <span className="font-medium">MetaMask</span>
                        </button>
                        <button
                          onClick={() => connectWallet('okx')}
                          className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors border-t ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}
                          data-testid="button-okx"
                        >
                          <span className="text-2xl">⚫</span>
                          <span className="font-medium">OKX Wallet</span>
                        </button>
                        <button
                          onClick={playAsGuest}
                          className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors border-t ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}
                          data-testid="button-guest"
                        >
                          <span className="text-2xl">👤</span>
                          <span className="font-medium">Play as Guest</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : isGuest ? (
                <>
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg text-sm md:text-base ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    data-testid="button-guest-mode"
                  >
                    <span>👤</span>
                    <span className="hidden sm:inline">Guest</span>
                    <ChevronDown className="w-3 md:w-4 h-3 md:h-4" />
                  </button>

                  {showWalletMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                      <div className={`absolute right-0 mt-2 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px] border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={disconnectWallet}
                          className={`w-full px-6 py-4 text-left transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-50'}`}
                          data-testid="button-exit-guest"
                        >
                          Exit Guest Mode
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="bg-green-600 hover:bg-green-700 px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg text-sm md:text-base"
                    data-testid="button-connected-wallet"
                  >
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <span className="font-mono">{account.slice(0, 4)}...{account.slice(-4)}</span>
                    <ChevronDown className="w-3 md:w-4 h-3 md:h-4" />
                  </button>

                  {showWalletMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                      <div className={`absolute right-0 mt-2 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px] border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={disconnectWallet}
                          className={`w-full px-6 py-4 text-left transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-50'}`}
                          data-testid="button-disconnect"
                        >
                          Disconnect
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {account || isGuest ? (
          <>
            <div className={`${cardClass} rounded-xl p-4 mb-4 flex justify-between items-center transition-all`}>
              <div className="flex gap-4 md:gap-6 items-center">
                <div className="text-xl md:text-2xl font-bold" data-testid="text-score">
                  💎 {score}
                </div>
                <div className={`text-base md:text-lg font-semibold ${missedItems >= 7 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`} data-testid="text-missed">
                  ❌ {missedItems}/10
                </div>
              </div>
              <div className="flex gap-2 md:gap-3">
                {isGuest && !gameActive && (
                  <button
                    onClick={() => setShowWalletMenu(true)}
                    className="bg-purple-500 hover:bg-purple-600 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md text-xs md:text-sm font-medium"
                    data-testid="button-save-score"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Score</span>
                  </button>
                )}
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md text-sm md:text-base font-medium"
                  data-testid="button-leaderboard"
                >
                  <Trophy className="w-4 md:w-5 h-4 md:h-5" />
                  <span className="hidden md:inline">Top 10</span>
                </button>
              </div>
            </div>

            <div className={`${cardClass} rounded-2xl p-4 md:p-8 mb-4 transition-all`}>
              {!gameActive && !gameOver && (
                <div className="text-center py-8">
                  <div className="text-6xl md:text-8xl mb-6 animate-bounce">🧺</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Play?</h2>
                  <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-6 mb-6 max-w-md mx-auto`}>
                    <p className="mb-3 text-sm md:text-base">🖥️ <strong>Desktop:</strong> Use ← → arrow keys</p>
                    <p className="mb-3 text-sm md:text-base">📱 <strong>Mobile:</strong> Touch and drag</p>
                    <p className="mb-3 text-sm md:text-base">🎯 <strong>Goal:</strong> Catch items = +10 points</p>
                    <p className="text-red-400 font-bold text-sm md:text-base">⚠️ Miss 10 items = Game Over!</p>
                  </div>
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 md:px-12 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto"
                    data-testid="button-start-game"
                  >
                    <Play className="w-6 h-6" />
                    Start Game
                  </button>
                </div>
              )}

              {gameOver && (
                <div className="text-center py-8">
                  <div className="text-6xl md:text-8xl mb-6">
                    {score >= 200 ? '🏆' : score >= 100 ? '🎉' : '💪'}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {score >= 200 ? 'Amazing!' : score >= 100 ? 'Great Job!' : 'Good Try!'}
                  </h2>
                  <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-6 mb-6 max-w-md mx-auto`}>
                    <p className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-final-score">💎 {score}</p>
                    <p className={`text-lg ${textSecondary}`}>Final Score</p>
                    <p className="mt-3 text-orange-400">Missed: {missedItems} items</p>
                  </div>
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 md:px-12 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto"
                    data-testid="button-play-again"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Play Again
                  </button>
                </div>
              )}

              {gameActive && (
                <div
                  className={`relative ${gameAreaBg} rounded-xl overflow-hidden shadow-inner transition-colors duration-300`}
                  style={{ height: '500px' }}
                  onTouchMove={handleTouchMove}
                  data-testid="game-area"
                >
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="absolute text-3xl md:text-4xl transition-all duration-50 drop-shadow-lg"
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      data-testid={`item-${item.id}`}
                    >
                      {item.emoji}
                    </div>
                  ))}
                  <div
                    className="absolute bottom-0 text-5xl md:text-6xl transition-all duration-100 drop-shadow-xl"
                    style={{ left: `${basketPos}%` }}
                    data-testid="basket"
                  >
                    🧺
                  </div>
                </div>
              )}
            </div>

            {gameActive && (
              <div className="text-center">
                <button
                  onClick={stopGame}
                  className="bg-red-500 hover:bg-red-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg text-base md:text-lg"
                  data-testid="button-end-game"
                >
                  End Game
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={`${cardClass} rounded-2xl p-8 md:p-12 text-center transition-all`}>
            <div className="text-6xl md:text-8xl mb-6">🎮</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Catch Items!</h2>
            <p className={`text-lg md:text-xl ${textSecondary} mb-8 max-w-2xl mx-auto`}>
              Connect your wallet to compete on the leaderboard or play as a guest to try the game
            </p>
            <div className={`text-left max-w-md mx-auto space-y-3 ${textSecondary} mb-8`}>
              <p className="flex items-center gap-2">✓ Connect with MetaMask or OKX Wallet</p>
              <p className="flex items-center gap-2">✓ Play on Base Network</p>
              <p className="flex items-center gap-2">✓ Compete for the highest score</p>
              <p className="flex items-center gap-2">✓ Global leaderboard ranking</p>
            </div>
          </div>
        )}

        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-white to-purple-50'} rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Trophy className="w-7 h-7 md:w-8 md:h-8 text-yellow-400" />
                  Leaderboard
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                  data-testid="button-close-leaderboard"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <p className={`text-center py-8 ${textSecondary}`}>Loading...</p>
                ) : leaderboard.length === 0 ? (
                  <p className={`text-center py-8 ${textSecondary}`}>No scores yet. Be the first! 🏆</p>
                ) : (
                  leaderboard.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 flex justify-between items-center transition-all border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
                      data-testid={`leaderboard-entry-${idx}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl md:text-3xl font-bold ${
                          idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : textSecondary
                        }`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <span className="font-mono text-sm md:text-base">{entry.address}</span>
                      </div>
                      <span className="text-xl md:text-2xl font-bold">💎 {entry.score}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
