import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import MapComponent from '../components/MapComponents/MapComponent';
import Activity from '../interfaces/Activity';
import {Marker} from 'react-google-maps'; 
import GeoSuggest from '../components/MapComponents/GeoSuggest';


const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const Map = () => {
    const [activities, setActivities] = useState<Activity[]>(); 

    useEffect(() => {
        //Hente ut alle aktivitetene og setActivities

    }, [])

    const renderMarkers = activities?.map((act, index) => {
        //Mappe alle aktiviteter fra lista med activities og sette en onCLick der
        //jeg får opp den Popopen Iben holder på med. 
    });

    return (
        <Container>
            <MapComponent></MapComponent>
        </Container>
    );
};

export default Map;
