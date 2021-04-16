import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import Activities from '../../containers/Activities';

interface DefaultCenter {
    lat: number;
    lng: number;
}

const Map = withGoogleMap<{ defaultCenter: DefaultCenter }>((props) => (
    <GoogleMap defaultZoom={15} defaultCenter={props.defaultCenter}>
        {props.children}
    </GoogleMap>
));

const MapComponent = (props: any) => {
    const [defaultCenter, setDefaultCenter] = useState<DefaultCenter>({
        lat: 30,
        lng: 30,
    });

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
                }
            });
    };

    useEffect(getCoordinates, []);

    const WrappedMap = Map;
    return (
        <div style={{ width: '100vw', height: '90vh' }}>
            <WrappedMap
                defaultCenter={defaultCenter}
                containerElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
            >
                {props.children}
            </WrappedMap>
        </div>
    );
};

export default MapComponent;
