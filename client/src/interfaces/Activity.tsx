export default interface Activity {
    ID: number;
    title: string;
    time: Date;
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
}

export function ActivityList(): Activity[] {
    const akt1: Activity = {
        ID: 1,
        title: 'Tittel 1',
        time: new Date('2000-12-22'),
        owner: 'Ole',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kose oss',
        level: 'Middels',
    };
    const akt2: Activity = {
        ID: 2,
        title: 'Tittel 2',
        time: new Date('2000-10-22'),
        owner: 'Mathias',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke kose oss',
        level: 'Høy',
    };
    const akt3: Activity = {
        ID: 3,
        title: 'Tittel 3',
        time: new Date('2022-12-12'),
        owner: 'Erling ',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kaste oss',
        level: 'Høy',
    };
    const akt4: Activity = {
        ID: 4,
        title: 'Tittel 4',
        time: new Date('1978-12-24'),
        owner: 'Lea',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke kaste oss',
        level: 'Lav',
    };
    const akt5: Activity = {
        ID: 5,
        title: 'Tittel 5',
        time: new Date('2021-12-12'),
        owner: 'Ingebrigt',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi prøve litt mer',
        level: 'Middels',
    };
    const akt6: Activity = {
        ID: 6,
        title: 'Tittel 6',
        time: new Date('2020-12-12'),
        owner: 'Håvard',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke prøve litt mer',
        level: 'Høy',
    };
    const akt7: Activity = {
        ID: 7,
        title: 'Tittel 7',
        time: new Date('2005-12-12'),
        owner: 'Håvard',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kjede oss masse masse mye',
        level: 'Høy',
    };

    return [akt1, akt2, akt3, akt4, akt5, akt6, akt7];
}
