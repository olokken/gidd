import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import NewUserCard from '../components/CardComponents/NewUserCard';
import axios from '../Axios';

const NewUsernContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #334d50; /* fallback for old browsers */
    background: -webkit-linear-gradient(
        to bottom,
        #1d4350, #a43931
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
        to bottom,
        #1d4350, #a43931
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const NewUser = () => {
    const history = useHistory();
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const equalPasswords: boolean = password1 === password2 ? true : false;
    const correctEmailFormat = email.indexOf('@') > -1 ? true : false;
    const [visualActivityLevel, setVisualActivityLevel] = useState<string>('');

    const createUser = (
        firstName: string,
        surname: string,
        email: string,
        number: string,
        password: string,
        image: string
    ): boolean => {
        if (!equalPasswords && password1 !== '') {
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
                    image: image,
                })
                .then((response) => {
                    console.log(response)
                }).
                then(() => history.push('/Activities')
                ).catch((error) => {
                    if (error.response) {
                        alert('En bruker med denne E-mailen finnes allerede')
                    }
                });
            return true;
        }
    };

    const goBack = () => {
        history.push('/')
    }

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
        setVisualActivityLevel((event.target as HTMLInputElement).value)
        let actLevel = (event.target as HTMLInputElement).value
        if (actLevel === 'Lav') {
            actLevel = 'Low'
        } else if (actLevel === 'Middels') {
            actLevel = 'Medium'
        } else {
            actLevel = 'High'
        }
        setActivityLevel(actLevel);
    };

    const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword1((event.target as HTMLInputElement).value);
    };
    const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword2((event.target as HTMLInputElement).value);
    };

    const onChangeImage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log(event);
        if (event.target.files != null) {
            const file: File = event.target.files[0];
            console.log(file);
            const base64 = await convertBase64(file);
            console.log(base64);
            setImage(base64);
            console.log(image)
        }
    };

    const convertBase64 = (file: File) => {
        return new Promise<any>((resolve, reject) => {

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = (() => {
                resolve(fileReader.result);
            });
            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
    };

    const onClick = () => {
        if (equalPasswords) {
            createUser(firstName, surname, email, number, password1, image);
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
                visualActivityLevel={visualActivityLevel}
                onChangeEmail={onChangeEmail}
                onChangeNumber={onChangeNumber}
                onChangePassword1={onChangePassword1}
                onChangePassword2={onChangePassword2}
                onClick={onClick}
                equalPasswords={equalPasswords}
                correctEmailFormat={correctEmailFormat}
                email={email}
                goBack={goBack}
                image={image}
                onChangeImage={onChangeImage}
            ></NewUserCard>
        </NewUsernContainer>
    );
};

export default NewUser;
