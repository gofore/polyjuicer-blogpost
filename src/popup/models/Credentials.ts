import { IUser } from './User';

export interface ICredentials {
    customer: string;
    users: IUser[];
}
