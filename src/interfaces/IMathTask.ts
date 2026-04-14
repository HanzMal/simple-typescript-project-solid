import type { ITask } from "./ITask.js";

export interface IMathTask extends ITask {
    urgency: number;
    importance: number;
    priorityScore: number;
}