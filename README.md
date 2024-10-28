# Poker Range Manager

A Next.js-based web application for No Limit Hold'em poker players to create and manage hand ranges. The MVP focuses on RFI (Raise First In) situations from all positions in a 6-max format game, including Big Blind defense ranges.

## Features

### MVP Features

- 📊 Interactive hand range grid for RFI situations
- 🎨 Color-coded (customizable) actions:
  - Raise (red)
  - Call (light blue - for BB defense)
  - Fold (grey)
- 🎯 Position-based ranges:
  - Button (BTN)
  - Cut-off (CO)
  - Hijack (HJ)
  - Lojack (LJ)
  - Small Blind (SB)
  - Big Blind (BB)
- 💾 Local storage for saving ranges
- 🖥️ Desktop-first responsive design

### Future Features (Post-MVP)

- 🔐 User authentication
- ☁️ Cloud storage
- 📤 Import/Export functionality
- 👥 Range sharing capabilities
- 📝 Notes and annotations
- 📊 Advanced statistics
- 🔄 Undo/Redo functionality

## Tech Stack

- Frontend:
  - Next.js 15
  - React 19
  - Context API for state management
  - Tailwind CSS
  - Local Storage for data persistence

## Project Structure

```
src/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── Grid/
│   │   ├── Grid.jsx
│   │   ├── GridCell.jsx
│   │   └── gridUtils.js
│   ├── PositionSelector/
│   │   └── PositionSelector.jsx
│   ├── ColorPicker/
│   │   └── ColorPicker.jsx
│   └── RangeControls/
│       └── RangeControls.jsx
├── contexts/
│   └── RangeContext.jsx
├── constants/
│   ├── positions.js
│   ├── actions.js
│   └── colors.js
└── utils/
    ├── storage.js
    └── handUtils.js
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JohanPeraldi/poker-range-manager.git
```

2. Install dependencies:

```bash
cd poker-range-manager
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Development Guidelines

### Commit Message Guidelines

We follow the Conventional Commits specification for commit messages. Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (white-space, formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools
- `perf`: Performance improvements

#### Examples:

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

This project is currently in development. When contributing:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following our commit message guidelines
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by Johan Peraldi
