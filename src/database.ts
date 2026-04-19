import DatabaseConstructor, { type Database } from 'better-sqlite3';

// Buka koneksi cukup SATU KALI di sini
const db: Database = new DatabaseConstructor('task_manager.sqlite');

// Pastikan pengaturan seperti WAL mode aktif untuk performa
db.pragma('journal_mode = WAL');

export default db;