import * as readline from 'node:readline/promises';
import { SQLiteTaskRepository } from './repositories/SQLiteTaskRepository.js';
import { TaskService } from './services/TaskService.js';
import { TaskController } from './controllers/TaskController.js';
import { stdin as input, stdout as output } from 'node:process';
import { SQLiteUserRepository } from './repositories/SQLiteUserRepository.js';
import { Logger } from './utils/Logger.js';

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

async function initializeUser(userRepo: SQLiteUserRepository) {
    let username = "";
    while (true) {
        const input = (await rl.question("Masukkan username Anda: ")).trim();
        if (/^[a-zA-Z]+$/.test(input) && input.length >= 5) {
            username = input;
            break;
        }
        console.log("❌ Error: Username minimal 5 huruf dan tanpa angka/simbol!");
    }

    const logger = new Logger(username);
    const user = userRepo.findUser(username);

    if (user) {
        console.log(`Selamat datang kembali, ${username}!`);
        logger.write("LOGIN: User lama masuk ke sistem.");
    } else {
        console.log(`Halo ${username}, mendaftarkan akun baru...`);
        userRepo.createUser(username);
        logger.write("REGISTER: User baru berhasil didaftarkan.");
    }
    return { username, logger };
}

async function displayAllMenu() {
    console.log("\n--- TASK MANAGER CLI ---");
    console.log("1. View All Task");
    console.log("2. Add Task");
    console.log("3. Update Status Task");
    console.log("4. Delete Task");
    console.log("5. Out");
}

async function handleNewTask(controller: TaskController, logger: Logger) {
    logger.write("ACTION: Membuka menu tambah task.");
    const title = await rl.question("Judul: ");
    const desc = await rl.question("Desc: ");
    let u = ""; // Deklarasi di luar agar bisa dipakai controller
    let i = "";
    while (true) {
        const inputU = await rl.question("Urgency (1-10): ");
        if (/^\d+$/.test(inputU)) {
            u = inputU
            break;
        } else {
            console.log("Urgency harus angka");
        }
    }

    while (true) {
        const inputI = await rl.question("Importance (1-10): ");
        if (/^\d+$/.test(inputI)) {
            i = inputI
            break;
        } else {
            console.log("Urgency harus angka");
        }
    }
    await controller.createNewTask(title, desc, Number.parseInt(u), Number.parseInt(i));
    logger.write(`SUCCESS: Menambahkan task baru "${title}".`);
}

async function mainMenu() {
    // Inisialisasi
    const repo = new SQLiteTaskRepository();
    const userRepo = new SQLiteUserRepository();
    const service = new TaskService(repo);
    const controller = new TaskController(service);

    console.log("\n--- TASK MANAGER CLI ---");
    
    const { username, logger } = await initializeUser(userRepo);
    
    while (true) {
        console.log(`Pilih menu ${username}`)
        console.log("1. View All Task\n2. Add Task\n3. Update Status\n4. Delete Task\n5. Out");
        const choice = await rl.question("Pilih menu: ");
        console.log("Isi Choice: ", choice);
        console.log("Isi service: ", service);
        

        if (choice === '1') {
            await controller.showAllTasks();
            logger.write("ACTION: Melihat semua daftar task.");
        } else if (choice === '2') {
           await handleNewTask(controller, logger)
        } else if (choice === '3') {
            logger.write("LOGOUT: User keluar dari aplikasi.");
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

