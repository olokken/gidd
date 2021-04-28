import React, { ChangeEvent, useState } from 'react';
import User from '../../interfaces/User';
import Popup from '../Popup';
import Rating from '@material-ui/lab/Rating';
import { Button, TextField } from '@material-ui/core';
import styled from 'styled-components';

interface Props {
    user: User;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const Flex = styled.div`
    display: flex;
`;

const PlayerRatingForm = ({ user, openPopup, setOpenPopup }: Props) => {
    const [comment, setComment] = useState<string>();

    const onChangeComment = (event: ChangeEvent<HTMLInputElement>) => {
        const current: string = (event.target as HTMLInputElement).value;
        setComment(current);
    };

    return (
        <Popup
            title={`Rate brukeren ${user.firstName} ${user.surname} `}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
        >
            <Container>
                <Rating
                    style={{ marginBottom: '3rem' }}
                    name="size-large"
                    defaultValue={2}
                    size="large"
                />
                <TextField
                    label="Kommentar"
                    value={comment}
                    onChange={onChangeComment}
                    variant="outlined"
                    rows={4}
                    multiline
                />
                <Flex>
                    <Button color="primary">Gå tilbake</Button>
                    <Button color="primary">Rate brukeren</Button>
                </Flex>
            </Container>
        </Popup>
    );
};
