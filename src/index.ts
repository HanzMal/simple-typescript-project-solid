import Database from 'better-sqlite3';

// Definisi status task dengan Enum
export enum TaskStatus {
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    CodeReview = "CODE_REVIEW"
}

// definisi jenis task
enum KindTask {
    Backend = "BACKEND",
    Frontend = "FRONTEND"
}

export interface ITask {
    id: string,
    title: string,
    desc: string,
    status: TaskStatus,
    createdAt: Date,
    kindTask: KindTask
}

type NIP = string | number
type Coordinates = [number, number]

interface Employee {
    nip: NIP,
    name: string,
    location: Coordinates
}

interface ITaskRepository<T extends ITask> {
    save(task: T): void
    findById(id: string): T | undefined
    findAll(): T[]
    delete(id: string): void
}

export interface IPrioritizedTask extends ITask {
    urgency: number;
    importance: number;
    priorityScore: number;
}

export class InMemoryTaskRepository<T extends ITask> implements ITaskRepository<T> {
    private tasks: T[] = []

    save(task: T): void {
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index > 0) {
            this.tasks[index] = task
        } else {
            this.tasks.push(task)
        }

    }

    findById(id: string): T | undefined {
        return this.tasks.find(t => t.id === id)
    }

    findAll(): T[] {
        return [...this.tasks]
    }

    delete(id: string): void {
        this.tasks = this.tasks.filter(t => t.id !== id)
    }

}

export class SQLiteTaskRepository implements ITaskRepository<IPrioritizedTask> {
    readonly db: Database.Database;

    constructor() {
        // Membuka database (otomatis membuat file jika belum ada)
        this.db = new Database('./task_manager.sqlite');
        this.init();
    }

    private init() {
        this.db.exec(`
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
        `);
    }

    save(task: IPrioritizedTask): void {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO tasks 
            (id, title, desc, status, urgency, importance, priorityScore, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            task.id,
            task.title,
            task.desc,
            task.status,
            task.urgency,
            task.importance,
            task.priorityScore,
            task.createdAt.toISOString()
        );
    }

    findAll(): IPrioritizedTask[] {
        const stmt = this.db.prepare(`SELECT * FROM tasks ORDER BY priorityScore DESC`);
        const rows = stmt.all() as any[];

        return rows.map(row => ({
            ...row,
            createdAt: new Date(row.createdAt)
        }));
    }

    findById(id: string): IPrioritizedTask | undefined {
        const stmt = this.db.prepare(`SELECT * FROM tasks WHERE id = ?`);
        const row = stmt.get(id) as any;

        if (!row) return undefined;

        return {
            ...row,
            createdAt: new Date(row.createdAt) // Mengubah string kembali ke objek Date
        };
    }

    delete(id: string): void {
        const stmt = this.db.prepare(`DELETE FROM tasks WHERE id = ?`);
        stmt.run(id);
    }
}

export class TaskService {
    // inject repository ke dalam service (dependency injection)
    constructor(private readonly taskRepository: ITaskRepository<IPrioritizedTask>) {}

    private calculatePriority(urgency: number, importance: number): number {
        const weightU = 0.7; // Urgency lebih diutamakan
        const weightI = 0.3;
        // Rumus: Skor = (U * 0.7) + (I * 0.3)
        return Number.parseFloat(((urgency * weightU) + (importance * weightI)).toFixed(2));
    }

    createTask(title: string, desc: string, urgency: number, importance: number):IPrioritizedTask {
        if (title.length < 1) {
            throw new Error("Title must more than 1 word");
        }

        const score = this.calculatePriority(urgency, importance);

        const newTask: IPrioritizedTask = {
            id: Math.random().toString(36).substring(2,9),
            title: title,
            desc: desc,
            status: TaskStatus.Todo,
            createdAt: new Date(),
            kindTask: KindTask.Frontend,
            urgency,
            importance,
            priorityScore: score
        }

        this.taskRepository.save(newTask)
        return newTask
    }

    inProgressTask(id: string) {
        const task = this.taskRepository.findById(id)
        if (!task) {
            throw new Error("Task not found 1");
        }
        task.status = TaskStatus.InProgress
        this.taskRepository.save(task)
    }

    codeReviewTask(id: string) {
        const task = this.taskRepository.findById(id)
        if (task?.status !== TaskStatus.InProgress) {
            throw new Error("Task not found 2");
        }
        task.status = TaskStatus.CodeReview
        this.taskRepository.save(task)
    }

    getAllTask(): ITask[] {
        return this.taskRepository.findAll()
    }

    deleteTask(id: string) {
        this.taskRepository.delete(id)
    }

    getSortedTasks(): IPrioritizedTask[] {
        return this.taskRepository.findAll().sort((a, b) => b.priorityScore - a.priorityScore);
    }

}

export class TaskFinder {
    // menggunakan Generic <K> yang merupakan key dari ITask
    // generic constraint extends keyof ambil nilai dari objek berdasarkan kunci valid
    static searchByProperty <K extends keyof ITask>(
        tasks: ITask[],
        property: K,
        value: ITask[K]
    ):ITask[]{
        return tasks.filter(task => task[property] === value)
    }
}

// Interface/kontrak untuk data Tugas
