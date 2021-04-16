import React, { useState } from 'react';
import Geosuggest, { Suggest } from 'react-geosuggest';
import Coordinates from '../../interfaces/DefaultCenter';
import './GeoSuggest.css';

const GeoSuggest = () => {
    const [coordinates, setCoordinates] = useState<Coordinates>({
        lat: 0,
        lng: 0,
    });

    const onSuggestSelect = (place: Suggest) => {
        if (place) {
            console.log(place.location.lat + ', ' + place.location.lng);
            setCoordinates({
                lat: place.location.lat,
                lng: place.location.lng,
            });
        }
    };

    return (
        <Geosuggest
            placeholder="Start typing!"
            initialValue="Trondheim"
            onSuggestSelect={onSuggestSelect}
            location={new google.maps.LatLng(53.558572, 9.9278215)}
            radius={20}
        />
    );
};

export default GeoSuggest;
