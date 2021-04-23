import User from './User';
export default interface Group {
    groupId: number;
    name: string;
    users: User[];
}
