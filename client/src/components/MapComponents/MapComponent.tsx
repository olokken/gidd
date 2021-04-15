import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
} from 'react-google-maps';

const Map = () => {
    return (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={{ lat: 63.430515, lng: 10.395053 }}
        />
    );
};

const WrappedMap: any = withScriptjs(withGoogleMap(Map));

const MapComponent = () => {
    return (
        <div style={{ width: '100vw', height: '90vh' }}>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDblcNJfu1TJ9sFX4TqcPBH2s3K4VtJ9eU&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ height: '100%' }} />}
            />
        </div>
    );
};

export default MapComponent;
