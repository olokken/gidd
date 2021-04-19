import React, { useState } from 'react';
import Activity from '../../interfaces/Activity';
import { Marker } from 'react-google-maps';
import Popup from '../Popup';
import ActivityInformation from '../ActivityComponents/ActivityInformation';
import ActivityInformationPopup from '../ActivityComponents/ActivityInformationPopup';
interface Props {
    activity: Activity;
}

const MapMarker = ({ activity }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const markerOnClick = () => {
        setOpenPopup(!openPopup);
    };

    return (
        <>
            <Marker onClick={markerOnClick} position={{ lat: 0, lng: 0 }} />
            <ActivityInformationPopup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ActivityInformation activity={activity} />
            </ActivityInformationPopup>
        </>
    );
};

export default MapMarker;
