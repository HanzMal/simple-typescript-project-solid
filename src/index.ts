import * as readline from 'node:readline/promises';
import { SQLiteTaskRepository } from './repositories/SQLiteTaskRepository.js';
import { TaskService } from './services/TaskService.js';
import { TaskController } from './controllers/TaskController.js';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

rl.on('SIGINT', () => {
    console.log("\n\n👋 Close CLI...");
    rl.close();
    process.exit(0);
});

try {
    await mainMenu();
} catch (error: any) {
    if (error.name === 'AbortError') {
        process.exit(0);
    }
    console.error("Terjadi kesalahan sistem:", error);
    process.exit(1);
}

async function mainMenu() {
    // Inisialisasi
    const repo = new SQLiteTaskRepository();
    const service = new TaskService(repo);
    const controller = new TaskController(service);

    while (true) {
        console.log("\n--- TASK MANAGER CLI ---");
        console.log("1. View All Task");
        console.log("2. Add Task");
        console.log("3. Update Status Task");
        console.log("4. Delete Task");
        console.log("5. Out");

        const choice = await rl.question("Pilih menu: ");
        console.log("Isi Choice: ", choice);
        console.log("Isi service: ", service);
        

        if (choice === '1') {
            await controller.showAllTasks();
        } else if (choice === '2') {
            const title = await rl.question("Judul: ");
            const desc = await rl.question("Desc: ");
            const u = await rl.question("Urgency (1-10): ");
            const i = await rl.question("Importance (1-10): ");
            await controller.createNewTask(title, desc, Number.parseInt(u), Number.parseInt(i));
        } else if (choice === '3') {
            await controller.showAllTasks();
            const index = await rl.question("Pilih ID: ");
            await controller.updateStatusTask(index)
        } else if (choice === '4') {
            await controller.showAllTasks();
            const index = await rl.question("Pilih ID yang akan dihapus: ");
            await controller.deleteTaskById(index)
        } else if (choice === '5') {
            break;
        } else {
            console.log("Pilih sesuai nomor yang ada")
        }
    }

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Ada promise yang error tapi tidak di-catch:', reason);
        // Di sini kita bisa log ke sistem monitoring (seperti Sentry)
    });

    process.on('uncaughtException', (error) => {
        console.error('Error fatal yang tidak tertangkap:', error);
        // Lakukan pembersihan (clean up) lalu restart app secara otomatis
    });
    rl.close();
}

