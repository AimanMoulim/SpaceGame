# 🏜️ Treasure of the Lost Oasis

A family-friendly 2D platformer adventure game built with Next.js, React, and Canvas.

## Game Overview

Embark on an epic adventure across four mystical worlds to collect treasures and overcome obstacles. This halal, non-violent game is designed for all ages and promotes skill-based gameplay without gambling or inappropriate content.

## Features

✨ **Core Gameplay**
- 4 unique levels with increasing difficulty
- Smooth platformer mechanics with gravity and physics
- Gem collection system for scoring
- Lives system (3 hearts per level)
- Checkpoint respawn system

🎮 **Controls**
- **Arrow Keys (← →)**: Move left and right
- **Space Bar**: Jump
- **E**: Interact / Open doors (future feature)

🏗️ **Game Levels**
1. **Desert Oasis** - Introduction to basic platforming
2. **Ancient Temple** - More complex jumping puzzles
3. **Jungle Ruins** - Higher obstacles and multiple hazards
4. **Ice Cave** - Advanced platforming challenges

## Obstacles & Hazards

⚠️ **Non-Violent Challenges**
- **Spikes**: Red hazards that cost you a life
- **Lava**: Hot orange areas to avoid
- **Moving Platforms**: Dynamic navigation elements
- **Falling Rocks**: Physics-based obstacles (future)
- **Timed Traps**: Puzzle elements (future)

## Collectibles

💎 **Gems**
- Collect shimmering blue gems scattered throughout levels
- No direct effect on gameplay but provide scoring
- Tracked in HUD and end-game stats

## Game States

1. **Main Menu** - Start, level select, sound toggle
2. **Gameplay** - Active level with HUD
3. **Level Complete** - Victory screen with stats
4. **Game Over** - Defeat screen with retry option

## Technical Architecture

```
lib/
  ├── gameEngine.ts     # Core game loop, physics, collisions
  └── levels.ts         # Level definitions and data

components/
  ├── GameScreen.tsx    # Main game state manager
  ├── GameCanvas.tsx    # Canvas rendering component
  ├── MainMenu.tsx      # Title and start screen
  ├── LevelComplete.tsx # Victory screen
  └── GameOver.tsx      # Defeat screen

app/
  ├── page.tsx          # Main entry point
  ├── layout.tsx        # Root layout with metadata
  └── globals.css       # Game theme and styles
```

## Game Engine Details

### Physics System
- **Gravity**: 0.6 pixels/frame acceleration
- **Terminal Velocity**: 20 pixels/frame (falling speed cap)
- **Jump Power**: 12 pixels/frame upward acceleration
- **Move Speed**: 5 pixels/frame left/right

### Collision Detection
- AABB (Axis-Aligned Bounding Box) collision system
- Platform collision with ground detection
- Gem collection detection
- Hazard collision with respawn
- Level exit detection

### Camera System
- Smooth camera follow tracking player position
- Horizontal scrolling within level bounds
- Prevents camera shake

## How to Play

1. **Start a Level** - Choose from main menu or level select
2. **Navigate** - Use arrow keys to move and space to jump
3. **Collect Gems** - Bonus points for collecting blue diamonds
4. **Reach Exit** - Gold platform marks the level exit
5. **Avoid Hazards** - Stay away from red spikes and orange lava
6. **Complete All Levels** - Unlock the next level when you reach the exit

## Progress Saving

The game automatically saves:
- Current level progress
- Sound settings
- Progress stored in browser localStorage

## Difficulty Progression

- **Level 1**: Basic platforms and minimal hazards
- **Level 2**: More complex jumping patterns
- **Level 3**: Higher platforms and multiple obstacle types
- **Level 4**: Advanced platforming with dense hazards

## Future Features

- Sound effects and background music
- Particle effects for gem collection
- More obstacle types (moving platforms, switches, doors)
- Leaderboard system
- Mobile touch controls
- Additional levels and worlds

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled

## Performance

- 60 FPS target on modern browsers
- Optimized canvas rendering
- Efficient collision detection
- Minimal memory footprint

## Game Design Philosophy

🎯 **Family-Friendly**
- No violence or combat
- Colorful, inviting visual style
- Encouraging and positive messages

🎨 **Accessible**
- Simple, intuitive controls
- Clear visual feedback
- Gradual difficulty curve

⚖️ **Skill-Based**
- Timing and precision required
- Progressive challenges
- Replayability value

## Credits

Built with ❤️ for all ages
- Developed with Next.js 16 and React
- Canvas-based custom game engine
- No external game framework required

---

**Play now and become a legendary treasure hunter!** 🏆
