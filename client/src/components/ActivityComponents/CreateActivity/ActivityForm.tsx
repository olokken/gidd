import {
    TextField,
    Button,
    withStyles,
    Typography,
    MenuItem,
} from '@material-ui/core';
import React, { useState, ChangeEvent } from 'react';
import './styles.css';
import axios from '../../../Axios';
import MapIcon from '@material-ui/icons/Map';
import GeoSuggest from '../../MapComponents/GeoSuggest';
import Popup from '../../Popup';
import MapComponent from '../../MapComponents/MapComponent';
import { Marker } from 'react-google-maps';
import Tag from '../../../interfaces/Tag';
import { stringify } from 'node:querystring';

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

const ActivityForm = ({ openPopup, setOpenPopup }: Props) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [dateDisplay, setDateDisplay] = useState<string>('');
    const [address, setAddress] = useState('');
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [equipmentDesc, setEquipmentDesc] = useState('');
    const [counterAct, setCounterAct] = useState<number>(0);
    const [counterTag, setCounterTag] = useState<number>(0);
    const [reset, setReset] = useState<boolean>(false);
    const [openShowMap, setOpenShowMap] = useState<boolean>(false);
    const [tagsList, setTagsList] = useState<Tag[]>([]);
    const [tagsDesc, setTagsDesc] = useState<string>('');

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
            if (checkInput(equipmentDesc)) {
                const equipment: Equipment = {
                    id: counterAct,
                    description: equipmentDesc,
                };
                equipmentList.push(equipment);
                setCounterAct(counterAct + 1);
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

    const checkInput = (input: string) => {
        if (input.length > 0 && input.charAt(0) !== ' ') return true;
        else return false;
    };

    //TODO type in tags with commas between each tag. Split the string with commas and map through
    //all the commas and display them.
    const addTags = (event: React.KeyboardEvent) => {
        if (event.key == 'Enter') {
            if (checkInput(tagsDesc)) {
                const tags: string[] = tagsDesc.split(',');
                let i = 0;
                tags.map((tag) => {
                    tagsList.push({ ID: i, desc: tag });
                    i++;
                });
            }
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
        setCounterAct(0);
    };

    return (
        <div
            className="activityform"
            style={{ display: 'flex', justifyContent: 'center' }}
        >
            <div id="left">
                <div>
                    <TextField
                        style={{ padding: '5px' }}
                        className="textfield"
                        label="Tittel"
                        value={title}
                        onChange={onChangeTitle}
                        variant="outlined"
                    />
                </div>
                <div>
                    <div
                        style={{
                            position: 'relative',
                            //left: '16px',
                            //top: '8px',
                            display: 'flex',
                        }}
                    >
                        <GeoSuggest></GeoSuggest>
                        <StyledButton
                            style={{
                                height: '2rem',
                                width: '9rem',
                                marginTop: '1rem',
                                marginLeft: '3rem',
                            }}
                            onClick={() => setOpenShowMap(!openShowMap)}
                        >
                            Vis på kart
                        </StyledButton>
                        <Popup
                            openPopup={openShowMap}
                            setOpenPopup={setOpenShowMap}
                            maxWidth="lg"
                        >
                            <MapComponent
                                width="75vh"
                                height="75vh"
                                defaultCenter={{ lat: 50, lng: 50 }}
                            >
                                <Marker
                                    position={{ lat: 25, lng: 25 }}
                                ></Marker>
                            </MapComponent>
                        </Popup>
                    </div>
                </div>
                <div>
                    <TextField
                        style={{ padding: '5px' }}
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
                        style={{ padding: '5px' }}
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
                    style={{ padding: '5px' }}
                    type="file"
                    label="Bilde"
                    /*value={Picture}
                    onChange={onChangePicture}*/
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    className="textfield"
                />
            </div>
            <div id="middle">
                <TextField
                    style={{ padding: '5px' }}
                    label="Tags"
                    /*onChange={onChangeTags}
                    value={tags}*/
                    variant="outlined"
                    className="textfield"
                />
                <div style={{ paddingRight: '5px', paddingLeft: '5px' }}>
                    <h2>Tags</h2>
                    <ul
                        style={{
                            borderRadius: '5px',
                            border: 'solid lightgrey 1px',
                            width: 'auto',
                            height: '110px',
                            overflow: 'auto',
                        }}
                    >
                        {reset === false &&
                            equipmentList.map((equipment) => (
                                <li key={equipment.id}>
                                    {equipment.description}
                                </li>
                            ))}
                    </ul>
                </div>
                <div style={{ padding: '5px', display: 'flex' }}>
                    <div style={{ padding: '5px' }}>
                        <TextField
                            style={{ width: '110px' }}
                            id="select"
                            label="Aktivitetgrad"
                            /*onChange={onChangeActivityLevel}
                            value={ActivityLevel}*/
                            variant="outlined"
                            className="textfield"
                            select
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </TextField>
                    </div>
                    <TextField
                        style={{ padding: '5px', width: 'auto' }}
                        label="Plasser"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        /*value={address}*/
                        //onChange={onChangeCapacity}
                        variant="outlined"
                        className="textfield"
                    />

                    <TextField
                        style={{ padding: '5px', width: 'auto' }}
                        type="number"
                        label="Gjentakinger"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        /*value={address}*/
                        variant="outlined"
                        //onChange={onChangeRepeat}
                        className="textfield"
                    />
                </div>
            </div>
            <div id="right">
                <TextField
                    style={{ padding: '5px' }}
                    className="textfield"
                    label="Utstyr"
                    value={equipmentDesc}
                    variant="outlined"
                    onChange={onChangeEqipmentDesc}
                    onKeyPress={addEquipment}
                />
                <h2>Utstyrsliste</h2>
                <ul
                    style={{
                        borderRadius: '5px',
                        border: 'solid lightgrey 1px',
                        width: 'auto',
                        height: '110px',
                        overflow: 'auto',
                    }}
                >
                    {reset === false &&
                        equipmentList.map((equipment) => (
                            <li key={equipment.id}>{equipment.description}</li>
                        ))}
                </ul>
                <div className="buttons">
                    <StyledButton
                        style={{ marginRight: '4px' }}
                        className="button"
                        onClick={createActivity}
                    >
                        Opprett Aktivitet
                    </StyledButton>
                    <StyledButton
                        style={{ marginLeft: '4px' }}
                        className="button"
                        onClick={handleReset}
                    >
                        Reset
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm;
