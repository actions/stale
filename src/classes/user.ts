import {IUser} from '../interfaces/user';

class User implements IUser {
    type: string;
    login: string;
    
    constructor(user: IUser) {
        this.type = user.type;
        this.login = user.login;
    }
}