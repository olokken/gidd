import Equipment from "./Equipment";

export default interface ActivityResponse {
    activityId: number;
    activityLevel: string;
    capacity: number;
    daysToRepeat: number;
    description: string;
    equipments: Equipment[];
    groupId: number;
    image: any;
    latitude: number;
    longitude: number;
    registeredParticipants: any[];
    tags: string;
    time: number;
    timeCreated: number;
    title: string;
    user: any;
}
