import * as readline from 'node:readline/promises';
import { SQLiteTaskRepository } from './repositories/SQLiteTaskRepository.js';
import { TaskService } from './services/TaskService.js';
import { TaskController } from './controllers/TaskController.js';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

try {
    await mainMenu();
} catch (error) {
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
            const index = await rl.question("Pilih index: ");
            await controller.updateStatusTask(index)
        } else if (choice === '4') {
            await controller.showAllTasks();
            const index = await rl.question("Pilih index yang akan dihapus: ");
            await controller.deleteTaskById(index)
        } else if (choice === '5') {
            break;
        } else {
            console.log("Pilih sesuai nomor yang ada")
        }
    }
    rl.close();
}

