# Simple CLI Typescript for Task Management

This project is task management and has implemented SOLID Principle

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js (v20.12.0+)
- **Database:** SQLite (via better-sqlite3)
- **Environment:** Linux / WSL Ubuntu

## 🚀 How To Run

### 1. Install Dependencies

```bash
make deps
```

### 2. Compile file typescript

```bash
make build
```

### 3. Run Application

```bash
make run
```

## 📋 Available Commands

| Command             | Description                        |
| :------------------ | :--------------------------------- |
| `make help`         | Show all available commands        |
| `make deps`         | Install npm dependencies           |
| `make build`        | Compile TypeScript to JavaScript   |
| `make run`          | Run the compiled program           |
| `make start`        | Build and run in one command       |
| `make dev`          | Development mode with auto-reload  |
| `make clean`        | Remove build artifacts             |
| `make db-reset`     | Delete the database file           |

## 📁 Project Structure

```text
simple-typescript-project-solid/
├── dist/                 # Hasil compile (JS)
├── node_modules/         # Dependencies
├── src/
│   ├── interfaces/       # Kontrak (ITask, IRepository)
│   │   ├── ITask.ts
│   │   └── ITaskRepository.ts
│   ├── repositories/     # Akses Data (SQLite)
│   │   └── SQLiteTaskRepository.ts
│   ├── services/         # Logika Bisnis (Weighted Scoring)
│   │   └── TaskService.ts
│   ├── controllers/      # Pengatur Alur (Input/Output)
│   │   └── TaskController.ts
│   ├── index.ts          # Entry Point (Main Menu CLI)
│   └── types.ts          # Enums (TaskStatus)
├── Makefile              # Automasi Build & Run
├── package.json
├── tsconfig.json
└── task_manager.sqlite   # Database file
```