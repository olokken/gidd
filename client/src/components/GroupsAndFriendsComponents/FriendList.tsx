import React, { ChangeEvent, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import Select from 'react-select';
import FriendCard from './FriendCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBox from '@material-ui/icons/AddBox';
import User2 from '../../interfaces/User';
import axios from '../../Axios'
import { UserContext } from '../../UserContext';

const StyledContainer = styled.div`
    margin-left: 1rem;
    margin-top:1rem;
    width: 95%;
`;

const StyledUl = styled.ul`
   height: 300px;
   overflow-y: scroll;
   padding: 0;
`;



const FriendList = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [firends, setFriends] = useState<User2[]>([]);
    const [users, setUsers] = useState<User2[]>([]);
    const [userToAdd, setUserToAdd] = useState<User2 | null>(null);
    const [selectInput, setSelectInput] = useState<User2 | null>(null);
    const [searchValue, setSearchValue] = React.useState('');
    const {user, setUser} = useContext(UserContext);

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };
    
    const onAddFriendClick = () => {
        if(selectInput === null){
            console.log('ingen bruker valgt')
        } else{
            postFriend(Object.values(selectInput)[0]);
            //console.log(selectInput.userID)
            setSelectInput(null);
            setSearchValue('');
        }
        
    }
    const postFriend = (friendId: string) => {
        console.log(friendId);
        console.log(user);
        
        
        /*const friend: User2 = {

        }
        axios
            .post('/friend', friend)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .catch((error) =>
                console.log('Could not post activity: ' + error.message)
            );*/
    }


    //henter alle users
    useEffect(() => {
        
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                setUsers(response.data.filter((test: { userID: string; }) => Object.values(test)[0] != user));
                //.filter((test: { userID: string; }) => test.userID !== user)
            })
            .catch((error) => console.log(error));
    }, []);
    
    return (
        <StyledContainer>
            <Autocomplete
                id="free-solo-demo"
                value={selectInput}
                noOptionsText="ingen valg"
                onChange={(event: any, newValue: User2 | null) => {
                    setSelectInput(newValue);
                }}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                    setSearchValue(newInputValue);
                }}
                options={users}
                getOptionLabel={(options) => options.firstName + ' ' + options.surname}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Legg til ny venn"
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />
            <Button 
                onClick={onAddFriendClick} 
                disabled={selectInput === null}
                variant="contained" 
                color="primary"
                style={{width:"100%"}}
            >
                Legg til venn
                <AddBox style={{ marginLeft: '8px'}}></AddBox>
            </Button>
            
            <TextField style={{marginTop:'5px'}} 
                onChange={onSearchChange} 
                fullWidth={true} 
                label="Søk etter venner" 
                variant="outlined" 
            />
            <h2>Dine venner</h2>
            <StyledUl >
                {users.filter((friend: { firstName: string, surname: string, userID: string}) => {
                if(searchInput === ""){
                    return friend
                }else if(friend.firstName + ' ' + friend.surname != null && (friend.firstName + ' ' + friend.surname).toLowerCase().includes(searchInput.toLocaleLowerCase())){
                    return friend
                }
                }).map((friend: { firstName: string, surname: string, userID: string}) => 
                    <FriendCard  key={friend.userID} friend={friend}/>)
                }
            </StyledUl> 
        </StyledContainer>
    );
};

export default FriendList;
