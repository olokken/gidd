import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MapComponent from '../components/MapComponents/MapComponent';
import MapMarker from '../components/MapComponents/MapMarker';
import GeoSuggest from '../components/MapComponents/GeoSuggest';
import DefaultCenter from '../interfaces/DefaultCenter';
import axios from '../Axios';
import ActivityResponse from '../interfaces/ActivityResponse';
import { Button } from '@material-ui/core';
import { WorkRounded } from '@material-ui/icons';

const Container = styled.div`
    justify-content: center;
`;

const Map = () => {
    const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [defaultCenter, setDefaultCenter] = useState<DefaultCenter>();
    const [markers, setMarkers] = useState<React.ReactNode>();
    const [rendered, setRendered] = useState<boolean>(false);

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

    const deleteActivity = (id: number) => {
        console.log('no ska den egentlig slette :' + id);
        axios
            .delete(`/activity/${id}`)
            .then(loadActivities)
            .then(() => window.location.reload());
    };

    const loadActivities = () => {
        axios
            .get('/activity')
            .then((response) => {
                setActivities(response.data['activities']);
            })
            .then(() => setMarkers(renderMarkers))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getCoordinates();
    }, []);

    useEffect(() => {
        loadActivities();
    }, [markers]);

    const renderMarkers = (): React.ReactNode[] | undefined => {
        if (activities) {
            return activities.map((act: ActivityResponse, index: number) => {
                return (
                    <MapMarker
                        deleteActivity={(id) => deleteActivity(id)}
                        key={index}
                        activity={act}
                        position={{ lat: act.latitude, lng: act.longitude }}
                    ></MapMarker>
                );
            });
        }
    };

    return (
        <Container>
            <GeoSuggest
                onLocationChange={(location) => setDefaultCenter(location)}
            ></GeoSuggest>
            {defaultCenter && (
                <MapComponent
                    defaultCenter={defaultCenter}
                    width="100vw"
                    height="85vh"
                >
                    {markers}
                </MapComponent>
            )}
        </Container>
    );
};

export default Map;
