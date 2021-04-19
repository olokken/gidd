import { ContactSupportOutlined } from '@material-ui/icons';
import React, { ChangeEvent, useState } from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import NewUserCard from '../components/CardComponents/NewUserCard';
import { UserContext } from '../UserContext';
import axios from '../Axios';

const NewUsernContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #334d50; /* fallback for old browsers */
    background: -webkit-linear-gradient(
        to right,
        #cbcaa5,
        #334d50
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
        to right,
        #cbcaa5,
        #334d50
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const NewUser = () => {
    const history = useHistory();
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const equalPasswords: boolean = password1 === password2 ? true : false;
    const [emailList, setEmailList] = useState<string[]>([]);
    const correctEmailFormat = email.indexOf('@') > -1 ? true : false;
    const { user, setUser } = useContext(UserContext);

    const emailCheck = (email: string) => {
        if (emailList.indexOf(email) > -1) {
            return false;
        }
        return true;
    };

    const createUser = (
        firstName: string,
        surname: string,
        email: string,
        number: string,
        password: string
    ): boolean => {
        if (!emailCheck(email)) {
            alert('E-mail er allerede registrert');
            return false;
        } else if (!equalPasswords && password1 !== '') {
            alert('Passordene er ulike');
            return false;
        } else {
            axios
                .post('/user', {
                    email: email,
                    password: password,
                    firstName: firstName,
                    surname: surname,
                    phoneNumber: number,
                    activityLevel: activityLevel.toUpperCase(),
                })
                .then((response) => {
                    console.log(JSON.stringify(response.data.id));
                    //setUser(response.data.id)
                    setUser({ ...user, ID: response.data.id });
                    history.push('/Activites');
                })
                .catch((error) => {
                    // handle this error
                    console.log('error: ' + error.message);
                });
            return true;
        }
    };

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const currentEmail: string = (event.target as HTMLInputElement).value;
        setEmail(currentEmail);
    };

    const onChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName((event.target as HTMLInputElement).value);
    };

    const onChangeSurname = (event: ChangeEvent<HTMLInputElement>) => {
        setSurname((event.target as HTMLInputElement).value);
    };

    const onChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
        setNumber((event.target as HTMLInputElement).value);
    };

    const onChangeActivityLevel = (event: ChangeEvent<HTMLInputElement>) => {
        setActivityLevel((event.target as HTMLInputElement).value);
    };

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword1((event.target as HTMLInputElement).value);
    };
    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2((event.target as HTMLInputElement).value);
    };

    const onClick = () => {
        if (equalPasswords) {
            createUser(firstName, surname, email, number, password1);
        } else {
            alert('Noe gikk galt');
        }
    };

    return (
        <NewUsernContainer>
            <NewUserCard
                onChangeFirstName={onChangeFirstName}
                onChangeSurname={onChangeSurname}
                onChangeActivityLevel={onChangeActivityLevel}
                activityLevel={activityLevel}
                onChangeEmail={onChangeEmail}
                onChangeNumber={onChangeNumber}
                onChangePassword1={onChangePassword1}
                onChangePassword2={onChangePassword2}
                onClick={onClick}
                equalPasswords={equalPasswords}
                correctEmailFormat={correctEmailFormat}
                email={email}
            ></NewUserCard>
        </NewUsernContainer>
    );
};

export default NewUser;
