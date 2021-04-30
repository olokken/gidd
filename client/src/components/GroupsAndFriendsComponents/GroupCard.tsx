import {
    Card,
    Typography,
    Grid,
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import Popup from '../Popup';
import Group from '../../interfaces/Group';

const CardInformation = styled.div`
    height: 100%;
    cursor: pointer;


    :hover {
        background-color: #ebebeb;
    }
`;

interface Props {
    group: Group;
    handleGroupClicked: (group: Group) => void;
    onClick?: () => void;
}

const GroupCard = ({ group, handleGroupClicked, onClick }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onCardClick = () => {
        if (onClick != undefined) {
            onClick();
        }
    };
    return (
        <div>
            <Card
                style={{ minWidth: '100px', maxWidth: '100%', margin: '5px' }}
                onClick={() => {
                    handleGroupClicked(group);
                    onCardClick();
                }}
            >
                <CardInformation>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item>
                            <Typography
                                gutterBottom
                                variant="subtitle2"
                                component="h3"
                                style={{
                                    fontSize: '20px'
                                }}
                            >
                                {group.groupName}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardInformation>
            </Card>
            <Popup
                title={group.groupName}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            </Popup>
        </div>
    );
};

export default GroupCard;
