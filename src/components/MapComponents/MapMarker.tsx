import React, { useState } from 'react';
import { Marker } from 'react-google-maps';
import Popup from '../Popup';
import ActivityInformation from '../ActivityComponents/ActivityInformation';
import ActivityResponse from '../../interfaces/ActivityResponse';
import DefaultCenter from '../../interfaces/DefaultCenter';
interface Props {
    activity: ActivityResponse;
    position: DefaultCenter;
    deleteActivity: (id: number) => void;
    register: (id: number) => Promise<void>;
    unRegister: (id: number) => Promise<void>;
}

const MapMarker = ({
    activity,
    position,
    deleteActivity,
    register,
    unRegister,
}: Props) => {
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
                <ActivityInformation
                    register={register}
                    unRegister={unRegister}
                    deleteActivity={deleteActivity}
                    activity={activity}
                    setOpenPopup={setOpenPopup}
                    openPopup={openPopup}
                />
            </Popup>
        </>
    );
};

export default MapMarker;
