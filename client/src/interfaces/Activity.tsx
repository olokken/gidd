import Equipment from './Equipment';
import Tag from './Tag';
export default interface Activity {
    ID: number;
    title: string;
    time: string;
    //repeat: number;
    //userID: number;
    owner: string;
    capacity: number;
    maxCapacity: number;
    //groupId: number;
    description: string;
    level: string;
    //latitude: number;
    //longitude: number;
    //picture: any;
    //address: string;
    //equipmentList: Equipment[];
    //tagList: Tag[];
}

export interface Activity2 {
    title: string;
    time: string;
    repeat: number;
    userId: string;
    capacity: number;
    groupId: number;
    description: string;
    image: string;
    activityLevel: string;
    equipmentList: string;
    tags: string;
    latitude: number;
    longitude: number;
}

