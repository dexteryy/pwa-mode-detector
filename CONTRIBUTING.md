# Contributing Guidelines

Thank you for considering contributing to the PWA Mode Detector project! This document will guide you through the contribution process and provide instructions for setting up your development environment.

## Table of Contents

- [How to Contribute](#how-to-contribute)
  - [Reporting Issues](#reporting-issues)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
  - [Requirements](#requirements)
  - [Setting Up Local Development](#setting-up-local-development)
  - [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
  - [Commit Message Convention](#commit-message-convention)
  - [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

English | [简体中文](./CONTRIBUTING.zh.md)

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion, please search the issue tracker first to ensure it hasn't already been reported.

When submitting an issue, please provide as much detail as possible:

- A clear and descriptive title
- Detailed steps to reproduce the bug
- Expected behavior vs. actual behavior
- Relevant screenshots or animated GIFs
- Your operating system and browser version
- Any other information that might help diagnose the issue

### Suggesting Enhancements

If you have an enhancement suggestion:

1. Create a new issue with a detailed description
2. Label it as an "enhancement"
3. Include potential implementation approaches or use cases if possible

### Code Contributions

If you'd like to contribute code directly, follow these steps:

1. Fork the repository to your GitHub account
2. Clone your fork locally
3. Create a new branch (don't work directly on `main`)
4. Make your changes
5. Commit your changes and push to your fork
6. Submit a Pull Request

## Development Setup

### Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- Modern browser (Chrome, Firefox, Edge, etc.)

### Setting Up Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5000` in your browser

### Project Structure

```
pwa-mode-detector/
├── client/              # Frontend code
│   ├── public/          # Static assets
│   │   ├── icons/       # PWA icons
│   │   ├── manifests/   # Manifest files for different display modes
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and common logic
│   │   ├── pages/       # Page components
├── server/              # Backend code
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
├── shared/              # Code shared between frontend and backend
│   ├── schema.ts        # Data models and validation
├── docs/                # Documentation
├── CONTRIBUTING.md      # Contributing guidelines
├── LICENSE              # License
├── README.md            # Project overview
```

## Coding Guidelines

### Commit Message Convention

Please follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes (not affecting code functionality)
- `refactor`: Code refactoring
- `perf`: Performance optimization
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(detection): add special detection logic for Android devices
```

### Code Style

To maintain code quality and consistency, please follow these standards:

- Ensure all TypeScript code has proper type definitions
- Follow React functional component and hooks best practices
- Use PascalCase for component names (e.g., `StatusCard.tsx`)
- Use kebab-case for utility function files (e.g., `query-client.ts`)
- Keep code concise and add necessary comments to explain complex logic
- Maintain consistent styling with Tailwind CSS class names
- Avoid direct DOM manipulation, prefer React's declarative approach

Before submitting your code, ensure that it:
- Has no compilation errors
- Works correctly across different browsers
- Adheres to the project's overall design style

## Pull Request Process

1. Ensure your PR description clearly explains the changes made and issues addressed
2. Link any relevant issues to your PR
3. Make sure the project builds and runs correctly with no obvious functional defects
4. Request a review from at least one maintainer
5. Address any issues raised during code review
6. Once approved, your PR will be merged

---

Thank you again for contributing to the PWA Mode Detector! If you have any questions, feel free to ask in the issue tracker or contact the maintainers.