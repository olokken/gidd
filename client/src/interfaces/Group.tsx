import User from './User';
export default interface Group {
    owner: User;
    groupName: string;
    groupId: string;
    users: User[];
}
