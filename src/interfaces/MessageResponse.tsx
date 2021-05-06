import User from './User';

export default interface MessageResponse {
    user: User;
    timestamp: number;
    message: string;
}
