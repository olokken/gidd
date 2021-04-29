import Button from '@material-ui/core/Button';
import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
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
    children?: React.ReactNode;
    width?: string;
    height?: string;
}
const MapComponent = ({ defaultCenter, children,  width, height }: Props) => {
    return (
        <div style={{ width: width, height: height }}>
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
