'use client'

import { useEffect, useRef, useState } from 'react'

interface Card {
  id: number
  symbol: string
  matched: boolean
  flipped: boolean
}

export function CrystalMatchGame({ onSessionData }: any) {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gameRef = useRef<any>(null)

  const SYMBOLS = ['💎', '⭐', '🔥', '❄️', '🌊', '🌿', '⚡', '🎨']

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const newCards = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        matched: false,
        flipped: false
      }))

    setCards(newCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameOver(false)
    setScore(0)
  }

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id) || gameOver) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].symbol === cards[second].symbol) {
        const newMatched = [...matched, first, second]
        setMatched(newMatched)
        setScore(prev => prev + 50)
        setFlipped([])

        if (newMatched.length === cards.length) {
          setGameOver(true)
        }
      } else {
        setMoves(prev => prev + 1)
        setTimeout(() => setFlipped([]), 600)
      }
    }
  }

  useEffect(() => {
    if (gameRef.current && gameOver) {
      gameRef.current.gameEngineRef = {
        current: {
          player: { gems: score }
        }
      }
      gameRef.current.currentLevelId = 1
      gameRef.current.levelComplete = true

      onSessionData?.({
        levelReached: 1,
        gemsCollected: score,
        score: score,
        completed: gameOver
      })
    }
  }, [gameOver, score, onSessionData])

  return (
    <div
      ref={gameRef}
      className="w-full h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Crystal Match</h1>

        <div className="flex justify-between items-center mb-8 text-white">
          <div className="text-lg">
            Moves: <span className="font-bold text-cyan-400">{moves}</span>
          </div>
          <div className="text-lg">
            Score: <span className="font-bold text-yellow-400">{score}</span>
          </div>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-semibold"
          >
            New Game
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg font-bold text-3xl transition-all duration-300 transform ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500 scale-95'
                  : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-110'
              } shadow-lg`}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.symbol : '?'}
            </button>
          ))}
        </div>

        {gameOver && (
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Level Complete!</h2>
            <p className="text-white text-xl mb-4">
              Score: <span className="text-yellow-400 font-bold">{score}</span> points
            </p>
            <p className="text-white text-lg mb-6">
              Completed in <span className="text-cyan-400 font-bold">{moves}</span> moves
            </p>
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
