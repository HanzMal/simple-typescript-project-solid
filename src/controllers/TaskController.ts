import type { TaskService } from "../services/TaskService.js";

export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    async showAllTasks() {
        const tasks = this.taskService.getSortedTasks();
        console.table(tasks.map(t => ({
            "Task ID": `TASK-${t.id}`,
            Title: t.title,
            Description: t.desc,
            UrgencyImportance: t.priorityScore,
            Status: t.status,
            Created: t.createdAt
        })));
    }

    async createNewTask(title: string, desc: string, u: number, i: number) {
        const task = this.taskService.createTask(title, desc, u, i);
        console.log(`✅ Task "${task.title}" berhasil dibuat!`);
    }
    
    async updateStatusTask(id: string) {
        try {
            const updatedTask = this.taskService.changeStatusTask(id)
            console.log(`Success: TASK-${updatedTask.id} has changed status to ${updatedTask.status}`)
        } catch (error) {
            console.log(error);
        }
    }

    async deleteTaskById(id: string) {
        const isDeleted = this.taskService.deleteTask(id)

        if (isDeleted) {
            console.log(`\x1b[32m✅ Berhasil: Task dengan ID ${id} telah dihapus dari database.\x1b[0m`);
        } else {
            console.log(`\x1b[31m❌ Gagal: Task dengan ID ${id} tidak ditemukan.\x1b[0m`);
        }
    }
}