# Space Invaders - Development Roadmap

**Project**: Space Invaders Mobile PWA
**Version**: 1.0.0
**Status**: 📋 Specification Complete → Ready for Phase 1
**Last Updated**: 2025-11-19

---

## 🎯 Project Overview

Faithful recreation of the 1978 arcade classic "Space Invaders" optimized for modern mobile browsers, maintaining the authentic retro feel while providing accessibility for all users.

### Key Goals
- ✅ Authentic 1978 gameplay
- ✅ 60fps mobile performance
- ✅ Touch-optimized controls
- ✅ PWA with offline support
- ✅ Production-ready quality

---

## 📊 Current Status

```
Progress: [🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜] 10%

✅ Specification Phase Complete
⏭️ Ready to begin Phase 1
```

---

## 🗺️ Development Phases

### ✅ Phase 0: Planning & Specification (COMPLETE)
**Duration**: Complete
**Status**: ✅ DONE

#### Completed Tasks:
- ✅ Original Space Invaders research
- ✅ Requirement gathering and dialogue
- ✅ Technical specification document created
- ✅ Architecture design finalized
- ✅ Technology stack selected
- ✅ ZEAMI.md updated with project info
- ✅ Git repository initialized
- ✅ Project documentation complete

#### Deliverables:
- ✅ SPECIFICATIONS.md (comprehensive)
- ✅ ROADMAP.md (this file)
- ✅ ZEAMI.md (updated)
- ✅ CLAUDE.md (agent best practices)

---

### ⏭️ Phase 1: Core Game Logic & Rendering
**Goal**: Playable game with basic graphics
**Status**: 🔜 NEXT UP
**Definition of Done**:
- [ ] Production build succeeds with zero errors
- [ ] Code review agent executed and issues resolved
- [ ] Game playable from start to game over
- [ ] Core mechanics feel authentic to 1978 original

#### Tasks:
1. **Project Setup**
   - [ ] Initialize Vite + TypeScript project
   - [ ] Configure tsconfig.json
   - [ ] Set up project structure (folders)
   - [ ] Install dependencies
   - [ ] Create basic HTML template

2. **Canvas & Rendering Engine**
   - [ ] Create Renderer.ts
   - [ ] Implement canvas setup (224x256 logical resolution)
   - [ ] Implement auto-scaling for mobile screens
   - [ ] Create color zone system (red/white/green overlay)
   - [ ] Test portrait orientation lock

3. **Game Loop**
   - [ ] Implement Game.ts main class
   - [ ] Create 60fps game loop with requestAnimationFrame
   - [ ] Implement delta time calculation
   - [ ] Create update/render separation
   - [ ] Add FPS counter (dev mode)

4. **Player Entity**
   - [ ] Create Player.ts class
   - [ ] Implement horizontal movement
   - [ ] Implement shooting (one bullet limit)
   - [ ] Create player sprite (13×8px green)
   - [ ] Add movement boundaries
   - [ ] Test collision box

5. **Invader Entities**
   - [ ] Create Invader.ts class
   - [ ] Implement 5×11 formation setup
   - [ ] Create 3 invader types (small/medium/large)
   - [ ] Implement 2-frame animation
   - [ ] Implement left-right movement pattern
   - [ ] Implement edge detection and descent
   - [ ] **Implement acceleration as invaders die** (critical!)

6. **Bullet & Missile System**
   - [ ] Create Bullet.ts (player)
   - [ ] Create Missile.ts (enemy)
   - [ ] Implement 3 missile types (slow/fast/wiggly)
   - [ ] Add bullet/missile rendering
   - [ ] Implement movement logic

7. **Shield System**
   - [ ] Create Shield.ts class
   - [ ] Design 4 bunker sprites (22×16px)
   - [ ] Implement pixel-based destruction
   - [ ] Test collision with bullets/missiles

8. **Collision Detection**
   - [ ] Create CollisionManager.ts
   - [ ] Implement bullet-invader collision
   - [ ] Implement missile-player collision
   - [ ] Implement bullet/missile-shield collision
   - [ ] Test all collision scenarios

9. **Scoring & Lives**
   - [ ] Create ScoreManager.ts
   - [ ] Implement point system (10/20/30)
   - [ ] Implement lives system (3 lives)
   - [ ] Implement 1500-point extra life
   - [ ] Add HUD display (basic)

