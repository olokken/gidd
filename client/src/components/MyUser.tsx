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
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
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
        setMail(input);
    };

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword1(input);
    };

    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword2(input);
    };

    /*
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
    */

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

    /*
    const onClickChangePassword = (): boolean => {
        if (password1 === password2) {
            if (password1.length > 0 && password1.charAt(0) !== ' ') {
                setUser({ ...user, password: password1 });
                return true;
            }
        }
        return false;
    };
   */

    const onClickUpdateUser = () => {
        let isUpdated: boolean = false;
        if (checkInput(firstName)) {
            setUser({ ...user, firstName: firstName });
        }
        if (checkInput(surname)) {
            setUser({ ...user, surname: surname });
        }
        if (checkInput(mail)) {
            setUser({ ...user, email: mail });
        }
        if (password1 === password2) {
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
                Navn: `${user.firstName} ${user.surname}`
            </Typography>
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
            </div>
            <div>
                <TextField
                    label="Endre mail"
                    variant="outlined"
                    onChange={onChangeMail}
                />
            </div>
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
                <StyledButton onClick={onClickUpdateUser}>
                    Oppdater bruker
                </StyledButton>
            </div>
            <div>
                <StyledButton onClick={() => setOpenPopup(!openPopup)}>
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
                        <StyledButton>No</StyledButton>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default MyUser;
