import React, { ChangeEvent, useState } from 'react';
import User from '../../interfaces/User';
import Popup from '../Popup';
import Rating from '@material-ui/lab/Rating';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import axios from '../../Axios'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import PropTypes from 'prop-types';
import config from '../../Config';


interface Props {
    user: User;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-height:80px;
`;


const customIcons: any = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props: any) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};
const PlayerRatingForm = ({ user, openPopup, setOpenPopup }: Props) => {
    const [rating, setRating] = useState<number | null>();
    const currUser = localStorage.getItem('userID')


    const onChangeRating = (event: ChangeEvent<unknown>, value: number | null) => {
        const currentVal: number | null = value
        setRating(currentVal);
    };

    const onSendRating = () => {
        console.log({
            toUserId: user.userId,
            fromUserId: currUser,
            rating: rating
        })
        const url = `/user/${user.userId}/rating`
        axios.post(url, {
            toUserId: user.userId,
            fromUserId: currUser,
            rating: rating
        }, config).then((response => 
            console.log(response)
        )).catch(error => {
            if (error.response.data.error === `you've already rated that user`) {
                alert('Du har allerede gitt denne brukeren rating')
            }
        })
            setOpenPopup(false)
        }

    return (
        <Popup
            title={`${user.firstName} ${user.surname}`}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
        >
            <Container>
                <Rating
                    style={{
                        marginLeft: '17.5%'
                    }}
                    name="customized-icons"
                    defaultValue={5}
                    size="large"
                    onChange={onChangeRating}
                    getLabelText={(val: number) => customIcons[val].label}
                    IconContainerComponent={IconContainer}
                />
                <Button color="primary" onClick={onSendRating} style={{}}>Gi Rating</Button>
            </Container>
        </Popup>
    );
};

export default PlayerRatingForm;
