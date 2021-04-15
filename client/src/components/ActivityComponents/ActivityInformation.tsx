import React from 'react';
import Activity from '../../interfaces/Activity';
interface Props {
    ID: number;
    title: string;
    time: Date;
    owner: string;
    capacity: number;
    maxCapacity: number;
    description: string;
    level: string;
}
const ActivityInformation = ({ ID, title, time, owner, capacity, maxCapacity,description, level }: Props) => {
    const participants = new String(capacity);
    const fullCapacity = new String(maxCapacity);
    const comparison = new String(participants + "/" + fullCapacity);
    const eventTime = new String(time);
    return(
        <div>
            Hei og hopp jeg er så glad i dag!
        </div>
    )
}

export default ActivityInformation;