import React, { ChangeEvent, useState, useContext, useEffect } from 'react';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import './MyUser.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { UserContext } from './UserContext';
import axios from '../Axios';
import { useHistory } from 'react-router-dom';
import Popup from './Popup';

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

const MyUser: React.FC = () => {
    const history = useHistory();
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [showEditPass, setShowEditPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [noMatchPass, setNoMatchPass] = useState<boolean>(false);

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

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        setNoMatchPass(false);
        const input: string = (event.target as HTMLInputElement).value;
        setPassword1(input);
    };

    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setNoMatchPass(false);
        const input: string = (event.target as HTMLInputElement).value;
        setPassword2(input);
    };

    //TODO post to axios in order to change user for each variable that is changed.
    const onClickUpdateUser = () => {
        if (checkInput(firstName)) {
            axios
                .put(`/user/${user.ID}`, {
                    firstName: user.firstName,
                })
                .then((response) => {
                    JSON.stringify(response);
                    //setUser({ ...user, firstName: response.result.data});
                })
                .catch((error) =>
                    console.log('Could not change username: ' + error.message)
                );
            setFirstName('');
        }
        if (checkInput(surname)) {
            setUser({ ...user, surname: surname });
            setSurname('');
        }
        if (checkInput(email)) {
            setUser({ ...user, email: email });
            setEmail('');
        }
        if (password1 === password2) {
            if (checkInput(password1)) {
                setUser({ ...user, password: password1 });
                setPassword1('');
                setPassword2('');
            }
        } else {
            setNoMatchPass(true);
        }
    };

    const onClickDeleteUser = (id: string) => {
        //axios#delete(url[, config])
        const url = `user/${id}`;
        axios
            .delete(url)
            .then((response) => {
                console.log(JSON.stringify(response));
                setUser(response.data);
                console.log(user);
                history.push('/');
            })
            .catch((error) => {
                console.log('Could not delete user: ' + error.message);
            });
    };

    return (
        <div>
            <Typography component="h2">
                Navn: {user.firstName} {user.surname}
            </Typography>
            <Typography component="h2">Email: {user.email}</Typography>
            <Typography component="h2">Poeng: {user.poeng}</Typography>
            <Typography component="h2">Passord: {user.password}</Typography>
            <div>
                <TextField
                    style={{ width: '22rem' }}
                    label="Endre fornavn"
                    variant="outlined"
                    onChange={onChangeFirstName}
                    value={firstName}
                />
            </div>
            <div>
                <TextField
                    style={{ width: '22rem' }}
                    label="Endre etternavn"
                    variant="outlined"
                    onChange={onChangeSurname}
                    value={surname}
                ></TextField>
            </div>
            <div>
                <TextField
                    style={{ width: '22rem' }}
                    label="Endre mail"
                    variant="outlined"
                    onChange={onChangeMail}
                    value={email}
                />
            </div>
            {/* TODO mulighet for å endre aktivitetsnivå*/}
            <div>
                <TextField
                    style={{ width: '22rem' }}
                    type={showEditPass ? 'text' : 'password'}
                    label="Endre passord"
                    variant="outlined"
                    onChange={onChangePassword1}
                    value={password1}
                />
                {showEditPass ? (
                    <VisibilityIcon
                        className="password-icon"
                        onClick={() => setShowEditPass(!showEditPass)}
                    />
                ) : (
                    <VisibilityOffIcon
                        className="password-icon"
                        onClick={() => setShowEditPass(!showEditPass)}
                    />
                )}
            </div>
            <div>
                <TextField
                    style={{ width: '22rem' }}
                    type={showConfirmPass ? 'text' : 'password'}
                    label="Bekreft passord"
                    variant="outlined"
                    onChange={onChangePassword2}
                    value={password2}
                />
                {showConfirmPass ? (
                    <VisibilityIcon
                        className="password-icon"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                    />
                ) : (
                    <VisibilityOffIcon
                        className="password-icon"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                    />
                )}
            </div>
            <div>{noMatchPass && <h5>The passwords are not mathing!</h5>}</div>
            <div style={{ display: 'flex' }}>
                <StyledButton
                    style={{ width: '11rem' }}
                    onClick={onClickUpdateUser}
                >
                    Oppdater bruker
                </StyledButton>
                <StyledButton
                    style={{ width: '11rem' }}
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
                        <StyledButton
                            onClick={() => onClickDeleteUser(user.ID)}
                        >
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