10. **Game Over Logic**
    - [ ] Detect player out of lives
    - [ ] Detect invaders reaching bottom
    - [ ] Implement game over state
    - [ ] Add restart functionality

#### Code Review Checklist:
- [ ] No `any` types used
- [ ] All functions have return types
- [ ] Consistent naming conventions
- [ ] No magic numbers (use constants)
- [ ] Comments on complex logic
- [ ] No console.log in production code

#### Testing Checklist:
- [ ] Player moves smoothly left/right
- [ ] Shooting works (one bullet limit enforced)
- [ ] Invaders move in authentic pattern
- [ ] Invaders accelerate correctly as they die
- [ ] Collisions detect accurately
- [ ] Score increments correctly
- [ ] Lives decrement on hit
- [ ] Game over triggers properly
- [ ] 60fps maintained throughout

---

### ⏭️ Phase 2: Audio Implementation
**Goal**: All authentic sounds working
**Status**: 📅 PLANNED
**Definition of Done**:
- [ ] Production build succeeds with zero errors
- [ ] Code review agent executed and issues resolved
- [ ] All 11 sounds implemented and working
- [ ] Bass line tempo syncs with invader speed
- [ ] No audio glitches on iOS Safari or Android Chrome

#### Tasks:
1. **Audio Engine Setup**
   - [ ] Create AudioEngine.ts
   - [ ] Initialize Web Audio API context
   - [ ] Implement audio node pooling
   - [ ] Add master volume control
   - [ ] Test on iOS Safari (unlock audio)

2. **4-Note Bass Line** ⭐ CRITICAL
   - [ ] Create BassLine.ts
   - [ ] Synthesize 4 descending notes (C2→A1→F1→D1)
   - [ ] Implement looping
   - [ ] **Implement dynamic tempo** (syncs with invader speed)
   - [ ] Use square wave (retro 8-bit)
   - [ ] Test acceleration feel

3. **UFO Sound**
   - [ ] Create UFO warbling sound
   - [ ] Simulate SN76477 chip sound
   - [ ] Continuous while UFO on screen
   - [ ] Test modulation

4. **Player & Enemy Sounds**
   - [ ] Player shoot sound ("pew")
   - [ ] Invader killed sound (explosion)
   - [ ] UFO destroyed sound
   - [ ] Player death sound (dramatic)

5. **Additional Sounds**
   - [ ] Invader step sound
   - [ ] Shield hit sound
   - [ ] Missile fire sound
   - [ ] Extra life sound
   - [ ] Game over sound

6. **Sound Manager**
   - [ ] Create SoundEffects.ts
   - [ ] Implement sound trigger methods
   - [ ] Add sound on/off toggle
   - [ ] Limit to 3 simultaneous sounds
   - [ ] Test polyphony limits

#### Testing Checklist:
- [ ] Bass line plays immediately on game start
- [ ] Bass line accelerates smoothly with game
- [ ] UFO sound works correctly
- [ ] All sound effects trigger at right moments
- [ ] No crackling or audio artifacts
- [ ] Works on iPhone Safari
- [ ] Works on Android Chrome
- [ ] Mute toggle works correctly

---

### ⏭️ Phase 3: UI/UX & Touch Controls
**Goal**: Polished mobile experience
**Status**: 📅 PLANNED
**Definition of Done**:
- [ ] Production build succeeds with zero errors
- [ ] Code review agent executed and issues resolved
- [ ] Touch controls feel natural (tested by 3+ users)
- [ ] UI scales perfectly on various screen sizes
- [ ] All screens implemented and functional

#### Tasks:
1. **Touch Input Manager**
   - [ ] Create InputManager.ts
   - [ ] Implement left/right tap zones
   - [ ] Implement swipe-up to shoot
   - [ ] Add visual touch feedback
   - [ ] Test gesture recognition accuracy

2. **Title Screen**
   - [ ] Create TitleScreen.ts
   - [ ] Design layout (Space Invaders logo)
   - [ ] Add difficulty selector (◀ EASY/NORMAL/HARD ▶)
   - [ ] Display top 3 high scores
   - [ ] Add "TAP TO START" prompt
   - [ ] Test navigation

3. **HUD (Heads-Up Display)**
   - [ ] Create HUD.ts
   - [ ] Display current score (left)
   - [ ] Display high score (center)
   - [ ] Display lives (hearts, bottom-left)
   - [ ] Add pause button (top-right)
   - [ ] Test all HUD updates

