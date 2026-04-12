# Simple TypeScript Project - SOLID

A TypeScript task manager demonstrating SOLID principles with priority scoring, powered by SQLite for persistent storage.

## ✨ Features

- **Task Management** — Create, update, and delete tasks
- **Priority Scoring** — Tasks are scored based on urgency (70%) and importance (30%)
- **Status Workflow** — Move tasks through `TODO` → `IN_PROGRESS` → `CODE_REVIEW`
- **Persistent Storage** — Tasks saved to SQLite database
- **Type Safety** — Strict TypeScript with SOLID architecture

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js (v20.12.0+)
- **Database:** SQLite (via better-sqlite3)
- **Build Tool:** Make

## 🚀 Quick Start

### 1. Install Dependencies

```bash
make deps
```

### 2. Build the Project

```bash
make build
```

### 3. Run the Application

```bash
make start      # build + run
# or
make run        # run only (requires build first)
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
| `make dist-clean`   | Full clean (build artifacts + DB)  |

## 📖 How to Use

### Task Status Workflow

Tasks follow a three-stage workflow:

```text
TODO → IN_PROGRESS → CODE_REVIEW
```

#### Moving Tasks Between Statuses

The `TaskService` provides methods to progress tasks through the workflow:

```typescript
import { TaskService, SQLiteTaskRepository } from "./index.js";

// Initialize
const repo = new SQLiteTaskRepository();
const service = new TaskService(repo);

// Get all tasks
const tasks = service.getAllTask();
console.log(tasks);

// Move a task from TODO to IN_PROGRESS
service.inProgressTask("task-id-here");

// Move a task from IN_PROGRESS to CODE_REVIEW
service.codeReviewTask("task-id-here");
```

**Important:** Tasks must follow the workflow order:

- `inProgressTask(id)` — works on `TODO` tasks
- `codeReviewTask(id)` — only works on `IN_PROGRESS` tasks (throws error otherwise)

### Creating Tasks

```typescript
// createTask(title, description, urgency, importance)
const task = service.createTask(
    "Implement API endpoint",
    "Build REST endpoint for user data",
    8,   // urgency (1-10)
    10   // importance (1-10)
);
```

The priority score is calculated as: `(urgency × 0.7) + (importance × 0.3)`

### Finding Tasks

```typescript
import { TaskFinder, TaskStatus } from "./index.js";

// Find tasks by status
const inProgressTasks = TaskFinder.searchByProperty(
    service.getAllTask(),
    "status",
    TaskStatus.InProgress
);

// Find tasks by any property
const frontendTasks = TaskFinder.searchByProperty(
    service.getAllTask(),
    "kindTask",
    "FRONTEND"
);
```

### Deleting Tasks

```typescript
service.deleteTask("task-id-here");
```

## 🏗️ Architecture

This project demonstrates **SOLID principles**:

- **S** — Single Responsibility: `TaskService`, `TaskRepository`, `TaskFinder` each have one job
- **O** — Open/Closed: `ITaskRepository<T>` interface allows new repository implementations
- **L** — Liskov Substitution: `SQLiteTaskRepository` and `InMemoryTaskRepository` are interchangeable
- **I** — Interface Segregation: Clean, focused interfaces (`ITaskRepository`, `IPrioritizedTask`)
- **D** — Dependency Inversion: `TaskService` depends on abstractions, not concrete implementations

## 📁 Project Structure

```text
├── src/
│   ├── index.ts      # Core domain: Repository, Service, Interfaces
│   └── exe.ts        # Entry point with demo usage
├── dist/             # Compiled JavaScript (generated)
├── task_manager.sqlite # Database file (generated)
├── Makefile          # Build automation
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript configuration
```

## 🗄️ Database

Tasks are persisted in `task_manager.sqlite` with the following schema:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    desc TEXT,
    status TEXT,
    urgency INTEGER,
    importance INTEGER,
    priorityScore REAL,
    createdAt TEXT
)
```

To reset the database:

```bash
make db-reset
```

## 📝 License

ISC
