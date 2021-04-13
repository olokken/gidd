import { TextField, Button, withStyles } from '@material-ui/core';
import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import calenderPic from '../assets/calender.png';
import '../styles/CreateActivity.css';
import Calendar from 'react-calendar';
import axios from '../axios.jsx';

const StyledDiv = styled.div`
    margin-top: 100px;
    margin-left: 20px;
    padding: 20px;
`;

const StyledRow = styled.div`
    display: flex;
    margin: 20px;
`;

const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
        textTransform: 'capitalize',
    },
})(Button);

interface Activity {
    title: string;
    desc: string;
    date: Date;
    address: string;
    equipment: string[];
}

const url = '/activity';

const CreateActivity: React.FC = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [address, setAddress] = useState('');
    const [equipment, setEquipment] = useState([]);

    const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle((event.target as HTMLInputElement).value);
    };

    const onChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
        setDesc((event.target as HTMLInputElement).value);
    };

    const onChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress((event.target as HTMLInputElement).value);
    };

    const onChangeDate = (event: ChangeEvent<HTMLInputElement>): void => {
        const strDate: string = (event.target as HTMLInputElement).value;
        setDate(new Date(strDate));
        console.log(date);
    };

    const createActivity = () => {
        const activity: Activity = {
            title: title,
            desc: desc,
            date: date,
            address: address,
            equipment: equipment,
        };
        console.log(activity);
        setTitle('');
        setDesc('');
        setDate(new Date());
        setAddress('');
        setEquipment([]);

        axios.post(url, activity);
    };

    return (
        <div className="createactivity">
            <h1 className="header">Opprett Aktivitet</h1>
            <div className="createactivity__row">
                <h2 className="createactivity__row__item">Tittel</h2>
                <TextField
                    value={title}
                    onChange={onChangeTitle}
                    variant="outlined"
                />
            </div>
            <div className="createactivity__row">
                <h2 className="createactivity__row__item">Beskrivelse</h2>
                <TextField
                    value={desc}
                    onChange={onChangeDesc}
                    variant="outlined"
                />
            </div>
            <div className="createactivity__row">
                <h2 className="createactivity__row__item">Tidspunkt</h2>
                <TextField
                    label="Dato"
                    type="datetime-local"
                    defaultValue={new Date()}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={onChangeDate}
                    variant="outlined"
                />
            </div>
            <div className="createactivity__row">
                <h2 className="createactivity__row__item">Address</h2>
                <TextField
                    value={address}
                    onChange={onChangeAddress}
                    variant="outlined"
                />
            </div>
            <div className="createactivity__row">
                <h2 className="createactivity__row__item">Utstyr</h2>
                <TextField variant="outlined" />
                <StyledButton>Legg Til</StyledButton>
            </div>
            <StyledButton onClick={createActivity}>Opprett</StyledButton>
        </div>
    );
};

export default CreateActivity;
