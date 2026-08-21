# 🟩 SNAKE Game // RETRO LCD EDITION

```text
╔══════════════════════════════════════════╗
║              S N A K E                   ║
║                                          ║
║       ▓▓▓  RETRO LCD EDITION  ▓▓▓       ║
║                                          ║
║          [ INSERT COIN? ]                ║
║                                          ║
║          PRESS START TO PLAY             ║
╚══════════════════════════════════════════╝
```

> **A tiny browser-based Snake game inspired by classic monochrome mobile gaming.**

Fast. Simple. Pixelated.
No downloads. No accounts. No complicated setup.

Just open the game and play.

---

## 🎮 PLAY

**Live game:**

`https://gitayon.github.io/snake-game/`

> Best experienced in fullscreen on mobile or desktop.

---

# 📟 ABOUT

This project recreates the feeling of classic early mobile Snake games using a simple **green monochrome LCD aesthetic**.

The game is intentionally minimal:

```text
┌────────────────────────────┐
│ SCORE: 00040       HI: 00120│
├────────────────────────────┤
│                            │
│        ■ ■ ■               │
│              ■             │
│              ●             │
│                            │
│                            │
└────────────────────────────┘
```

### ✦ Features

* 🐍 Classic Snake gameplay
* 🟩 Retro monochrome LCD colors
* 🔄 Screen-edge wrapping
* 💡 Blinking food dot
* 🔊 Retro electronic sound effects
* 🏆 Persistent high score
* ⚡ Increasing game speed
* ⌨️ Keyboard controls
* 📱 Mobile touch controls
* 🌐 Runs directly in a web browser
* 📦 No external libraries required

---

# 🕹️ HOW TO PLAY

## 1. Start

Open the game and press:

```text
        ●
     START
```

On desktop, you can also press:

```text
ENTER
```

or

```text
SPACE
```

---

## 2. Move

### Desktop

Use the:

```text
        ↑
        W

   ← A       D →

        S
        ↓
```

Both **WASD** and the **arrow keys** work.

### Mobile

Use the on-screen controls:

```text
          ▲

      ◀   ●   ▶

          ▼
```

Tap a direction to move.

---

# 🐍 THE OBJECTIVE

Eat the blinking dot.

```text
SNAKE  →  →  →  ●
                  ↑
               FOOD
```

Every food item gives:

```text
+10 POINTS
```

Your snake gets longer.

The longer you survive, the higher your score.

---

# 🔄 SCREEN WRAPPING

The edges are **not deadly walls**.

This is an important part of the retro gameplay.

If the snake leaves the right side:

```text
             → → →
══════════════════════════╗
                          ║
                          ║
╔═════════════════════════╝
← ← ←
```

It appears on the left.

The same happens vertically:

```text
       ↑
       ↑
       ↑
       │
       │
       ↓
```

Leaving the top brings the snake back from the bottom.

Leaving the bottom brings it back from the top.

### In short:

```text
LEFT   ↔ RIGHT
TOP    ↕ BOTTOM
```

---

# 💀 GAME OVER

There is only one real danger:

## HITTING YOURSELF

```text
■■■■■■
     ■
     ■
     ●  ← CRASH
```

If the snake's head touches its own body:

```text
GAME OVER
```

Your high score is preserved.

---

# 🏆 SCORE

The score starts at:

```text
00000
```

Every food:

```text
+10
```

Example:

```text
SCORE: 00010
SCORE: 00020
SCORE: 00030
SCORE: 00040
```

The highest score is saved locally in your browser.

So closing the page doesn't necessarily erase your record.

---

# ⚡ SPEED

The game gradually becomes faster.

At the beginning:

```text
■■■
   ●

SLOW
```

Later:

```text
■■■■■■■■■■■■
          ●

FAST
```

The goal is to survive as long as possible.

---

# 🔊 SOUND

The game generates simple electronic sound effects directly in the browser.

### Starting

```text
BEEP → BEEP
```

### Eating

```text
BEEP!
```

### Game Over

```text
BEEP
  BEEP
    BEEEEEP
```

No sound files need to be downloaded.

---

# 📱 MOBILE

The game is designed to work on modern mobile browsers.

Recommended:

```text
Android
 ├─ Chrome
 ├─ Firefox
 └─ Other modern browsers

Desktop
 ├─ Chrome
 ├─ Firefox
 ├─ Edge
 └─ Safari
```

Touch controls are built into the game.

For the best experience, use fullscreen mode if your browser supports it.

---


# 🎯 GAME MANUAL

```text
╔══════════════════════════════════════╗
║              SNAKE                   ║
╠══════════════════════════════════════╣
║                                      ║
║  OBJECTIVE                           ║
║  Eat food and become longer.         ║
║                                      ║
║  SCORE                               ║
║  +10 for every food.                 ║
║                                      ║
║  WALLS                               ║
║  Walls wrap around.                  ║
║                                      ║
║  DANGER                              ║
║  Don't hit yourself.                 ║
║                                      ║
║  CONTROLS                            ║
║  WASD / ARROWS / TOUCH               ║
║                                      ║
║  GAME OVER                           ║
║  Your snake hits itself.             ║
║                                      ║
╚══════════════════════════════════════╝
```

---

# 🎮 QUICK REFERENCE

| Action | Desktop           | Mobile |
| ------ | ----------------- | ------ |
| Up     | `W` / `↑`         | ▲      |
| Down   | `S` / `↓`         | ▼      |
| Left   | `A` / `←`         | ◀      |
| Right  | `D` / `→`         | ▶      |
| Start  | `Enter` / `Space` | ●      |

---



# 📜 LICENSE

This project is offered as a gaming and personal learning opportunity.  Recalling the nostalgic childhood memories.😍


---

```text
╔══════════════════════════════════════════╗
║                                          ║
║              GAME OVER?                  ║
║                                          ║
║             PRESS START                 ║
║                                          ║
║              ▓▓▓▓▓▓▓▓                    ║
║              ▓ SNAKE ▓                   ║
║              ▓▓▓▓▓▓▓▓                    ║
║                                          ║
╚══════════════════════════════════════════╝
```

**Have fun. Keep eating. Don't hit yourself. 🐍**
