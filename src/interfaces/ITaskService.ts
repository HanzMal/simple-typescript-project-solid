import type { IPrioritizedTask } from "./IPrioritizedTask.js";
import type { ITask } from "./ITask.js";

export interface ITaskService {
    createTask(title: string, desc: string, urgency: number, importance: number): IPrioritizedTask;
    changeStatusTask(id: string): void
    getAllTask(): ITask[]
    deleteTask(id: string): boolean
    getSortedTasks(): IPrioritizedTask[]
}