# Poker Range Manager

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://www.rangerover.org.uk/)
[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=poker-range-manager)](https://www.rangerover.org.uk/)
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![React](https://img.shields.io/badge/React-19.0.0--rc-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0.1-black?logo=next.js&logoColor=white)](https://nextjs.org/)

A Next.js-based web application for No Limit Hold'em poker players to create and manage hand ranges. The MVP focuses on RFI (Raise First In) situations from all positions in a 6-max format game, including Big Blind defense ranges.

## Preview

<!-- Preview Images -->

![Button raise first in range](screenshots/poker-range-manager-app-desktop-view.png)
![App showing color customization options](screenshots/poker-range-manager-app-color-options-desktop-view.png)
![Big Blind defense range](screenshots/poker-range-manager-app-bb-range-desktop-view.png)
![Mobile responsive view](screenshots/poker-range-manager-app-mobile-view.png)

## Current Features

- 📊 Interactive hand range grid for RFI situations
- 🎨 Customizable action colors with:
  - Color picker for full customization
  - 6 preset colors per action for quick selection
  - Hex color input for precise control
  - Undo/Redo functionality for color changes
  - Persistent color preferences saved locally
  - Automatic text contrast adjustment for accessibility
- 🎯 Position-based ranges (BTN/CO/HJ/LJ/SB/BB)
- 🔄 Undo/Redo functionality
- 📋 Copy/Paste ranges between positions
- 📤 Import/Export ranges
- 💾 Local storage persistence for saving ranges and color preferences
- ⌨️ Keyboard shortcuts (Ctrl/Cmd + C/V/Z)
- 🖥️ Desktop-first responsive design with mobile support

## Future Features

- 📖 Displaying several ranges simultaneaously according to range type (all RFI ranges, etc.)
- 🎲 More complex range situations (facing RFI, 3-bet, etc.)
- 🤹‍♀️ Split ranges (several actions possible for one single hand)
- 📄 Copy pasting ranges in other file formats
- 🔒 Locking ranges to avoid accidental modification
- 🎨 Color theme custumisation
- 🔐 User authentication
- 🌧️ Cloud storage
- 👥 Range sharing capabilities
- 📝 Notes and annotations
- 📊 Advanced statistics

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS
- Context API

## Quick Start

```bash
git clone https://github.com/JohanPeraldi/poker-range-manager.git
cd poker-range-manager
npm install
npm run dev
```

## Project Structure

```plaintext
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── ActionSelector/
│   │   └── ActionSelector.jsx
│   ├── ColorPicker/
│   │   └── ColorPicker.jsx
│   ├── ControlPanel/
│   │   └── ControlPanel.jsx
│   ├── CopyPasteControls/
│   │   └── CopyPasteControls.jsx
│   ├── Grid/
│   │   └── Grid.jsx
│   ├── GridCell/
│   │   └── GridCell.jsx
│   ├── Message/
│   │   └── Message.jsx
│   ├── PositionSelector/
│   │   └── PositionSelector.jsx
│   ├── RangeControls/
│   │   └── RangeControls.jsx
│   └── ResetControls/
│       └── ResetControls.jsx
├── constants/
│   ├── actions.js
│   ├── colors.js
│   └── positions.js
├── contexts/
│   └── RangeContext.jsx
├── hooks/
│   └── useKeyboardShortcuts.js
├── utils/
├── colorUtils.js
├── handUtils.js
├── rangeUtils.js
└── storage.js
```

## Development Guidelines

### Commit Message Guidelines

We follow the Conventional Commits specification:

```plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding/fixing tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

#### Examples

```bash
# Adding new features
feat: implement hand range grid component
feat(grid): add hover effect on cells

# Fixing issues
fix: correct position selector dropdown alignment
fix(storage): resolve range saving issue

# Documentation changes
docs: update installation instructions
docs(readme): add contributing guidelines

# Code refactoring
refactor: simplify range calculation logic
refactor(grid): optimize cell rendering

# Style changes
style: format grid component code
style(css): adjust color scheme

# Testing
test: add unit tests for range utilities
test(grid): add integration tests for cell selection
```

### Branch Strategy

- `main`: Production-ready code
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`

Example branch naming:

```bash
feature/hand-range-grid
feature/position-selector
fix/grid-alignment
fix/local-storage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following our commit message guidelines
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by Johan Peraldi