4. **Pause Menu**
   - [ ] Create PauseMenu.ts
   - [ ] Design pause overlay
   - [ ] Add "TAP TO RESUME"
   - [ ] Add "MAIN MENU" button
   - [ ] Freeze game state correctly
   - [ ] Test pause/resume flow

5. **Game Over Screen**
   - [ ] Create GameOverScreen.ts
   - [ ] Display "GAME OVER"
   - [ ] Show final score
   - [ ] Add "TAP TO CONTINUE" prompt
   - [ ] Transition to name entry or title
   - [ ] Test flow

6. **Responsive Scaling**
   - [ ] Implement canvas auto-scaling
   - [ ] Test on various screen sizes
   - [ ] Maintain 7:8 aspect ratio
   - [ ] Ensure crisp pixel rendering
   - [ ] Test on iPhone SE (small)
   - [ ] Test on iPhone 14 Pro Max (large)
   - [ ] Test on Android devices

7. **Portrait Lock**
   - [ ] Implement orientation lock
   - [ ] Add "Please rotate" message if landscape
   - [ ] Test on iOS and Android

#### Testing Checklist:
- [ ] Touch zones respond accurately
- [ ] Swipe-up shoots reliably
- [ ] No accidental inputs
- [ ] Title screen navigable with touch
- [ ] Pause/resume works flawlessly
- [ ] UI scales on iPhone SE
- [ ] UI scales on iPhone 14 Pro Max
- [ ] UI scales on various Android devices
- [ ] Portrait lock enforced
- [ ] All transitions smooth

---

### ⏭️ Phase 4: High Scores & Difficulty
**Goal**: Complete feature set
**Status**: 📅 PLANNED
**Definition of Done**:
- [ ] Production build succeeds with zero errors
- [ ] Code review agent executed and issues resolved
- [ ] High scores persist correctly across sessions
- [ ] All 3 difficulties balanced and fun
- [ ] Name entry works flawlessly

#### Tasks:
1. **LocalStorage System**
   - [ ] Create HighScoreStorage.ts
   - [ ] Implement save/load functions
   - [ ] Define HighScore interface
   - [ ] Store top 10 scores
   - [ ] Include difficulty in score data
   - [ ] Test data persistence

2. **3-Character Name Entry** ⭐
   - [ ] Create NameEntry.ts
   - [ ] Design retro name input UI
   - [ ] Implement A-Z, 0-9 character cycling
   - [ ] Add up/down tap controls
   - [ ] Default to "AAA"
   - [ ] Test on touch devices

3. **High Score Display**
   - [ ] Show top 10 on title screen
   - [ ] Show top 3 on title screen (compact)
   - [ ] Display difficulty badge (E/N/H)
   - [ ] Format scores with commas
   - [ ] Test various score ranges

4. **Difficulty Manager**
   - [ ] Create DifficultyManager.ts
   - [ ] Implement EASY settings:
     - [ ] 5 initial lives
     - [ ] 1000-point extra life
     - [ ] 0.7x invader speed
     - [ ] 0.8x missile frequency
   - [ ] Implement NORMAL settings:
     - [ ] 3 initial lives
     - [ ] 1500-point extra life
     - [ ] 1.0x invader speed
     - [ ] 1.0x missile frequency
   - [ ] Implement HARD settings:
     - [ ] 3 initial lives
     - [ ] No extra lives
     - [ ] 1.3x invader speed
     - [ ] 1.5x missile frequency
   - [ ] Apply settings at game start

5. **Difficulty Selector UI**
   - [ ] Add ◀ ▶ arrows on title screen
   - [ ] Cycle through EASY/NORMAL/HARD
   - [ ] Save selected difficulty
   - [ ] Visual feedback on selection

6. **High Score Integration**
   - [ ] Check for high score on game over
   - [ ] Trigger name entry if qualified
   - [ ] Insert score in correct position
   - [ ] Remove 11th score if exists
   - [ ] Update display immediately

#### Testing Checklist:
- [ ] Scores save correctly
- [ ] Scores load on restart
- [ ] Name entry works smoothly
- [ ] All characters (A-Z, 0-9) accessible
- [ ] Top 10 displayed correctly
- [ ] EASY mode noticeably easier
- [ ] NORMAL mode feels authentic
- [ ] HARD mode challenging but fair
- [ ] Difficulty selector works on touch
- [ ] High score flow works end-to-end

---

