import { TextField, Button, withStyles, Typography } from '@material-ui/core';
import React, { useState, ChangeEvent } from 'react';
import '../styles/ActivityForm.css';
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

//TODO change the url
const url = '/activity';

interface Props {
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateActivity = ({ openPopup, setOpenPopup }: Props) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [dateDisplay, setDateDisplay] = useState<string>('');
    const [address, setAddress] = useState('');
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [equipmentDesc, setEquipmentDesc] = useState('');
    const [counter, setCounter] = useState<number>(0);
    const [reset, setReset] = useState<boolean>(false);

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
        setDateDisplay(strDate);
        setDate(new Date(strDate));
    };

    const onChangeEqipmentDesc = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setEquipmentDesc((event.target as HTMLInputElement).value);
    };

    const addEquipment = (event: React.KeyboardEvent): boolean => {
        if (event.key === 'Enter') {
            if (equipmentDesc.length > 0 && equipmentDesc.charAt(0) !== ' ') {
                const equipment: Equipment = {
                    id: counter,
                    description: equipmentDesc,
                };
                equipmentList.push(equipment);
                setCounter(counter + 1);
                setEquipmentDesc('\n');
                setReset(false);
                return true;
            } else {
                console.log('Could not add equipment. Not a valid description');
                setEquipmentDesc('');
            }
        }
        return false;
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

        handleReset();
        //TODO: Post this to backend.
        axios.post(url, activity);
        //.then
        setOpenPopup(!openPopup);
    };

    const handleReset = () => {
        setReset(true);
        setTitle('');
        setDesc('');
        setAddress('');
        setDate(new Date());
        setDateDisplay('');
        setEquipmentDesc('');
        setEquipmentList([]);
        setCounter(0);
    };

    return (
        <div className="activityform">
            <div>
                <TextField
                    className="textfield"
                    label="Tittel"
                    value={title}
                    onChange={onChangeTitle}
                    variant="outlined"
                />
            </div>
            <div>
                <TextField
                    label="Adresse"
                    value={address}
                    onChange={onChangeAddress}
                    variant="outlined"
                    className="textfield"
                />
            </div>
            <div>
                <TextField
                    label="Dato"
                    type="datetime-local"
                    defaultValue={dateDisplay}
                    value={dateDisplay}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={onChangeDate}
                    variant="outlined"
                    className="textfield"
                />
            </div>
            <div>
                <TextField
                    className="description"
                    label="Beskrivelse"
                    value={desc}
                    onChange={onChangeDesc}
                    variant="outlined"
                    rows={4}
                    multiline
                />
            </div>
            <TextField
                className="textfield"
                label="Utstyr"
                value={equipmentDesc}
                variant="outlined"
                onChange={onChangeEqipmentDesc}
                onKeyPress={addEquipment}
            />
            <h2>Utstyrsliste</h2>
            <ul>
                {reset === false &&
                    equipmentList.map((equipment) => (
                        <li key={equipment.id}>{equipment.description}</li>
                    ))}
            </ul>
            <div className="buttons">
                <StyledButton className="button" onClick={createActivity}>
                    Opprett Aktivitet
                </StyledButton>
                <StyledButton className="button" onClick={handleReset}>
                    Reset
                </StyledButton>
            </div>
        </div>
    );
};

export default CreateActivity;
