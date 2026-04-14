import type { KindTask, TaskStatus } from "../types.js";

export interface ITask {
    id: string,
    title: string,
    desc: string,
    status: TaskStatus,
    createdAt: Date,
    kindTask: KindTask
}