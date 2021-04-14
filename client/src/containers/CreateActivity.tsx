import { TextField, Button, withStyles } from '@material-ui/core';
import React, { useState, ChangeEvent } from 'react';
import '../styles/CreateActivity.css';
import axios from '../axios.jsx';

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
    equipmentList: Equipment[];
}

interface Equipment {
    id: number;
    description: string;
}

const url = '/activity';

const CreateActivity: React.FC = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [address, setAddress] = useState('');
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [equipmentDesc, setEquipmentDesc] = useState('');
    const [counter, setCounter] = useState<number>(0);

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

    const onChangeEqipmentDesc = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setEquipmentDesc((event.target as HTMLInputElement).value);
    };

    const addEquipment = (): boolean => {
        if (equipmentDesc.length > 0 && equipmentDesc.charAt(0) !== ' ') {
            const equipment: Equipment = {
                id: counter,
                description: equipmentDesc,
            };
            equipmentList.push(equipment);
            setCounter(counter + 1);
            setEquipmentDesc('');
            return true;
        } else {
            console.log('Could not add equipment. Not a valid description');
            setEquipmentDesc('');
            return false;
        }
    };

    const createActivity = () => {
        const activity: Activity = {
            title: title,
            desc: desc,
            date: date,
            address: address,
            equipmentList: equipmentList,
        };
        console.log(activity);
        setTitle('');
        setDesc('');
        setDate(new Date());
        setAddress('');
        setEquipmentList([]);

        axios.post(url, activity);
    };

    return (
        <div className="grid-container">
            <div className="header">
                <h1>Legg til aktivitet</h1>
            </div>
            <div className="first-col-item second-row-item">
                <h2>Tittel</h2>
                <TextField
                    value={title}
                    onChange={onChangeTitle}
                    variant="outlined"
                />
            </div>
            <div className="second-col-item second-row-item">
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
            <div className="first-col-item third-row-item ">
                <h2>Beskrivelse</h2>
                <TextField
                    className="desc-textfield"
                    value={desc}
                    onChange={onChangeDesc}
                    variant="outlined"
                    rows={4}
                    multiline
                />
            </div>
            <div className="second-col-item third-row-item">
                <h2>Address</h2>
                <TextField
                    value={address}
                    onChange={onChangeAddress}
                    variant="outlined"
                />
            </div>
            <div className="first-col-item fourth-row-item equipment">
                <h2>Utstyr</h2>
                <TextField
                    value={equipmentDesc}
                    variant="outlined"
                    onChange={onChangeEqipmentDesc}
                />
                <StyledButton onClick={addEquipment}>Legg Til</StyledButton>
            </div>
            <div className="second-col-item fourth-row-item">
                <h2>Liste</h2>
                <ul>
                    {equipmentList.map((equipment) => (
                        <li key={equipment.id}>{equipment.description}</li>
                    ))}
                </ul>
            </div>
            <div className="bottom-left">
                <StyledButton onClick={createActivity}>
                    Opprett Aktivitet
                </StyledButton>
            </div>
        </div>
    );
};

export default CreateActivity;
