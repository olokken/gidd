import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MapComponent from '../components/MapComponents/MapComponent';
import Activity from '../interfaces/Activity';
import { Marker } from 'react-google-maps';
import GeoSuggest from '../components/MapComponents/GeoSuggest';
import DefaultCenter from '../interfaces/DefaultCenter';
import { Button } from '@material-ui/core';

const Container = styled.div`
    justify-content: center;
`;

const Map = () => {
    const [activities, setActivities] = useState<Activity[]>();
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
                    setDefaultCenter({ lat: 50, lng: 50 });
                }
            });
    };

    useEffect(() => {
        getCoordinates();
    }, []);

    const renderMarkers = activities?.map((act, index) => {
        //Mappe alle aktiviteter fra lista med activities og sette en onCLick der
        //jeg får opp den Popopen Iben holder på med.
    });

    return (
        <Container>
            {defaultCenter && (
                <MapComponent
                    defaultCenter={defaultCenter}
                    width="100vh"
                    height="85vh"
                >
                    <Marker position={defaultCenter}></Marker>
                </MapComponent>
            )}
            <GeoSuggest
                onLocationChange={(location) => setDefaultCenter(location)}
            ></GeoSuggest>
        </Container>
    );
};

export default Map;
