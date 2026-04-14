import type { ITask } from "./ITask.js";

export interface IPrioritizedTask extends ITask {
    urgency: number;
    importance: number;
    priorityScore: number;
}