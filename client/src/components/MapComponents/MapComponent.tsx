import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import Activities from '../../containers/Activities';
import DefaultCenter from '../../interfaces/DefaultCenter';

interface Props {
    defaultCenter: DefaultCenter;
    onClick?: (e: google.maps.KmlMouseEvent) => void;
}

const Map = withGoogleMap<{ defaultCenter: DefaultCenter }>((props) => (
    <GoogleMap defaultZoom={15} center={props.defaultCenter}>
        {props.children}
    </GoogleMap>
));

interface Props {
    defaultCenter: DefaultCenter;
    children?: React.ReactChild;
}
const MapComponent = ({ defaultCenter, children }: Props) => {
    return (
        <div style={{ width: '100vw', height: '90vh' }}>
            <Map
                defaultCenter={defaultCenter}
                containerElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
            >
                {children}
            </Map>
        </div>
    );
};

export default MapComponent;
