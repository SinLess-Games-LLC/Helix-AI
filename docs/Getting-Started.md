# Gettting Started

> [!IMPORTANT]
>
> This project makes use of VS Code development containers. If you are not using VS Code, you will need to install the necessary dependencies manually. Start at (before Cloning)[#before-cloning] for more information.

To get started with Helix AI, you will need to install the project and set up the necessary dependencies. There are a few steps to follow to get the project up and ready for development.

## Before Cloning

Required dependencies for this project if you make use of the dev-container include:

- [Docker](https://docs.docker.com/engine/install/) (with [Docker Compose](https://docs.docker.com/compose/install/)): Docker is a containerization platform that allows you to run applications in isolated environments. Docker Compose is a tool for defining and running multi-container Docker applications.
  - [Docker Desktop](https://www.docker.com/products/docker-desktop) is the easiest way to get started with Docker on Windows and macOS. It includes Docker Compose. Be aware that on windows you need to have [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) installed.
- [Visual Studio Code (VS Code)](https://code.visualstudio.com/download): VS code is a IDE that is used for this project. It has a lot of features that make development easier.

Required dependencies for this project if you are not using the dev-container include:

- [Docker](https://docs.docker.com/engine/install/) (with [Docker Compose](https://docs.docker.com/compose/install/)): Docker is a containerization platform that allows you to run applications in isolated environments. Docker Compose is a tool for defining and running multi-container Docker applications.
  - [Docker Desktop](https://www.docker.com/products/docker-desktop) is the easiest way to get started with Docker on Windows and macOS. It includes Docker Compose. Be aware that on windows you need to have [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) installed.
- [Node.js](https://nodejs.org/en/download/): Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It is used for the frontend of this project.
- [Golang](https://golang.org/doc/install): Go is an open-source programming language that makes it easy to build simple, reliable, and efficient software. It is used for the backend of this project.
- [Python 3.13](https://www.python.org/downloads/): Python is an interpreted, high-level, general-purpose programming language. It is used for the backend of this project.
- [direnv](https://direnv.net/): direnv is an environment switcher for the shell. It knows how to hook into bash, zsh, tcsh, fish shell and elvish to load or unload environment variables depending on the current directory.

## Cloning The Repositoy

To Clone the repository all you need to do is:

```bash
git clone https://github.com/SinLess-Games-LLC/Helix-Ai.git
```

## Setting Up The Project

To set up the project, you will need to run the following commands:

```bash
cd Helix-Ai
```

```bash
npm install
```

## Begining Development

to start the development all you need to do is run the following commands:

```bash
code .
```

Then open the dev container by clicking on the bottom left corner of the screen and selecting `Reopen in Container`. You need the remote containers extension for this to work.

If you are not using vscode, you can run the following commands:

```bash
cd docker && docker-compose up
```

This will start the development ecosystem for the project.
