import { runInThisContext } from 'node:vm';
import React, { ChangeEvent, useState, useEffect } from 'react';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import { stringify } from 'node:querystring';
import '../styles/MyUser.css';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    user: IUser;
    openUser: boolean;
    setOpenUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyUser = ({ user, openUser, setOpenUser }: Props) => {
    const [currentUser, setCurrentUser] = useState<IUser>(user);
    const [username, setUsername] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [hidePass, setHidePass] = useState<string>('');

    const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setUsername(input);
    };

    const onClickChangeUsername = (): boolean => {
        if (username.length > 0 && username.charAt(0) !== ' ') {
            console.log(username);
            setCurrentUser({ ...currentUser, userName: username });
            //TODO: axios.post current user.
            return true;
        } else {
            console.log('Could not change password');
            return false;
        }
    };

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword1(input);
        //console.log(password1);
    };

    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        const input: string = (event.target as HTMLInputElement).value;
        setPassword2(input);
        //console.log(password2);
    };
    const onClickChangePassword = (): boolean => {
        if (password1 === password2) {
            if (password1.length > 0 && password1.charAt(0) !== ' ') {
                setCurrentUser({ ...currentUser, password: password1 });
                //console.log(currentUser.password);
                return true;
            }
        }
        return false;
    };

    const hidePassword = (pass: string) => {
        const arr = Array.from(pass);
        //const arr1 = pass.split('');
        //const arr2 = Object.assign([], pass);
        arr.map((a) => {
            console.log(a);
        });
    };

    return (
        <div>
            <Typography component="h2">
                Brukernavn: {currentUser.userName}
            </Typography>
            <Typography component="h2">Email: {currentUser.email}</Typography>
            <Typography component="h2">Telefon: {currentUser.phone}</Typography>
            <Typography component="h2">Poeng: {currentUser.poeng}</Typography>
            <Typography component="h2">
                Passord: {currentUser.password}
            </Typography>
            <div>
                <TextField
                    label="Bytt brukernavn"
                    variant="outlined"
                    onChange={onChangeUsername}
                />
                <StyledButton onClick={onClickChangeUsername}>
                    Oppdater
                </StyledButton>
            </div>
            <div>
                <TextField
                    type="password"
                    label="Bytt passord"
                    variant="outlined"
                    onChange={onChangePassword1}
                />
            </div>
            <div>
                <TextField
                    type="password"
                    label="Bekreft passord"
                    variant="outlined"
                    onChange={onChangePassword2}
                />
                <VisibilityIcon></VisibilityIcon>
                <StyledButton onClick={onClickChangePassword}>
                    Oppdater
                </StyledButton>
            </div>
        </div>
    );
};

export default MyUser;

export interface IUser {
    id: number;
    userName: string;
    password: string;
    email: string;
    poeng: number;
    phone: string;
}

/*
export class User implements IUser {
    id: number;
    userName: string;
    password: string;
    email: string;
    poeng: number;
    phone: string;

    constructor(iuser?: IUser) {
        if (iuser !== undefined) {
            this.id = iuser.id;
            this.userName = iuser.userName;
            this.password = iuser.password;
            this.email = iuser.email;
            this.poeng = iuser.poeng;
            this.phone = iuser.phone;
        } else {
            this.id = 0;
            this.userName = '';
            this.password = '';
            this.email = '';
            this.poeng = 0;
            this.phone = '';
        }
    }
    public set setUserName(userName: string) {
        this.userName = userName;
    }
    public set setPassword(password: string) {
        this.password = password;
    }
}
*/
