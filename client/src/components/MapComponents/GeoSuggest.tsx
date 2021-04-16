import React, { useState, useEffect } from 'react';
import Geosuggest, { Suggest } from 'react-geosuggest';
import DefaultCenter from '../../interfaces/DefaultCenter';
import './GeoSuggest.css';

interface Props {
    onLocationChange: (location: DefaultCenter) => void;
}

const GeoSuggest = ({ onLocationChange }: Props) => {
    const [defaultCenter, setDefaultCenter] = useState<DefaultCenter>();
    
    const onSuggestSelect = (place: Suggest) => {
        if (place) {
            console.log(place.location.lat + ', ' + place.location.lng);
            setDefaultCenter({
                lat: place.location.lat,
                lng: place.location.lng,
            });
        }
    };

    useEffect(() => {
        if (defaultCenter) {
            onLocationChange(defaultCenter);
        }
    }, [defaultCenter]);

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
