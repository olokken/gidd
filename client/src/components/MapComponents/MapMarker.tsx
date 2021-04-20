import React, { useState } from 'react';
import Activity from '../../interfaces/Activity';
import { Marker } from 'react-google-maps';
import Popup from '../Popup';
import ActivityInformation from '../ActivityComponents/ActivityInformation';
import ActivityResponse from '../../interfaces/ActivityResponse';
import DefaultCenter from '../../interfaces/DefaultCenter';
interface Props {
    activity: ActivityResponse;
    position: DefaultCenter;
}

const MapMarker = ({ activity, position }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const markerOnClick = () => {
        setOpenPopup(!openPopup);
    };

    return (
        <>
            <Marker onClick={markerOnClick} position={position} />
            <Popup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                maxWidth="md"
            >
                <ActivityInformation activity={activity} />
            </Popup>
        </>
    );
};

export default MapMarker;