### ⏭️ Phase 5: PWA & Final Polish
**Goal**: Production-ready PWA
**Status**: 📅 PLANNED
**Definition of Done**:
- [ ] Production build succeeds with zero errors
- [ ] Code review agent executed and issues resolved
- [ ] Production build optimized (< 200KB)
- [ ] PWA installable on iOS and Android
- [ ] Lighthouse PWA score: 100
- [ ] 60fps on all target devices
- [ ] All tests passing
- [ ] Zero known bugs

#### Tasks:
1. **PWA Manifest**
   - [ ] Create manifest.json
   - [ ] Define app name, icons, colors
   - [ ] Set display mode to "standalone"
   - [ ] Lock orientation to "portrait"
   - [ ] Test manifest validation

2. **App Icons**
   - [ ] Design Space Invaders icon
   - [ ] Create 192×192 icon
   - [ ] Create 512×512 icon
   - [ ] Add favicon
   - [ ] Test icon display

3. **Service Worker**
   - [ ] Set up Workbox
   - [ ] Configure caching strategy
   - [ ] Cache all game assets
   - [ ] Implement offline-first approach
   - [ ] Test offline functionality

4. **Performance Optimization**
   - [ ] Run Lighthouse audit
   - [ ] Optimize bundle size
   - [ ] Minify code
   - [ ] Compress assets
   - [ ] Implement code splitting if needed
   - [ ] Test load times

5. **Cross-Browser Testing**
   - [ ] Test on iPhone 12+ (iOS 14+, Safari)
   - [ ] Test on iPhone SE (iOS 14+, Safari)
   - [ ] Test on Pixel 5+ (Android 11+, Chrome)
   - [ ] Test on Samsung Galaxy (Android 11+, Chrome)
   - [ ] Fix any browser-specific issues

6. **Final Bug Fixes**
   - [ ] Fix all known bugs
   - [ ] Test all edge cases
   - [ ] Verify all game mechanics
   - [ ] Check for memory leaks
   - [ ] Profile performance

7. **Documentation**
   - [ ] Update README.md
   - [ ] Add deployment instructions
   - [ ] Document known limitations
   - [ ] Add credits and attribution
   - [ ] Create user guide (optional)

8. **Deployment**
   - [ ] Set up Vercel/Netlify project
   - [ ] Configure build settings
   - [ ] Deploy to production
   - [ ] Test production build
   - [ ] Set up custom domain (optional)

#### Testing Checklist:
- [ ] PWA installs on iPhone
- [ ] PWA installs on Android
- [ ] Works completely offline
- [ ] Icon shows correctly on home screen
- [ ] App name displays correctly
- [ ] Portrait lock works after install
- [ ] 60fps on iPhone 12
- [ ] 60fps on iPhone SE
- [ ] 60fps on Pixel 5
- [ ] 60fps on Samsung device
- [ ] No visual glitches
- [ ] No audio glitches
- [ ] No crashes or errors
- [ ] Memory stable over 30min play
- [ ] Battery drain acceptable
- [ ] Lighthouse score 100

---

## 🎯 Quality Gates

Each phase must pass these gates before moving to the next:

### ✅ Code Quality Gate
- [ ] TypeScript build with **zero errors**
- [ ] No `any` types (except where absolutely necessary)
- [ ] All functions have explicit return types
- [ ] ESLint passes with no warnings
- [ ] Code follows project conventions

### ✅ Code Review Gate
- [ ] Code-reviewer agent executed
- [ ] All critical issues resolved
- [ ] All recommendations considered
- [ ] Code approved for next phase

### ✅ Build Gate
- [ ] `npm run build` succeeds
- [ ] Zero build errors
- [ ] Zero TypeScript errors
- [ ] Bundle size within limits

### ✅ Performance Gate
- [ ] 60fps maintained during gameplay
- [ ] No frame drops during action
- [ ] Memory usage stable
- [ ] Load time < 2 seconds

### ✅ Functionality Gate
- [ ] All features in phase working
- [ ] No critical bugs
- [ ] Manual testing checklist complete
- [ ] User experience validated

---

## 📦 Deliverables Checklist

### Phase 1 Deliverables:
- [ ] Playable game (start to game over)
- [ ] Core mechanics implemented
- [ ] Basic graphics working
- [ ] Collision detection functional
- [ ] Code reviewed and approved

### Phase 2 Deliverables:
- [ ] All 11 sounds implemented
- [ ] 4-note bass line with dynamic tempo
- [ ] Audio works on iOS and Android
- [ ] Code reviewed and approved

