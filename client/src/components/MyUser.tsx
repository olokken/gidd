import { runInThisContext } from 'node:vm';
import React, { ChangeEvent, useState, useContext, useEffect } from 'react';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import '../styles/MyUser.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { UserContext } from './UserContext';
import { MailRounded } from '@material-ui/icons';
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
    const [name, setName] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    //const [phone, setPhone] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [showEditPass, setShowEditPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const checkInput = (input: string): boolean => {
        if (input.length > 0 && input.charAt(0) !== ' ') {
            return true;
        } else {
            return false;
        }
    };
    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setName(input);
    };

    const onClickChangeName = (): boolean => {
        if (checkInput(name)) {
            setUser({ ...user, name: name });
            //TODO: axios.post current user.
            return true;
        } else {
            console.log('Could not change password');
            return false;
        }
    };

    const onChangeMail = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setMail(input);
    };

    const onClickChangeMail = (): boolean => {
        if (checkInput(mail)) {
            console.log(user);
            setUser({ ...user, email: mail });
            console.log(user);
            ('');
            return true;
        } else {
            return false;
        }
    };

    /*
    const onChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPhone(input);
    };

    const onClickChangePhone = (): boolean => {
        if (checkInput(phone)) {
            setPhone({ ...user, phone: phone });
            return true;
        } else {
            return false;
        }
    };
    */

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword1(input);
    };

    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword2(input);
    };
    const onClickChangePassword = (): boolean => {
        if (password1 === password2) {
            if (password1.length > 0 && password1.charAt(0) !== ' ') {
                setUser({ ...user, password: password1 });
                return true;
            }
        }
        return false;
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
            <Typography component="h2">Navn: {user.name}</Typography>
            <Typography component="h2">Email: {user.email}</Typography>
            {/*<Typography component="h2">Telefon: {user.phone}</Typography>*/}
            <Typography component="h2">Poeng: {user.poeng}</Typography>
            <Typography component="h2">Passord: {user.password}</Typography>
            <div>
                <TextField
                    label="Endre navn"
                    variant="outlined"
                    onChange={onChangeName}
                />
                <StyledButton onClick={onClickChangeName}>
                    Oppdater
                </StyledButton>
            </div>
            <div>
                <TextField
                    label="Endre mail"
                    variant="outlined"
                    onChange={onChangeMail}
                />
                <StyledButton onClick={onClickChangeMail}>
                    Oppdater
                </StyledButton>
            </div>
            {/*
            <div>
                <TextField
                    label="Endre telefon"
                    variant="outlined"
                    onChange={onChangePhone}
                />
                <StyledButton onClick={onClickChangePhone}>
                    Oppdater
                </StyledButton>
            </div>
            */}
            {/* TODO mulighet for å endre aktivitetsnivå*/}
            <div>
                <TextField
                    type={showEditPass ? 'text' : 'password'}
                    label="Endre passord"
                    variant="outlined"
                    onChange={onChangePassword1}
                />
                <VisibilityIcon
                    className="password-icon"
                    onClick={() => setShowEditPass(!showEditPass)}
                />
            </div>
            <div>
                <TextField
                    type={showConfirmPass ? 'text' : 'password'}
                    label="Bekreft passord"
                    variant="outlined"
                    onChange={onChangePassword2}
                />
                <VisibilityIcon
                    className="password-icon"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                />
                <div></div>
                <StyledButton onClick={onClickChangePassword}>
                    Oppdater
                </StyledButton>
            </div>
            <div>
                <StyledButton onClick={() => setOpenPopup(!openPopup)}>
                    Delete User
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
                        <StyledButton>No</StyledButton>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default MyUser;
