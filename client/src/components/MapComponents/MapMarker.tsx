import React, { useState } from 'react';
import Activity from '../../interfaces/Activity';
import { Marker } from 'react-google-maps';
import Popup from '../Popup';
import ActivityInformation from '../ActivityComponents/ActivityInformation';
import ActivityResponse from '../../interfaces/ActivityResponse';
interface Props {
    activity: ActivityResponse;
}

const MapMarker = ({ activity }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const markerOnClick = () => {
        setOpenPopup(!openPopup);
    };

    return (
        <>
            <Marker onClick={markerOnClick} position={{ lat: 0, lng: 0 }} />
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <ActivityInformation activity={activity} />
            </Popup>
        </>
    );
};

export default MapMarker;