### Phase 3 Deliverables:
- [ ] Touch controls implemented
- [ ] All UI screens complete
- [ ] Responsive scaling working
- [ ] Code reviewed and approved

### Phase 4 Deliverables:
- [ ] High score system complete
- [ ] 3 difficulty levels working
- [ ] Name entry functional
- [ ] Code reviewed and approved

### Phase 5 Deliverables:
- [ ] PWA installable
- [ ] Production build optimized
- [ ] All tests passing
- [ ] Deployed to production
- [ ] Code reviewed and approved

---

## 🚀 Launch Checklist

Before declaring v1.0 complete:

### Functionality:
- [ ] All 5 phases completed
- [ ] All DOD criteria met
- [ ] Zero critical bugs
- [ ] Zero high-priority bugs

### Performance:
- [ ] 60fps on iPhone 12+
- [ ] 60fps on Pixel 5+
- [ ] No audio glitches
- [ ] No visual glitches

### User Experience:
- [ ] Touch controls feel natural
- [ ] Game is fun and challenging
- [ ] Authentic Space Invaders feel
- [ ] Tested by 3+ users

### Technical:
- [ ] PWA installable on iOS
- [ ] PWA installable on Android
- [ ] Works offline after install
- [ ] Build size < 200KB
- [ ] TypeScript build: zero errors
- [ ] Lighthouse PWA score: 100

### Documentation:
- [ ] README.md complete
- [ ] SPECIFICATIONS.md up to date
- [ ] Code comments adequate
- [ ] Deployment documented

### Legal:
- [ ] No copyright violations
- [ ] Original 1978 Space Invaders is public domain (verify)
- [ ] Attribution provided if needed

---

## 📈 Success Metrics

We'll know the project is successful when:

1. **Performance**: Maintains 60fps on target devices
2. **Authenticity**: Feels like playing the 1978 original
3. **Usability**: Anyone can pick up and play
4. **Technical**: PWA works perfectly offline
5. **Quality**: Zero critical bugs in production

---

## 🎮 Development Best Practices

### Agent Workflow (Per Phase):
```yaml
1. Development:
   - Write code following specifications
   - Use TypeScript strictly
   - Follow project structure
   - Test incrementally

2. Code Review:
   - Launch code-reviewer agent
   - Address all critical issues
   - Consider recommendations
   - Document decisions

3. Build Verification:
   - Run production build
   - Fix all errors
   - Check bundle size
   - Test locally

4. Manual Testing:
   - Complete phase checklist
   - Test on target devices
   - Verify all features
   - Document issues

5. Phase Completion:
   - All DOD criteria met
   - Update ZEAMI.md
   - Update this ROADMAP.md
   - Commit with proper message
```

### Git Workflow:
```bash
# Feature branch for each phase
git checkout -b phase-1-core-game
# Work, test, commit
git add .
git commit -m "Phase 1: Implement core game logic

- Added player, invader, bullet entities
- Implemented collision detection
- Added scoring and lives system
- All tests passing

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# After code review and DOD complete
git checkout main
git merge phase-1-core-game
```

---

## 🔮 Future Considerations (Post-v1.0)

Not in scope for v1.0, but potential v2.0 features:

- 🌐 Optional online leaderboard (privacy-focused)
- 🎨 Color scheme options (accessibility)
- 📱 Landscape mode support
- 🌍 Internationalization (multi-language)
- 🎮 Game controller support
- 📊 Statistics tracking
- ♿ Enhanced accessibility options

**NOT planned**: Multiplayer, monetization, ads, social features

---

## 📞 Contact & Support

**Project Owner**: User (Non-technical)
**Lead Engineer**: Claude Code (AI)
**Framework**: ZEAMI Framework

For questions or issues during development, refer to:
- SPECIFICATIONS.md (detailed specs)
- ZEAMI.md (project knowledge)
- CLAUDE.md (development rules)

---

## 📝 Version History

- **v1.0.0** (2025-11-19): Initial roadmap created
  - All specifications defined
  - 5 development phases planned
  - Ready to begin Phase 1

---

## 🎯 Current Focus

**Phase**: Specification Complete ✅
**Next**: Phase 1 - Core Game Logic & Rendering
**Status**: Ready to begin development 🚀

---

**Last Updated**: 2025-11-19
**Next Review**: After Phase 1 completion

---

*This roadmap is a living document and will be updated as the project progresses.*
