import { InMemoryTaskRepository, TaskFinder, TaskService, TaskStatus } from "./index.js";

// 1. Inisialisasi Repository
const myRepo = new InMemoryTaskRepository();

// 2. Inisialisasi Service (Memasukkan Repository ke Service)
const myService = new TaskService(myRepo);

// 3. Membuat beberapa tugas
// try {
    const task1 = myService.createTask(
        "Belajar SOLID TypeScript",
        "Mempelajari 5 prinsip desain"
    );
    const task2 = myService.createTask(
        "Review TypeScript",
        "Membaca ulang bab Interface"
    );

    console.log("Daftar Tugas Awal:", myService.getAllTask());
    
    try {
        myService.inProgressTask(task1.id)
        console.log("Daftar Tugas:", myService.getAllTask());
    } catch (error) {
        throw new Error("Gagal menemukan task");
    }

    // 4. Menyelesaikan satu tugas
    // myService.inProgressTask(task1.id);
    // console.log(
    //     "Tugas setelah ada yang selesai:",
    //     myService.getAllTask()
    // );

    // 5. Mencari tugas menggunakan Finder (Generics)
    const findTasks = TaskFinder.searchByProperty(
        myService.getAllTask(),
        "status",
        TaskStatus.InProgress
    );

    console.log("Hasil Pencarian (InProgress):", findTasks);

// } catch (error) {
//     if (error instanceof Error) {
//         console.error("Terjadi kesalahan:", error.message);
//     }
// }
