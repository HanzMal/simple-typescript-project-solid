import { TaskNotFoundException } from "../exception/TaskNotFoundException.js";
import type { IPrioritizedTask } from "../interfaces/IPrioritizedTask.js";
import type { ITask } from "../interfaces/ITask.js";
import type { ITaskRepository } from "../interfaces/ITaskRepository.js";
import type { ITaskService } from "../interfaces/ITaskService.js";
import { KindTask, TaskStatus } from "../types.js";

export class TaskService implements ITaskService {
    // inject repository ke dalam service (dependency injection)
    constructor(private readonly taskRepository: ITaskRepository<IPrioritizedTask>) { }

    private calculatePriority(urgency: number, importance: number): number {
        const weightU = 0.7;
        const weightI = 0.3;
        return Number.parseFloat(((urgency * weightU) + (importance * weightI)).toFixed(2));
    }

    createTask(title: string, desc: string, urgency: number, importance: number): IPrioritizedTask {
        if (title.length < 1) {
            throw new TaskNotFoundException("Title must more than 1 word");
        }

        const score = this.calculatePriority(urgency, importance);

        const randomNumber = Math.floor(Math.random() * 900) + 10;
        const customId = `${randomNumber}`;

        const newTask: IPrioritizedTask = {
            id: customId,
            title: title,
            desc: desc,
            status: TaskStatus.Todo,
            createdAt: new Date(),
            kindTask: KindTask.Frontend,
            urgency,
            importance,
            priorityScore: score
        }

        this.taskRepository.save(newTask)
        return newTask
    }

    changeStatusTask(id: string) {
        const task = this.taskRepository.findById(id)
        if (!task) {
            throw new TaskNotFoundException(`Task with ID ${id} is not found`);
        }
        if (task.status === TaskStatus.Todo) {
            task.status = TaskStatus.InProgress
        } else if (task.status === TaskStatus.InProgress) {
            task.status = TaskStatus.CodeReview
        }
        this.taskRepository.save(task)
        return task
    }

    getAllTask(): ITask[] {
        return this.taskRepository.findAll()
    }

    deleteTask(id: string): boolean {
        return this.taskRepository.delete(id)
    }

    getSortedTasks(): IPrioritizedTask[] {
        return this.taskRepository.findAll().sort((a, b) => b.priorityScore - a.priorityScore);
    }

}