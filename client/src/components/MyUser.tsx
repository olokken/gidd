import React, { ChangeEvent, useState, useContext, useEffect } from 'react';
import {
    TextField,
    Button,
    withStyles,
    Table,
    TableCell,
    TableRow,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem,
} from '@material-ui/core';
import './MyUser.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { UserContext } from '../UserContext';
import axios from '../Axios';
import { useHistory } from 'react-router-dom';
import Popup from './Popup';
import { User2 } from '../interfaces/User';

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

interface Props {
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

//TODO:
//change the useEffect() so when a successfull put is sent to backend, the new information is rendered
//on the screen
const MyUser: React.FC<Props> = ({ openPopup, setOpenPopup }: Props) => {
    const history = useHistory();
    const { user, setUser } = useContext(UserContext);
    const [currentUser, setCurrentUser] = useState<User2>({
        firstName: '',
        surname: '',
        userID: '',
        email: '',
        password: '',
        phoneNumber: '',
        activityLevel: '',
    });
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [oldMail, setOldMail] = useState<string>('');
    const [newMail, setNewMail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [editPass, setEditPass] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showEditPass, setShowEditPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [noMatchPass, setNoMatchPass] = useState<boolean>(false);
    const activityLevels: string[] = ['Low', 'Medium', 'High'];

    const [popupTitle, setPopupTitle] = useState<string>('');
    const [showChangeName, setShowChangeName] = useState<boolean>(false);
    const [showChangeEmail, setShowChangeEmail] = useState<boolean>(false);
    const [showChangePhone, setShowChangePhone] = useState<boolean>(false);
    const [showChangeActLvl, setShowChangeActLvl] = useState<boolean>(false);
    const [showChangePass, setShowChangePass] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(false);
    const [showIsFirstTime, setShowIsFirstTime] = useState<boolean>(false);

    const checkInput = (input: string): boolean => {
        if (input.length > 0 && input.charAt(0) !== ' ') {
            return true;
        } else {
            return false;
        }
    };
    const onChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setFirstName(input);
    };

    const onChangeSurname = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setSurname(input);
    };

