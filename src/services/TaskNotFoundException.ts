export class TaskNotFoundException extends Error {
    constructor(message: string) {
        super(`${message}`);
        this.name = "TaskNotFoundException";
    }
}