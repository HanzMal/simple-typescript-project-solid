import Database from "better-sqlite3";
import type { IPrioritizedTask } from '../interfaces/IPrioritizedTask.js';
import type { ITaskRepository } from "../interfaces/ITaskRepository.js";
import db from "../database.js";

export class SQLiteTaskRepository implements ITaskRepository<IPrioritizedTask> {
    readonly db: Database.Database;

    constructor() {
        // Membuka database (otomatis membuat file jika belum ada)
        this.db = db
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
            createdAt: new Date(row.createdAt)
        };
    }

    delete(id: string): boolean {
        const stmt = this.db.prepare(`DELETE FROM tasks WHERE id = ?`);
        const result = stmt.run(id);

        return result.changes > 0;
    }
}