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
}

export function ActivityList(): Activity[] {
    const akt1: Activity = {
        ID: 1,
        title: 'Tittel 1',
        time: '2021-04-15T13:12:00',
        owner: 'Ole',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kose oss og ae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim',
        level: 'Middels',
    };
    const akt2: Activity = {
        ID: 2,
        title: 'Tittel 2',
        time: '2000-10-22',
        owner: 'Mathias',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke kose oss',
        level: 'Høy',
    };
    const akt3: Activity = {
        ID: 3,
        title: 'Tittel 3',
        time: '2022-12-12',
        owner: 'Erling ',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kaste oss',
        level: 'Høy',
    };
    const akt4: Activity = {
        ID: 4,
        title: 'Tittel 4',
        time: '1978-12-24',
        owner: 'Lea',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke kaste oss',
        level: 'Lav',
    };
    const akt5: Activity = {
        ID: 5,
        title: 'Tittel 5',
        time: '2021-12-12',
        owner: 'Ingebrigt',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi prøve litt mer',
        level: 'Middels',
    };
    const akt6: Activity = {
        ID: 6,
        title: 'Tittel 6',
        time: '2020-12-12',
        owner: 'Håvard',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi ikke prøve litt mer',
        level: 'Høy',
    };
    const akt7: Activity = {
        ID: 7,
        title: 'Tittel 7',
        time: '2005-12-12',
        owner: 'Håvard',
        capacity: 10,
        maxCapacity: 20,
        description: 'Her skal vi kjede oss masse masse mye ',
        level: 'Høy',
    };

    return [akt1, akt2, akt3, akt4, akt5, akt6, akt7];
}
