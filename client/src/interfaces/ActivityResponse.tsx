export default interface ActivityResponse {
    activityId: number;
    activityLevel: string;
    capacity: number;
    daysToRepeat: number;
    description: string;
    equipments: string[];
    groupId: number;
    image: any;
    latitude: number;
    longitude: number;
    registeredParticipants: any[];
    tags: string;
    time: number;
    timeCreated: number;
    title: string;
    userId: number;
}
