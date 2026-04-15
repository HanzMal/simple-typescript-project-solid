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

## Choose Menu

### 1. View All Task

Menampilkan semua record data dalam table

### 2. Add Task

- Input judul
- Input Deskripsi
- Input Urgency dalam range (1-10)
- Input Importance dalam range (1-10)
- Input Importance dalam range (1-10)

### 3. Update Status Task

- Display all record data in table
- Input ID number. example with TASK-439, So please input just number 439

### 4. Delete Task

- Display all record data in table
- Input ID number from task you want to delete. example with TASK-439, So please input just number 439

### 5. Out

You can get out from the CLI Application

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
