// Definisi status task dengan Enum
export enum TaskStatus {
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    CodeReview = "CODE_REVIEW"
}

// definisi jenis task
enum KindTask {
    Backend = "BACKEND",
    Frontend = "FRONTEND"
}

interface ITask {
    id: string,
    title: string,
    desc: string,
    status: TaskStatus,
    createdAt: Date,
    kindTask: KindTask
}

type NIP = string | number
type Coordinates = [number, number]

interface Employee {
    nip: NIP,
    name: string,
    location: Coordinates
}

interface ITaskRepository {
    save(task: ITask): void
    findById(id: string): ITask | undefined
    findAll(): ITask[]
    delete(id: string): void
}

export class InMemoryTaskRepository implements ITaskRepository {
    private tasks: ITask[] = []

    save(task: ITask): void {
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
            this.tasks[index] = task
        } else {
            this.tasks.push(task)
        }

    }

    findById(id: string): ITask | undefined {
        return this.tasks.find(t => t.id === id)
    }

    findAll(): ITask[] {
        return [...this.tasks]
    }

    delete(id: string): void {
        this.tasks = this.tasks.filter(t => t.id !== id)
    }

}

export class TaskService {
    // inject repository ke dalam service (dependency injection)
    constructor(private taskRepository: ITaskRepository) {}

    createTask(title:string, desc: string):ITask {
        if (title.length < 1) {
            throw new Error("Title must more than 1 word");
        }

        const newTask: ITask = {
            id: Math.random().toString(36).substring(2,9),
            title: title,
            desc: desc,
            status: TaskStatus.Todo,
            createdAt: new Date(),
            kindTask: KindTask.Frontend
        }

        this.taskRepository.save(newTask)
        return newTask
    }

    inProgressTask(id: string) {
        const task = this.taskRepository.findById(id)
        if (!task) {
            throw new Error("Task not found 1");
        }
        task.status = TaskStatus.InProgress
        this.taskRepository.save(task)
    }

    codeReviewTask(id: string) {
        const task = this.taskRepository.findById(id)
        if (!task || task.status !== TaskStatus.InProgress) {
            throw new Error("Task not found 2");
        }
        task.status = TaskStatus.CodeReview
        this.taskRepository.save(task)
    }

    getAllTask(): ITask[] {
        return this.taskRepository.findAll()
    }

    deleteTask(id: string) {
        this.taskRepository.delete(id)
    }

}

export class TaskFinder {
    // menggunakan Generic <K> yang merupakan key dari ITask
    // generic constraint extends keyof ambil nilai dari objek berdasarkan kunci valid
    static searchByProperty <K extends keyof ITask>(
        tasks: ITask[],
        property: K,
        value: ITask[K]
    ):ITask[]{
        return tasks.filter(task => task[property] === value)
    }
}

// Interface/kontrak untuk data Tugas
