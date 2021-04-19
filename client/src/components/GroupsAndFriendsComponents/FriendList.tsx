import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import SelectSearch from 'react-select-search';
import FriendCard from './FriendCard';

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
    {name: 'Mathias',value: '1'},
    {name: 'bob1',value: '2'},
    {name: 'bob2',value: '3'},
    {name: 'bob3',value: '4'},
    {name: 'bob4',value: '5'},
    {name: 'bob5',value: '6'},
    {name: 'bob6',value: '7'},
    {name: 'bob7',value: '8'},
]


const FriendList = () => {
    const [searchInput, setSearchInput] = useState<string>('');

     const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };
    return (
        <StyledContainer>
            <SelectSearch 
            options={friends} 
            value="1" 
            search
            printOptions="auto"
            placeholder="Søk etter brukere" />
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
