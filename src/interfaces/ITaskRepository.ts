import type { ITask } from "./ITask.js"

export interface ITaskRepository<T extends ITask> {
    save(task: T): void
    findById(id: string): T | undefined
    findAll(): T[]
    delete(id: string): boolean
}