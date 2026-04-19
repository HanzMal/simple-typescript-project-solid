import * as fs from 'node:fs';
import { join } from 'node:path';

export class Logger {
    readonly logPath: string;
    readonly username: string;

    constructor(username: string) {
        this.username = username;
        const dateStr = new Date().toISOString().split('T')[0];
        const logFileName = `${username}-${dateStr}.log`;

        // Menentukan folder logs di root project
        const logsDir = join(process.cwd(), 'logs');

        // Pastikan folder logs ada (sesuai permintaan senior)
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        this.logPath = join(logsDir, logFileName);
    }

    public write(action: string): void {
        const timestamp = new Date().toLocaleTimeString('id-ID');
        const entry = `[${timestamp}] ${this.username}: ${action}\n`;

        try {
            fs.appendFileSync(this.logPath, entry);
        } catch (error) {
            console.error("Gagal menulis log:", error);
        }
    }
}