/**
 * Game Levels Configuration
 * Defines all playable levels with platforms, gems, obstacles, and hazards
 */

import type { Level } from './gameEngine'

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Desert Oasis',
    width: 1600,
    height: 600,
    platforms: [
      // Starting area
      { x: 0, y: 550 },
      { x: 100, y: 480 },
      { x: 200, y: 400 },
      // Middle section
      { x: 350, y: 420 },
      { x: 500, y: 380 },
      { x: 650, y: 420 },
      // Jump challenge
      { x: 800, y: 350 },
      { x: 900, y: 320 },
      { x: 1000, y: 350 },
      // Water area
      { x: 1150, y: 380 },
      { x: 1300, y: 420 },
      // Final platform to exit
      { x: 1450, y: 480 },
      { x: 1550, y: 500 },
    ],
    gems: [
      { x: 150, y: 400 },
      { x: 400, y: 330 },
      { x: 750, y: 250 },
      { x: 1100, y: 280 },
      { x: 1400, y: 380 },
    ],
    spikes: [
      { x: 300, y: 380 },
      { x: 600, y: 350 },
      { x: 1050, y: 420 },
      { x: 1250, y: 380 },
    ],
    lava: [{ x: 1000, y: 500 }],
    checkpoint: { x: 600, y: 300 },
    exit: { x: 1550, y: 450 },
  },
  {
    id: 2,
    name: 'Ancient Temple',
    width: 1800,
    height: 700,
    platforms: [
      // Entrance
      { x: 0, y: 600 },
      { x: 100, y: 520 },
      { x: 200, y: 450 },
      // First chamber
      { x: 350, y: 480 },
      { x: 450, y: 400 },
      { x: 550, y: 350 },
      // Moving platforms section (static for now)
      { x: 700, y: 420 },
      { x: 800, y: 350 },
      { x: 900, y: 420 },
      // Narrow passage
      { x: 1050, y: 380 },
      { x: 1150, y: 380 },
      // Upper section
      { x: 1300, y: 300 },
      { x: 1400, y: 250 },
      { x: 1500, y: 300 },
      // Final approach
      { x: 1650, y: 400 },
      { x: 1750, y: 500 },
    ],
    gems: [
      { x: 300, y: 350 },
      { x: 650, y: 280 },
      { x: 1050, y: 280 },
      { x: 1350, y: 150 },
      { x: 1700, y: 300 },
    ],
    spikes: [
      { x: 250, y: 400 },
      { x: 600, y: 300 },
      { x: 950, y: 350 },
      { x: 1200, y: 350 },
      { x: 1550, y: 230 },
    ],
    lava: [
      { x: 500, y: 550 },
      { x: 1200, y: 500 },
    ],
    checkpoint: { x: 800, y: 300 },
    exit: { x: 1700, y: 450 },
  },
  {
    id: 3,
    name: 'Jungle Ruins',
    width: 2000,
    height: 800,
    platforms: [
      // Starting jungle
      { x: 0, y: 700 },
      { x: 100, y: 600 },
      { x: 200, y: 500 },
      // Vine section (platforms represent vines)
      { x: 350, y: 520 },
      { x: 450, y: 450 },
      { x: 550, y: 380 },
      { x: 650, y: 420 },
      // Ruins section
      { x: 800, y: 500 },
      { x: 900, y: 400 },
      { x: 1000, y: 350 },
      // Bridge
      { x: 1150, y: 400 },
      { x: 1250, y: 400 },
      { x: 1350, y: 400 },
      // Upper ruins
      { x: 1500, y: 300 },
      { x: 1600, y: 250 },
      { x: 1700, y: 300 },
      // Final climb
      { x: 1850, y: 400 },
      { x: 1950, y: 500 },
    ],
    gems: [
      { x: 250, y: 380 },
      { x: 550, y: 280 },
      { x: 900, y: 280 },
      { x: 1300, y: 300 },
      { x: 1650, y: 150 },
    ],
    spikes: [
      { x: 400, y: 400 },
      { x: 750, y: 420 },
      { x: 1100, y: 350 },
      { x: 1450, y: 270 },
      { x: 1800, y: 230 },
    ],
    lava: [
      { x: 600, y: 600 },
      { x: 1300, y: 550 },
    ],
    checkpoint: { x: 900, y: 250 },
    exit: { x: 1950, y: 450 },
  },
  {
    id: 4,
    name: 'Ice Cave',
    width: 1900,
    height: 700,
    platforms: [
      // Entrance
      { x: 0, y: 600 },
      { x: 100, y: 520 },
      // Icy descent
      { x: 200, y: 450 },
      { x: 300, y: 380 },
      // Wide platform
      { x: 450, y: 420 },
      // Ice puzzle
      { x: 600, y: 380 },
      { x: 700, y: 350 },
      { x: 800, y: 380 },
      { x: 900, y: 420 },
      // Crystal chamber
      { x: 1050, y: 300 },
      { x: 1150, y: 250 },
      { x: 1250, y: 300 },
      // Icy corridors
      { x: 1400, y: 350 },
      { x: 1500, y: 380 },
      // Final ascent
      { x: 1650, y: 450 },
      { x: 1750, y: 550 },
      { x: 1850, y: 600 },
    ],
    gems: [
      { x: 200, y: 350 },
      { x: 700, y: 250 },
      { x: 1050, y: 150 },
      { x: 1400, y: 250 },
      { x: 1700, y: 350 },
    ],
    spikes: [
      { x: 250, y: 400 },
      { x: 650, y: 300 },
      { x: 1000, y: 350 },
      { x: 1300, y: 250 },
      { x: 1550, y: 300 },
    ],
    lava: [
      { x: 450, y: 550 },
      { x: 1150, y: 500 },
    ],
    checkpoint: { x: 900, y: 250 },
    exit: { x: 1750, y: 500 },
  },
]

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find((level) => level.id === id)
}

export function getNextLevel(currentLevelId: number): Level | undefined {
  const nextId = currentLevelId + 1
  return getLevelById(nextId)
}

export function isLastLevel(levelId: number): boolean {
  return levelId === LEVELS.length
}
