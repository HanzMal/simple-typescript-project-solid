import type { ITask } from "../interfaces/ITask.js";

export class TaskFinder {
    // menggunakan Generic <K> yang merupakan key dari ITask
    // generic constraint extends keyof ambil nilai dari objek berdasarkan kunci valid
    static searchByProperty<K extends keyof ITask>(
        tasks: ITask[],
        property: K,
        value: ITask[K]
    ): ITask[] {
        return tasks.filter(task => task[property] === value)
    }
}