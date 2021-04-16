import React from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
/*interface Props {
    ID: number;
    title: string;
    time: Date;
    owner: string;
    capacity: number;
    maxCapacity: number;
    description: string;
    level: string;
}
{ ID, title, time, owner, capacity, maxCapacity,description, level }: Props*/

interface Props {
    activity: Activity;
}
const ActivityInformation = ({ activity }: Props) => {
    /*const participants = new String(capacity);
    const fullCapacity = new String(maxCapacity);
    const comparison = new String(participants + "/" + fullCapacity);
    const eventTime = new String(time);*/
    const InfoDiv = styled.div`
        background-color: pink;
    `;
    const ImageDiv = styled.div`
        background-color: blue;
        height: '700px';
    `;
    const MapDiv = styled.div`
        background-color: green;
    `;
    const WeatherDiv = styled.div`
        background-color: lightskyblue;
    `;
    return (
        <ImageDiv>
            <h1>{activity.title}</h1>
            <h1>{activity.description}</h1>
            <h2>hva skjer ole</h2>
            <h3>sadfdsf</h3>
        </ImageDiv>
    );
};

export default ActivityInformation;
