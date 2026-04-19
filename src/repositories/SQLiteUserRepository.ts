import db from '../database.js';
import Database from 'better-sqlite3';
import type { IUserRepository } from '../interfaces/IUserRepository.js';

export class SQLiteUserRepository implements IUserRepository {
     readonly db: Database.Database;

    constructor() {
        this.db = db
        this.initTable();
    }

    private initTable(): void {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        this.db.exec(query);
    }

    public findUser(username: string) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    }

    public createUser(username: string): void {
        const stmt = this.db.prepare('INSERT INTO users (username) VALUES (?)');
        stmt.run(username);
    }
}