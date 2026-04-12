import { InMemoryTaskRepository, TaskFinder, TaskService, TaskStatus, type IPrioritizedTask, type ITask } from "./index.js";

// membuat tipe data baru dengan extends
interface IMathTask extends ITask {
    urgency: number;
    importance: number;
    priorityScore: number; // Kita buat wajib di sini
}

class TaskManager {
    // Contoh implementasi Applied Math: Weighted Scoring
    static calculateScore(task: Omit<IMathTask, 'priorityScore'>): IMathTask {
        const w1 = 0.7; // Bobot Urgency
        const w2 = 0.3; // Bobot Importance

        const score = (task.urgency * w1) + (task.importance * w2);

        return {
            ...task,
            priorityScore: score
        };
    }
}

// 1. Inisialisasi Repository
const myRepo = new InMemoryTaskRepository<IPrioritizedTask>();

// 2. Inisialisasi Service (Memasukkan Repository ke Service)
const myService = new TaskService(myRepo);

// 3. Membuat beberapa tugas
// try {
    const task1 = myService.createTask(
        "Belajar SOLID TypeScript",
        "Mempelajari 5 prinsip desain",
        8,
        10
    );
    const task2 = myService.createTask(
        "Review TypeScript",
        "Membaca ulang bab Interface",
        5,
        6
    );
    const task3 = myService.createTask(
        "Review TypeScript baru",
        "Membaca ulang bab Mapped Type",
        10,
        10
    );

    console.log("Daftar Tugas Awal:", myService.getAllTask());
    console.log("High Priority Task",myService.getSortedTasks());
    
    try {
        myService.inProgressTask(task1.id)
        console.log("Daftar Tugas:", myService.getAllTask());
    } catch (error) {
        console.error(error)
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
