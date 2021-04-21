import {
    TextField,
    Button,
    withStyles,
    MenuItem,
    Typography,
    Link,
    Tooltip,
} from '@material-ui/core';
import React, { useState, ChangeEvent, useContext } from 'react';
import { UserContext } from '../../UserContext';
import './ActivityForm.css';
import axios from '../../Axios';
import GeoSuggest from '../MapComponents/GeoSuggest';
import Popup from '../Popup';
import MapComponent from '../MapComponents/MapComponent';
import { Marker } from 'react-google-maps';
import { Activity2 } from '../../interfaces/Activity';
import Equipment from '../../interfaces/Equipment';
import Tag from '../../interfaces/Tag';
import Pagination from '@material-ui/lab/Pagination';
import DefaultCenter from '../../interfaces/DefaultCenter';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';

const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '15vw',
    },
    label: {
        textTransform: 'capitalize',
    },
})(Button);

const StyledTextField = withStyles({
    root: {
        width: '50vh',
    },
})(TextField);

const NumberTextField = withStyles({
    root: {
        width: '7vw',
        padding: '5px',
    },
})(TextField);

const ButtonsContainer = styled.div`
    display: flex;
    width: 34vw;
    padding: 10px;
`;
interface Props {
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO:
//Fix adding image
const ActivityForm = ({ openPopup, setOpenPopup }: Props) => {
    const [page, setPage] = useState<number>(1);
    const { user, setUser } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [dateDisplay, setDateDisplay] = useState<string>('');
    const [location, setLocation] = useState<DefaultCenter>({
        lat: 50,
        lng: 50,
    });
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [equipmentDesc, setEquipmentDesc] = useState('');
    const [counterAct, setCounterAct] = useState<number>(0);
    const [counterTag, setCounterTag] = useState<number>(0);
    const [reset, setReset] = useState<boolean>(false);
    const [openShowMap, setOpenShowMap] = useState<boolean>(false);
    const [tagList, setTagList] = useState<Tag[]>([]);
    const [tagsDesc, setTagsDesc] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [capacity, setCapacity] = useState<number>(0);
    const [repetition, setRepetition] = useState<number>(0);
    const [image, setImage] = useState<string>('');
    const [activity, setActivity] = useState<Activity2>({
        title: '',
        time: '',
        repeat: 0,
        userId: user,
        capacity: 0,
        groupId: 0,
        description: '',
        image: '',
        activityLevel: '',
        equipmentList: '',
        tags: '',
        latitude: 0,
        longitude: 0,
    });

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const checkInput = (input: string) => {
        if (input.length > 0 && input.charAt(0) !== ' ') return true;
        else return false;
    };

    const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle((event.target as HTMLInputElement).value);
    };

    const onChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
        setDesc((event.target as HTMLInputElement).value);
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

    const onChangeTagsDesc = (event: ChangeEvent<HTMLInputElement>) => {
        const str: string = (event.target as HTMLInputElement).value;
        setTagsDesc(str);
    };

    const onChangeActivityLevel = (event: ChangeEvent<HTMLInputElement>) => {
        const str: string = (event.target as HTMLInputElement).value;
        setActivityLevel(str);
    };

    const onChangeCapacity = (event: ChangeEvent<HTMLInputElement>) => {
        const str: string = (event.target as HTMLInputElement).value;
        try {
            setCapacity(+str < 0 ? 0 : +str);
        } catch (error) {
            alert('Skriv inn et tall');
            console.log('Could not convert string to number: ' + error.message);
        }
    };

    const onChangeRepetitions = (event: ChangeEvent<HTMLInputElement>) => {
        const str: string = (event.target as HTMLInputElement).value;
        try {
            setRepetition(+str < 0 ? 0 : +str);
        } catch (error) {
            alert('Skriv inn et tall');
            console.log('Could not convert string to number: ' + error.message);
        }
    };

