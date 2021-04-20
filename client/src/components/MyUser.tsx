import React, { ChangeEvent, useState, useContext, useEffect } from 'react';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import './MyUser.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { UserContext } from '../UserContext';
import axios from '../Axios';
import { Link, useHistory } from 'react-router-dom';
import Popup from './Popup';
import { User2 } from '../interfaces/User';
import { Mail } from '@material-ui/icons';

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

//TODO:
//change the useEffect() so when a successfull put is sent to backend, the new information is rendered
//on the screen
const MyUser: React.FC = () => {
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
    const [userId, setUserId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [editPass, setEditPass] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showEditPass, setShowEditPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [noMatchPass, setNoMatchPass] = useState<boolean>(false);
    const [showEditUser, setShowEditUser] = useState<boolean>(false);

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

    const onChangeMail = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setEmail(input);
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

    //TODO post to axios in order to change user for each variable that is changed.
    const onClickUpdateUser = () => {
        const putUrl = `/user/${user}`;
        const sendUser: User2 = currentUser;

        if (checkInput(firstName)) {
            sendUser.firstName = firstName;
            setCurrentUser({ ...currentUser, firstName: firstName });
            setFirstName('');
        }
        if (checkInput(surname)) {
            sendUser.surname = surname;
            setCurrentUser({ ...currentUser, surname: surname });
            setSurname('');
        }
        if (checkInput(email) && email.indexOf('@') !== -1) {
            sendUser.email = email;
            setCurrentUser({ ...currentUser, email: email });
            setEmail('');
        }
        if (checkInput(phone)) {
            sendUser.phoneNumber = phone;
            setCurrentUser({ ...currentUser, phoneNumber: phone });
            setPhone('');
        }
        if (
            (checkInput(activityLevel) &&
                activityLevel.toUpperCase() === 'LOW') ||
            activityLevel.toUpperCase() === 'MEDIUM' ||
            activityLevel.toUpperCase() === 'HIGH'
        ) {
            sendUser.activityLevel = activityLevel.toUpperCase();
            setCurrentUser({
                ...currentUser,
                activityLevel: activityLevel.toUpperCase(),
            });
            setActivityLevel('');
        }
        // If the user has not changed the password, it is set to the current password. This is
        // becase the user needs to enter the password in order to change any of the information
        if (
            editPass === confirmPass &&
            checkInput(editPass) &&
            checkInput(confirmPass)
        ) {
            sendUser.password = editPass;
            setCurrentUser({ ...currentUser, password: editPass });
            setEditPass('');
            setConfirmPass('');
        } else if (checkInput(oldPassword)) {
            sendUser.password = oldPassword;
            setCurrentUser({ ...currentUser, password: oldPassword });
            setOldPassword('');
            setNoMatchPass(true);
        }
        axios
            .put(putUrl, sendUser)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => console.log(error.message));
    };

    const onClickDeleteUser = () => {
        axios
            .delete(`user/${user}`)
            .then((response) => {
                console.log(response);
                setCurrentUser(response.data);
                history.push('/');
            })
            .catch((error) => {
                console.log('Could not delete user: ' + error.message);
            });
    };

    useEffect(() => {
        async function fetchUser() {
            console.log(user);
            const request = await axios.get(`/user/${user}`);
            request.data['password'] = '';
            console.log(request);
            setCurrentUser(request.data);
            return request;
        }
        fetchUser();
    }, []);

    return (
        <div className="myuser">
            <div className="myuser__information">
                <Typography className="myuser__informationItem" component="h2">
                    Navn: {currentUser.firstName} {currentUser.surname}
                </Typography>
                <Typography className="myuser__informationItem" component="h2">
                    Email: {currentUser.email}
                </Typography>
            </div>
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
                ></TextField>
                <TextField
                    className="myuser__textfield"
                    label="Endre mail"
                    variant="outlined"
                    onChange={onChangeMail}
                    value={email}
                />
                <TextField
                    className="myuser__textfield"
                    label="Endre telefonnummer"
                    variant="outlined"
                    onChange={onChangePhone}
                    value={phone}
                />
                <TextField
                    className="myuser__textfield"
                    label="Endre aktivitetsnivå"
                    variant="outlined"
                    onChange={onChangeAcitivityLevel}
                    value={activityLevel}
                />
                <TextField
                    className="myuser__textfield"
                    type={showPassword ? 'text' : 'password'}
                    label="Gammelt passord*"
                    variant="outlined"
                    onChange={onChangePassword}
                />
                {showPassword ? (
                    <VisibilityIcon
                        className="passwordicon"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                    />
                ) : (
                    <VisibilityOffIcon
                        className="passwordicon"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                    />
                )}
                <TextField
                    className="myuser__textfield"
                    type={showEditPass ? 'text' : 'password'}
                    label="Endre passord"
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
                <div>
                    {noMatchPass && <h5>The passwords are not mathing!</h5>}
                </div>
            </div>
            {/* TODO mulighet for å endre aktivitetsnivå*/}
            <div className="myuser__buttons">
                <StyledButton
                    className="myuser__button"
                    onClick={onClickUpdateUser}
                >
                    Oppdater bruker
                </StyledButton>
                <StyledButton
                    className="myuser__button"
                    onClick={() => setOpenPopup(!openPopup)}
                >
                    Slett bruker
                </StyledButton>
                <Popup
                    title="Er du sikkert på at du vil slette brukeren?"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <div>
                        <StyledButton onClick={onClickDeleteUser}>
                            Yes
                        </StyledButton>
                        <StyledButton onClick={() => setOpenPopup(!openPopup)}>
                            No
                        </StyledButton>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default MyUser;
