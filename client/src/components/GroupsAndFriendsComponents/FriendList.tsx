import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import Select from 'react-select';
import FriendCard from './FriendCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBox from '@material-ui/icons/AddBox';

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

const friends = [
    {name: 'Mathias'},
    {name: 'bob1'},
    {name: 'bob2'},
    {name: 'bob3'},
    {name: 'bob4'},
    {name: 'bob5'},
    {name: 'bob6'},
    {name: 'bob7'},
    {name: 'mattimy99@gmail.com'},
]


const FriendList = () => {
    const [searchInput, setSearchInput] = useState<string>('');

    const [selectInput, setSelectInput] = useState<string | null>(null);
    const [searchValue, setSearchValue] = React.useState('');

     const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };
    const onAddFriendClick = () => {
        console.log("selectInput" + selectInput);
        console.log("searchInput" + searchValue);
        setSelectInput(null);
        setSearchValue('');
    }
    
    return (
        <StyledContainer>
            <Autocomplete
                id="free-solo-demo"
                value={selectInput}
                noOptionsText="ingen valg"
                onChange={(event: any, newValue: string | null) => {
                    setSelectInput(newValue);
                }}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                    setSearchValue(newInputValue);
                }}
                options={friends.map((friend) => friend.name)}
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
                variant="contained" 
                color="primary"
                style={{width:"100%"}}
            >
                Legg til venn
                <AddBox style={{ marginLeft: '8px'}}></AddBox>
            </Button>
            
            <TextField style={{marginTop:'5px'}} onChange={onSearchChange} fullWidth={true} label="Søk etter venner" variant="outlined" />
            <h2>Dine venner</h2>
            <StyledUl >
                {friends.filter((friend: { name: string}) => {
                if(searchInput == ""){
                    return friend
                }else if(friend.name != null && friend.name.toLowerCase().includes(searchInput.toLocaleLowerCase())){
                    return friend
                }
                }).map((friend: { name: string; }) => <FriendCard key={friend.name} friend={friend}/>)}
            </StyledUl> 
        </StyledContainer>
    );
};

export default FriendList;