    const onChangeImage = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        console.log(event);
        setImage(event.target.value);
        console.log(btoa(event.target.value));
    };

    const addEquipment = (event: React.KeyboardEvent): boolean => {
        if (event.key === 'Enter') {
            if (checkInput(equipmentDesc)) {
                const equipment: Equipment = {
                    equipmentId: counterAct,
                    description: equipmentDesc,
                };
                equipmentList.push(equipment);
                setCounterAct(counterAct + 1);
                setEquipmentDesc('');
                setReset(false);
                return true;
            } else {
                console.log('Could not add equipment. Not a valid description');
                setEquipmentDesc('');
            }
        }
        return false;
    };

    const deleteEquipment = (ID: number) => {
        setEquipmentList(
            equipmentList.filter((equip) => equip.equipmentId !== ID)
        );
    };

    const addTags = (event: React.KeyboardEvent) => {
        if (event.key == 'Enter') {
            if (checkInput(tagsDesc)) {
                const tags: string[] = tagsDesc.split(',');
                tags.map((tag) => {
                    tagList.push({ ID: counterTag, desc: tag });
                });
                setCounterTag(counterTag + 1);
                setTagsDesc('');
                setReset(false);
            }
        }
    };

    const deleteTag = (ID: number) => {
        setTagList(tagList.filter((tag) => tag.ID !== ID));
    };

    const isDisabled = (): boolean => {
        if (title === '' || date === new Date() || activityLevel === '') {
            return true;
        } else {
            return false;
        }
    };

    const postActivity = () => {
        let equipmentString = '';
        equipmentList.map(
            (equipment) => (equipmentString += equipment.description + ',')
        );
        let tagString = '';
        tagList.map((tag) => (tagString += tag.desc + ','));

        const escapedJSONDescription = JSON.stringify(desc)
            .replace(/\\n/g, '\\n')
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, '\\&')
            .replace(/\\r/g, '\\r')
            .replace(/\\t/g, '\\t')
            .replace(/\\b/g, '\\b')
            .replace(/\\f/g, '\\f');

        const activity: Activity2 = {
            title: title,
            time:
                date.getFullYear() +
                '-' +
                (+date.getMonth() + 1) +
                '-' +
                date.getDate() +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds(),
            repeat: repetition,
            userId: user,
            capacity: capacity,
            groupId: 0,
            description: escapedJSONDescription,
            image: '1111',
            activityLevel: activityLevel.toUpperCase(),
            equipmentList: equipmentString,
            tags: tagString,
            latitude: location.lat,
            longitude: location.lng,
        };

        console.log(activity);

        axios
            .post('/activity', activity)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .catch((error) =>
                console.log('Could not post activity: ' + error.message)
            );
        handleReset();
        setOpenPopup(!openPopup);
    };

    const handleReset = () => {
        setTitle('');
        setDesc('');
        setDate(new Date());
        setDateDisplay('');
        setEquipmentList([]);
        setEquipmentDesc('');
        setCounterAct(0);
        setCounterTag(0);
        setReset(true);
        setOpenShowMap(false);
        setTagList([]);
        setTagsDesc('');
        setActivityLevel('');
        setCapacity(0);
        setRepetition(0);
        setActivity({
            title: '',
            time: '',
            repeat: 0,
            userId: user,
            capacity: 0,
            groupId: 0,
            description: '',
            image: '',
            activityLevel: '',
            equipmentList: '',
            tags: '',
            latitude: 0,
            longitude: 0,
        });
    };

    return (
        <div className="activityform">
            {page === 1 && (
                <div>
                    <Typography
                        className="activityform__containerItem1"
                        component="h2"
                    >
                        Legg til tittel*
                    </Typography>
                    <StyledTextField
                        label="Tittel"
                        value={title}
                        onChange={onChangeTitle}
                        variant="outlined"
                    />
                </div>
            )}
            {page === 2 && (
                <div>
                    <Typography component="h2">Legg til plassering*</Typography>
                    <div className="activityform__place">
                        <div className="activityform__placeItem1">
                            <GeoSuggest
                                onLocationChange={(location) => {
                                    setLocation(location);
                                }}
                            ></GeoSuggest>
                        </div>
                        <StyledButton
                            className="activityform__placeButton"
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
                                defaultCenter={location}
                            >
                                <Marker position={location}></Marker>
                            </MapComponent>
                        </Popup>
                    </div>
                </div>
            )}
            {page === 3 && (
                <div>
                    <Typography
                        className="activityform__containerItem1"
                        component="h2"
                    >
                        Legg til dato
                    </Typography>
                    <StyledTextField
                        label="Dato"
                        type="datetime-local"
                        defaultValue={dateDisplay}
                        value={dateDisplay}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onChangeDate}
                        variant="outlined"
                    />
                </div>
            )}
            {page === 4 && (
                <div>
                    <Typography
                        className="activityform__containerItem1"
                        component="h2"
                    >
                        Legg til beskrivelse
                    </Typography>
                    <StyledTextField
                        className="activityform__description"
                        label="Beskrivelse"
                        value={desc}
                        onChange={onChangeDesc}
                        variant="outlined"
                        rows={4}
                        multiline
                    />
                </div>
            )}
            {page === 5 && (
                <div>
                    <Typography
                        className="activityform__containerItem1"
                        component="h2"
                    >
                        Legg til bilde
                    </Typography>
                    <StyledTextField
                        type="file"
                        label="Bilde"
                        onChange={onChangeImage}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                </div>
            )}
            {page === 6 && (
                <div>
                    <div className="activityform__header">
                        <Typography
                            className="activityform__headerItem1"
                            component="h2"
                        >
                            Legg til tags
                        </Typography>
                        <Tooltip
                            placement="right-start"
                            title="Press enter for å legge til. Trykk for å fjerne"
                        >
                            <InfoIcon />
                        </Tooltip>
                    </div>
                    <StyledTextField
                        label="Tags"
                        onChange={onChangeTagsDesc}
                        onKeyPress={addTags}
                        value={tagsDesc}
                        variant="outlined"
                    />
                    <ul className="activityform__list">
                        {reset === false &&
                            tagList.map((tag) => (
                                <li
                                    key={tag.ID}
                                    onClick={deleteTag.bind(this, tag.ID)}
                                >
                                    {tag.desc}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {page === 7 && (
                <div>
                    <div className="activityform__header">
                        <Typography
                            className="activityform__headerItem1"
                            component="h2"
                        >
                            Legg til utstyr
                        </Typography>
                        <Tooltip
                            placement="right-start"
                            title="Press enter for å legge til. Trykk for å fjerne"
                        >
                            <InfoIcon />
                        </Tooltip>
                    </div>
                    <StyledTextField
                        label="Utstyr"
                        value={equipmentDesc}
                        variant="outlined"
                        onChange={onChangeEqipmentDesc}
                        onKeyPress={addEquipment}
                    />
                    <ul className="activityform__list">
                        {reset === false &&
                            equipmentList.map((equipment) => (
                                <li
                                    key={equipment.equipmentId}
                                    onClick={deleteEquipment.bind(
                                        this,
                                        equipment.equipmentId
                                    )}
                                >
                                    {equipment.description}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {page === 8 && (
                <div>
                    <Typography className="activityform__containerItem1">
                        Legg til aktivitetsgrad*, plasser og gjentakninger
                    </Typography>
                    <div className="acitivityform__containerItem2">
                        <TextField
                            className="activityform__activityLevel"
                            label="Aktivitetgrad"
                            onChange={onChangeActivityLevel}
                            value={activityLevel}
                            variant="outlined"
                            select
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </TextField>
                        <NumberTextField
                            label="Plasser"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={capacity}
                            onChange={onChangeCapacity}
                            variant="outlined"
                        />
                        <NumberTextField
                            label="Gjentakinger"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={repetition}
                            onChange={onChangeRepetitions}
                        />
                    </div>
                    <ButtonsContainer>
                        <StyledButton
                            className="activityform__add"
                            onClick={postActivity}
                            disabled={isDisabled()}
                        >
                            Opprett Aktivitet
                        </StyledButton>
                        <StyledButton
                            className="activityform__reset"
                            onClick={handleReset}
                        >
                            Reset
                        </StyledButton>
                    </ButtonsContainer>
                </div>
            )}
            <div className="activityform__pageContainer">
                <Pagination onChange={onPageChange} count={8} size="large" />
            </div>
        </div>
    );
};

export default ActivityForm;
