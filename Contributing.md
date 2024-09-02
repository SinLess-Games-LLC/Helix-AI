# Contributing to Helix AI

Thank you for your interest in contributing to Helix AI! We appreciate your time and effort in helping us improve and grow. This document outlines the process for contributing to the project.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 22 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Nx](https://nx.dev/) (installed globally)
- [Python 3.12](https://www.python.org/) (if working on the AI components)
- [Poetry](https://python-poetry.org/) (for managing Python dependencies)

### Setting Up the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SinLess-Games-LLC/Helix-AI.git
   cd Helix-AI
   ```

2. **Install dependencies:**

   Use `npm` to install the dependencies:

   ```bash
   npm install
   ```

   If working on Python components, install dependencies using Poetry:

   ```bash
   nx run @nxlv/python:install
   ```

3. **Set up environment variables:**

   Copy `.env.example` to `.env` and update the environment variables as needed.

   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**

   For the frontend:

   ```bash
   nx run-many --target dev --all
   ```

## Branching and Workflow

### Branching

We use the following branching strategy:

- **master**: The production-ready branch. All code in this branch should be stable and ready for release.
- **develop**: The main development branch. All features and fixes should be merged here.
- **feature/your-feature-name**: Feature branches for new features or fixes. Name the branch according to the feature or issue being worked on.

### Committing Changes

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Pull Requests

1. **Create a pull request:**

   - Ensure your branch is up to date with `develop`.
   - Open a pull request with a clear title and description.
   - Link to any relevant issues.

2. **Code review:**

   - Your pull request will be reviewed by a maintainer.
   - Address any feedback or requested changes.

3. **Merging:**
   - Once approved, your PR will be merged into `develop`.
   - Ensure there are no conflicts before merging.

## Running Tests

To run tests, use the following commands:

- **Frontend:**

  ```bash
  nx test frontend
  ```

- **Backend:**

  ```bash
  nx test auth-server
  ```

- **AI Components:**

  ```bash
  poetry run pytest
  ```

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code. Please report any unacceptable behavior to the project maintainers.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Feel free to update the sections and add any additional information specific to your project's workflow and requirements.
