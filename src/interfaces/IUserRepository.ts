export interface IUserRepository {
    findUser(username: string): any; // Kamu bisa ganti any dengan interface IUser nanti
    createUser(username: string): void;
}