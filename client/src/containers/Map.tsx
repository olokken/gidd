import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MapComponent from '../components/MapComponents/MapComponent';
import Activity, { ActivityList } from '../interfaces/Activity';
import MapMarker from '../components/MapComponents/MapMarker';
import GeoSuggest from '../components/MapComponents/GeoSuggest';
import DefaultCenter from '../interfaces/DefaultCenter';
import TagTextField from '../components/ActivityComponents/TagTextField';
import axios from 'axios';
import {Button} from '@material-ui/core'; 
import ActivityInformation from '../components/ActivityComponents/ActivityInformation';
import ActivityResponse from '../interfaces/ActivityResponse';
import { act } from '@testing-library/react';

const Container = styled.div`
    justify-content: center;
`;

const Map = () => {
    const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [defaultCenter, setDefaultCenter] = useState<DefaultCenter>();

    const getCoordinates = () => {
        fetch(
            'https://geolocation-db.com/json/ef6c41a0-9d3c-11eb-8f3b-e1f5536499e7'
        )
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    const latitude: number = data.latitude;
                    const longitude: number = data.longitude;
                    console.log(latitude + ', ' + longitude);
                    setDefaultCenter({ lat: latitude, lng: longitude });
                } else {
                    setDefaultCenter({ lat: 63, lng: 10 });
                }
            });
    };

    useEffect(() => {
        getCoordinates();

        axios
            .get('/activity')
            .then((response) => {
                console.log(response.data['activity']);
                setActivities(response.data['activity']);
            })
            .catch((error) => console.log(error));
    }, []);

    let markers;

    useEffect(() => {
        markers = activities.map((act: ActivityResponse, index: number) => {
            //Test med backend, kanskje den her må inni en useEffect hvor den kjører hver gang activities endrer seg :-)
            return <MapMarker key={index} activity={act}></MapMarker>;
        });
    }, [activities]);

    return (
        <Container>
            {defaultCenter && (
                <MapComponent
                    defaultCenter={defaultCenter}
                    width="100vw"
                    height="85vh"
                >
                    {markers}
                </MapComponent>
            )}
            <GeoSuggest
                onLocationChange={(location) => setDefaultCenter(location)}
            ></GeoSuggest>
            <Button onClick={() => {console.log(activities)}}>Jahahaha</Button>
        </Container>
    );
};

export default Map;
