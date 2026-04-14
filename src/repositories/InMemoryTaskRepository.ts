import type { ITask } from "../interfaces/ITask.js"
import type { ITaskRepository } from "../interfaces/ITaskRepository.js"

export class InMemoryTaskRepository<T extends ITask> implements ITaskRepository<T> {
    private tasks: T[] = []

    save(task: T): void {
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index > 0) {
            this.tasks[index] = task
        } else {
            this.tasks.push(task)
        }

    }

    findById(id: string): T | undefined {
        return this.tasks.find(t => t.id === id)
    }

    findAll(): T[] {
        return [...this.tasks]
    }

    delete(id: string): boolean {
        const index = this.tasks.findIndex(t => t.id === id)
        if (index > 0) {
            this.tasks = this.tasks.filter(t => t.id !== id)
            return true
        } else {
            return false
        }
    }

}