import User from './User';
export default interface Group {
    groupId: number;
    groupName: string;
    owner: User;
    users: User[];
}
