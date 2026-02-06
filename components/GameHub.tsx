'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getGamePlayerCount, getGameAverageRating } from '@/lib/platformService'

interface Game {
  id: string
  title: string
  description: string
  icon: string
  status: 'available' | 'coming-soon'
  players: number
  rating: number
  image?: string
}

interface GameHubProps {
  userId: string
}

const GAME_BASE: Omit<Game, 'players' | 'rating'>[] = [
  {
    id: 'treasure-quest',
    title: 'Treasure Quest',
    description: 'An epic platformer adventure through magical lands. Collect gems, avoid hazards, and reach the exit to complete levels.',
    icon: '🏜️',
    status: 'available',
    image: '✨'
  },
  {
    id: 'crystal-match',
    title: 'Crystal Match',
    description: 'A beautiful memory matching puzzle game. Flip cards to find pairs and master the crystal kingdom. Perfect for quick gaming sessions!',
    icon: '💎',
    status: 'available'
  },
  {
    id: 'space-blaster',
    title: 'Space Blaster',
    description: 'Defend Earth from alien invaders! Control your spaceship with arrow keys and blast enemies. Survive increasing waves for high scores.',
    icon: '🚀',
    status: 'available'
  },
  {
    id: 'pixel-runner',
    title: 'Pixel Runner',
    description: 'Run through a colorful pixelated world! Jump over obstacles and set distance records. How far can you run?',
    icon: '🏃',
    status: 'available'
  }
]

export function GameHub({ userId }: GameHubProps) {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadGameStats()
  }, [])

  const loadGameStats = async () => {
    setLoading(true)
    try {
      const gamesWithStats = await Promise.all(
        GAME_BASE.map(async (game) => ({
          ...game,
          players: await getGamePlayerCount(game.id),
          rating: await getGameAverageRating(game.id)
        }))
      )
      setGames(gamesWithStats)
      console.log('[v0] Loaded game stats:', gamesWithStats)
    } catch (error) {
      console.error('[v0] Error loading game stats:', error)
      // Fallback to default values if error
      setGames(GAME_BASE.map(g => ({ ...g, players: 0, rating: 0 })))
    } finally {
      setLoading(false)
    }
  }

  const handlePlayGame = (gameId: string) => {
    const gameRoutes: Record<string, string> = {
      'treasure-quest': '/game/treasure-quest',
      'crystal-match': '/game/crystal-match',
      'space-blaster': '/game/space-blaster',
      'pixel-runner': '/game/pixel-runner'
    }
    
    if (gameRoutes[gameId]) {
      router.push(gameRoutes[gameId])
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Game Hub</h1>
            <p className="text-slate-400">Discover and play amazing games</p>
          </div>
          <div className="text-5xl">🎮</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-4xl animate-spin mb-4">⚙️</div>
          <p className="text-slate-400">Loading games...</p>
        </div>
      )}

      {/* Featured Game */}
      {!loading && games.find(g => g.status === 'available') && (
        <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 text-9xl opacity-10">🎮</div>
          <div className="relative z-10">
            <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm font-semibold mb-4">
              Featured Game
            </div>
            <h2 className="text-3xl font-bold mb-2">Treasure Quest</h2>
            <p className="text-slate-300 mb-6 max-w-2xl">
              An epic platformer adventure through magical lands. Collect shimmering gems, navigate treacherous obstacles, and reach the exit to complete each level. With 9 increasingly challenging levels, will you become a master explorer?
            </p>
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-400">Players</p>
                <p className="text-2xl font-bold">15,420</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Rating</p>
                <p className="text-2xl font-bold text-yellow-400">★ 4.8</p>
              </div>
            </div>
            <button
              onClick={() => handlePlayGame('treasure-quest')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105"
            >
              Play Now
            </button>
          </div>
        </div>
      )}

      {/* Games Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-all cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{game.icon}</div>
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{game.description}</p>

              {game.status === 'available' ? (
                <>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-400">{game.players.toLocaleString()} playing</span>
                    <span className="text-yellow-400">★ {game.rating}</span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handlePlayGame(game.id)
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Play Now
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-center font-semibold">
                  Coming Soon
                </div>
              )}
            </div>
        ))}
      </div>
      )}
    </div>
  )
}