    const onChangeOldMail = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setOldMail(input);
    };
    const onChangeNewMail = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setNewMail(input);
    };
    const onChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPhone(input);
    };

    const onChangeAcitivityLevel = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setActivityLevel(input);
    };
    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setOldPassword(input);
    };

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        setNoMatchPass(false);
        const input: string = (event.target as HTMLInputElement).value;
        setEditPass(input);
    };

    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setNoMatchPass(false);
        const input: string = (event.target as HTMLInputElement).value;
        setConfirmPass(input);
    };

    const onClickChangeName = () => {
        const putUrl = `/user/${user}`;
        const sendUser: User2 = currentUser;
        if (checkInput(oldPassword) === false) {
            alert('Skriv inn gammelt passord for å endre brukeren');
            return;
        } else {
            sendUser.password = oldPassword;
        }
        if (checkInput(firstName)) {
            sendUser.firstName = firstName;
            axios
                .put(putUrl, sendUser)
                .then((response) => {
                    console.log(response);
                    setCurrentUser({ ...currentUser, firstName: firstName });
                })
                .catch((error) =>
                    console.log('Could not change firstname: ' + error.message)
                );
            setFirstName('');
            setShowChangeName(!showChangeName);
        }
        if (checkInput(surname)) {
            sendUser.surname = surname;
            console.log(sendUser);
            axios
                .put(putUrl, sendUser)
                .then((response) => {
                    console.log(response);
                    setCurrentUser({ ...currentUser, surname: surname });
                })
                .catch((error) =>
                    console.log('Could not change firstname: ' + error.message)
                );
            setSurname('');
            setShowChangeName(!showChangeName);
        }
    };

    const onClickChangeMail = () => {
        const usertest = localStorage.getItem('userId');
        const putUrl = `/user/${usertest}`;
        if (checkInput(oldPassword) === false) {
            alert('Skriv inn gammelt passord for å endre brukeren');
            return;
        }
        if (checkInput(oldMail) && oldMail === currentUser.email) {
            if (newMail.indexOf('@') !== -1 && newMail.indexOf('.') !== -1) {
                const sendUser = {
                    firstName: currentUser.firstName,
                    surname: currentUser.surname,
                    userID: user,
                    email: currentUser.email,
                    newEmail: newMail,
                    password: oldPassword,
                    phoneNumber: currentUser.phoneNumber,
                    activityLevel: currentUser.activityLevel,
                };
                console.log(sendUser);
                axios
                    .put(putUrl, sendUser)
                    .then((response) => {
                        console.log(response);
                        setCurrentUser({ ...currentUser, email: newMail });
                    })
                    .catch((error) =>
                        console.log('Could not change mail: ' + error.message)
                    );
                //setCurrentUser({ ...currentUser, email: newMail });
                setOldMail('');
                setNewMail('');
                setShowChangeEmail(!showChangeEmail);
            } else {
                alert('Vennligst ha med alfakrøll og minst et punktum');
            }
        } else {
            alert('Vennligst skriv inn gammel mail for å endre brukeren');
        }
    };

    const onClickChangePhone = () => {
        const putUrl = `/user/${user}`;
        const sendUser: User2 = currentUser;

        if (checkInput(oldPassword) === false) {
            alert('Skriv inn gammelt passord for å endre brukeren');
            return;
        } else {
            sendUser.password = oldPassword;
        }
        if (checkInput(phone)) {
            sendUser.phoneNumber = phone;
            axios
                .put(putUrl, sendUser)
                .then((response) => {
                    console.log(response);
                    setCurrentUser({ ...currentUser, phoneNumber: phone });
                })
                .catch((error) =>
                    console.log('Could not change mail: ' + error.message)
                );
            setPhone('');
            setShowChangePhone(!showChangePhone);
        }
    };

    const onClickChangeActLvl = () => {
        const putUrl = `/user/${user}`;
        const sendUser: User2 = currentUser;

        if (checkInput(oldPassword) === false) {
            alert('Skriv inn gammelt passord for å endre brukeren');
            return;
        } else {
            sendUser.password = oldPassword;
        }
        if (
            activityLevel.toUpperCase() === 'LOW' ||
            activityLevel.toUpperCase() === 'MEDIUM' ||
            activityLevel.toUpperCase() === 'HIGH'
        ) {
            sendUser.activityLevel = activityLevel.toUpperCase();
            axios
                .put(putUrl, sendUser)
                .then((response) => {
                    console.log(response);
                    setCurrentUser({
                        ...currentUser,
                        activityLevel: activityLevel,
                    });
                })
                .catch((error) =>
                    console.log(
                        'Could not change activitylevel: ' + error.message
                    )
                );
            setActivityLevel('');
            setShowChangeActLvl(!showChangeActLvl);
        }
    };

    const onClickUpdateUser = () => {
        const putUrl = `/user/some/${user}`;
        if (!checkInput(editPass) || !checkInput(confirmPass)) {
            alert('Feil input i passord')
        } else if (editPass != confirmPass) {
            alert('Ulike passord');
        } else {
            axios.put(putUrl, {
                phoneNumber: phone,
                email: currentUser.email,
                firstName: currentUser.firstName,
                surname: currentUser.surname,
                activityLevel: activityLevel.toUpperCase(),
                newPassword: confirmPass
            }).then(response => {
                console.log(response);
                setPhone(phone);
                setOldPassword(confirmPass);
                setActivityLevel(activityLevel);
                setIsFirstTimeLogin(!isFirstTimeLogin);
                setShowIsFirstTime(!showIsFirstTime)
            }).catch(error => {
                console.log(error.message)
            })
        }
    };
    const onClickChangePass = () => {
        const putUrl = `/user/${user}`;
        const sendUser: User2 = currentUser;

        if (checkInput(oldPassword) === false) {
            alert('Skriv inn gammelt passord for å endre brukeren');
            return;
        }
        // If the user has not changed the password, it is set to the current password. This is
        // becase the user needs to enter the password in order to change any of the information
        if (
            editPass === confirmPass &&
            checkInput(editPass) &&
            checkInput(confirmPass)
        ) {
            sendUser.password = editPass;
            axios.put(putUrl, sendUser).then((response) => {
                console.log(response);
                setCurrentUser({ ...currentUser, password: editPass });
            });
        } else {
            setNoMatchPass(true);
        }
        setOldPassword('');
        setEditPass('');
        setConfirmPass('');
    };

    const onClickDeleteUser = () => {
        console.log(user);
        axios
            .delete(`user/${user}`)
            .then((response) => {
                console.log(response);
                setCurrentUser(response.data);
                localStorage.clear();
                history.push('/');
            })
            .catch((error) => {
                console.log('Could not delete user: ' + error.message);
            });
    };

    const onChangeActivityLevel = (event: ChangeEvent<HTMLInputElement>) => {
        setActivityLevel((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        async function fetchUser() {
            console.log(user);
            const request = await axios.get(`/user/${user}`);
            request.data.phoneNumber = -1;
            console.log(typeof request.data.phoneNumber);
            if (request.data.phoneNumber === -1) {
                setIsFirstTimeLogin(!isFirstTimeLogin);
                setShowIsFirstTime(!showIsFirstTime);
            }
            request.data['password'] = '';
            console.log(request);
            setCurrentUser(request.data);
            return request;
        }
        fetchUser();
    }, []);

    return (
        <div>
            {isFirstTimeLogin ? (
                <div>
                    <div className="myuser__textfields">
                        <TextField
                            className="myuser__textfield"
                            label="Telefonnummer"
                            variant="outlined"
                            onChange={onChangePhone}
                            value={phone}
                        />
                        <TextField
                            className="myuser__textfield"
                            style={{
                                width: 'auto',
                            }}
                            select
                            color="secondary"
                            label="Select your activity level"
                            value={activityLevel}
                            onChange={onChangeActivityLevel}
                            variant="outlined"
                        >
                            {activityLevels.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            className="myuser__textfield"
                            type={showEditPass ? 'text' : 'password'}
                            label="Sett passord"
                            variant="outlined"
                            onChange={onChangePassword1}
                            value={editPass}
                        />
                        {showEditPass ? (
                            <VisibilityIcon
                                className="passwordicon"
                                onClick={() => {
                                    setShowEditPass(!showEditPass);
                                }}
                            />
                        ) : (
                            <VisibilityOffIcon
                                className="passwordicon"
                                onClick={() => {
                                    setShowEditPass(!showEditPass);
                                }}
                            />
                        )}
                        <TextField
                            className="myuser__textfield"
                            type={showConfirmPass ? 'text' : 'password'}
                            label="Bekreft passord"
                            variant="outlined"
                            onChange={onChangePassword2}
                            value={confirmPass}
                        />
                        {showConfirmPass ? (
                            <VisibilityIcon
                                className="passwordicon"
                                onClick={() => {
                                    setShowConfirmPass(!showConfirmPass);
                                }}
                            />
                        ) : (
                            <VisibilityOffIcon
                                className="passwordicon"
                                onClick={() => {
                                    setShowConfirmPass(!showConfirmPass);
                                }}
                            />
                        )}
                    </div>
                    <div className="myuser__buttons">
                        <StyledButton
                            className="myuser__button"
                            onClick={() => {
                                setIsFirstTimeLogin(!isFirstTimeLogin);
                                setShowIsFirstTime(!showIsFirstTime);
                            }}
                        >
                            Bekreft
                        </StyledButton>
                        <StyledButton
                            className="myuser__button"
                            onClick={() => {
                                //setOpenPopup(!openPopup);
                                setIsFirstTimeLogin(!isFirstTimeLogin);
                                setShowIsFirstTime(!showIsFirstTime);
                                setOpenPopup(!openPopup);
                            }}
                        >
                            Avbryt
                        </StyledButton>
                    </div>
                </div>
            ) : (
                <div className="myuser">
                                        <div>
                                            <Table>
                                                <TableRow>
                                                    <TableCell align="left">Navn</TableCell>
                                                    <TableCell align="center">
                                                        {currentUser.firstName}{' '}
                                                        {currentUser.surname}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => {
                                                                setPopupTitle('Endre navn');
                                                                setShowChangeName(!showChangeName);
                                                            }}
                                                        >
                                                            Rediger
                                    </Button>
                                                        <Popup
                                                            title={popupTitle}
                                                            openPopup={showChangeName}
                                                            setOpenPopup={setShowChangeName}
                                                        >
                                                            <div className="myuser__textfields">
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    label="Endre fornavn"
                                                                    variant="outlined"
                                                                    onChange={onChangeFirstName}
                                                                    value={firstName}
                                                                />
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    label="Endre etternavn"
                                                                    variant="outlined"
                                                                    onChange={onChangeSurname}
                                                                    value={surname}
                                                                />
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    label="Passord*"
                                                                    variant="outlined"
                                                                    onChange={onChangePassword}
                                                                />
                                                            </div>
                                                            <div className="myuser__buttons">
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={onClickChangeName}
                                                                >
                                                                    Bekreft
                                            </StyledButton>
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={() =>
                                                                        setShowChangeName(
                                                                            !showChangeName
                                                                        )
                                                                    }
                                                                >
                                                                    Avbryt
                                            </StyledButton>
                                                            </div>
                                                        </Popup>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="center">
                                                        {currentUser.email}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => {
                                                                setPopupTitle('Endre mail');
                                                                setShowChangeEmail(
                                                                    !showChangeEmail
                                                                );
                                                            }}
                                                        >
                                                            Rediger
                                    </Button>
                                                        <Popup
                                                            openPopup={showChangeEmail}
                                                            setOpenPopup={setShowChangeEmail}
                                                            title={popupTitle}
                                                        >
                                                            <TextField
                                                                className="myuser__textfield"
                                                                label="Gammel mail"
                                                                variant="outlined"
                                                                onChange={onChangeOldMail}
                                                                value={oldMail}
                                                            />
                                                            <TextField
                                                                className="myuser__textfield"
                                                                label="Ny mail"
                                                                variant="outlined"
                                                                onChange={onChangeNewMail}
                                                                value={newMail}
                                                            />
                                                            <TextField
                                                                className="myuser__textfield"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                label="Passord*"
                                                                variant="outlined"
                                                                onChange={onChangePassword}
                                                            />
                                                            <div className="myuser__buttons">
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={onClickChangeMail}
                                                                >
                                                                    Bekreft
                                            </StyledButton>
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={() => {
                                                                        setShowChangeEmail(
                                                                            !showChangeEmail
                                                                        );
                                                                    }}
                                                                >
                                                                    Avbryt
                                            </StyledButton>
                                                            </div>
                                                        </Popup>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Telefon</TableCell>
                                                    <TableCell align="center">
                                                        {currentUser.phoneNumber}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => {
                                                                setPopupTitle(
                                                                    'Endre telefonnummer'
                                                                );
                                                                setShowChangePhone(
                                                                    !showChangePhone
                                                                );
                                                            }}
                                                        >
                                                            Rediger
                                    </Button>
                                                        <Popup
                                                            title={popupTitle}
                                                            openPopup={showChangePhone}
                                                            setOpenPopup={setShowChangePhone}
                                                        >
                                                            <TextField
                                                                className="myuser__textfield"
                                                                label="Endre telefon"
                                                                variant="outlined"
                                                                onChange={onChangePhone}
                                                                value={phone}
                                                            />
                                                            <TextField
                                                                className="myuser__textfield"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                label="Passord*"
                                                                variant="outlined"
                                                                onChange={onChangePassword}
                                                            />
                                                            <div className="myuser__buttons">
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={onClickChangePhone}
                                                                >
                                                                    Bekreft
                                            </StyledButton>
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={() => {
                                                                        setShowChangePhone(
                                                                            !showChangePhone
                                                                        );
                                                                    }}
                                                                >
                                                                    Avbryt
                                            </StyledButton>
                                                            </div>
                                                        </Popup>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">
                                                        Aktivitetsnivå
                                </TableCell>
                                                    <TableCell align="center">
                                                        {currentUser.activityLevel}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => {
                                                                setPopupTitle(
                                                                    'Endre aktivitetsnivå'
                                                                );
                                                                setShowChangeActLvl(
                                                                    !showChangeActLvl
                                                                );
                                                            }}
                                                        >
                                                            Rediger
                                    </Button>
                                                        <Popup
                                                            title={popupTitle}
                                                            openPopup={showChangeActLvl}
                                                            setOpenPopup={setShowChangeActLvl}
                                                        >
                                                            <FormLabel component="label">
                                                                Aktivitetsnivå
                                        </FormLabel>
                                                            <RadioGroup>
                                                                <FormControlLabel
                                                                    control={<Radio />}
                                                                    label="Low"
                                                                    onClick={() =>
                                                                        setActivityLevel('LOW')
                                                                    }
                                                                    value="low"
                                                                />
                                                                <FormControlLabel
                                                                    control={<Radio />}
                                                                    label="Medium"
                                                                    onClick={() =>
                                                                        setActivityLevel('MEDIUM')
                                                                    }
                                                                    value="medium"
                                                                />
                                                                <FormControlLabel
                                                                    control={<Radio />}
                                                                    label="High"
                                                                    onClick={() =>
                                                                        setActivityLevel('HIGH')
                                                                    }
                                                                    value="high"
                                                                />
                                                            </RadioGroup>

                                                            <TextField
                                                                className="myuser__textfield"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                label="Passord*"
                                                                variant="outlined"
                                                                onChange={onChangePassword}
                                                            />
                                                            <div className="myuser__buttons">
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={onClickChangeActLvl}
                                                                >
                                                                    Bekreft
                                            </StyledButton>
                                                                <StyledButton
                                                                    className="myuser__button"
                                                                    onClick={() => {
                                                                        setShowChangeActLvl(
                                                                            !showChangeActLvl
                                                                        );
                                                                    }}
                                                                >
                                                                    Avbryt
                                            </StyledButton>
                                                            </div>
                                                        </Popup>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">Passord</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => {
                                                                setPopupTitle('Endre passord');
                                                                setShowChangePass(!showChangePass);
                                                            }}
                                                        >
                                                            Rediger
                                    </Button>
                                                        <Popup
                                                            openPopup={showChangePass}
                                                            setOpenPopup={setShowChangePass}
                                                            title={popupTitle}
                                                        >
                                                            <div>
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    type={
                                                                        showEditPass
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    label="Endre passord"
                                                                    variant="outlined"
                                                                    onChange={onChangePassword1}
                                                                    value={editPass}
                                                                />
                                                                {showEditPass ? (
                                                                    <VisibilityIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowEditPass(
                                                                                !showEditPass
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <VisibilityOffIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowEditPass(
                                                                                !showEditPass
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    type={
                                                                        showConfirmPass
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    label="Bekreft passord"
                                                                    variant="outlined"
                                                                    onChange={onChangePassword2}
                                                                    value={confirmPass}
                                                                />
                                                                {showConfirmPass ? (
                                                                    <VisibilityIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowConfirmPass(
                                                                                !showConfirmPass
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <VisibilityOffIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowConfirmPass(
                                                                                !showConfirmPass
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                                <TextField
                                                                    className="myuser__textfield"
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    label="Passord*"
                                                                    variant="outlined"
                                                                    onChange={onChangePassword}
                                                                />
                                                                {showPassword ? (
                                                                    <VisibilityIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowPassword(
                                                                                !showPassword
                                                                            );
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <VisibilityOffIcon
                                                                        className="passwordicon"
                                                                        onClick={() => {
                                                                            setShowPassword(
                                                                                !showPassword
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                                <div className="myuser__buttons">
                                                                    <StyledButton
                                                                        className="myuser__button"
                                                                        onClick={onClickChangePass}
                                                                    >
                                                                        Bekreft
                                                </StyledButton>
                                                                    <StyledButton
                                                                        className="myuser__button"
                                                                        onClick={() => {
                                                                            setShowChangePass(
                                                                                !showChangePass
                                                                            );
                                                                        }}
                                                                    >
                                                                        Avbryt
                                                </StyledButton>
                                                                </div>
                                                                <div>
                                                                    {noMatchPass && (
                                                                        <h5>
                                                                            Passordene er ulike!
                                                                        </h5>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </TableCell>
                                                </TableRow>
                                            </Table>
                                        </div>
                                        <div className="myuser__textfields"></div>
                                        <div className="myuser__buttons">
                                            <StyledButton
                                                className="myuser__deleteButton"
                                                onClick={() =>
                                                    setShowConfirmDelete(!showConfirmDelete)
                                                }
                                            >
                                                Slett bruker
                        </StyledButton>
                                            <Popup
                                                title="Er du sikker på at du vil slette brukeren?"
                                                openPopup={showConfirmDelete}
                                                setOpenPopup={setShowConfirmDelete}
                                            >
                                                <div className="myuser__buttons">
                                                    <StyledButton
                                                        className="myuser__button"
                                                        onClick={onClickDeleteUser}
                                                    >
                                                        Bekreft
                                </StyledButton>
                                                    <StyledButton
                                                        className="myuser__button"
                                                        onClick={() =>
                                                            setShowConfirmDelete(!showConfirmDelete)
                                                        }
                                                    >
                                                        Avbryt
                                </StyledButton>
                                                </div>
                                            </Popup>
                                        </div>
                                    </div>
            )}
        </div>
    );
};

export default MyUser;
