import React, { ChangeEvent, useContext, useState } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import Select from 'react-select';
import FriendCard from './FriendCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBox from '@material-ui/icons/AddBox';
import User from '../../interfaces/User';
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

interface Props {
    friends: User[];
}


const GroupList = ( {friends} : Props) => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectInput, setSelectInput] = useState<User[]>([]);
    const [searchValue, setSearchValue] = React.useState('');
    const {user, setUser} = useContext(UserContext);

     const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };

     const onAddGroupClick = () => {
        console.log(selectInput);
        console.log("searchInput: " + searchValue);
        setSelectInput([]);
        setSearchValue('');
    }
    
    return (
        <StyledContainer>
           <Autocomplete
                id="free-solo-demo"
                value={selectInput}
                multiple
                noOptionsText="ingen valg"
                onChange={(event: any, newValue: User[]) => {
                    setSelectInput(newValue);
                }}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                    setSearchValue(newInputValue);
                }}
                options={friends}
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
                onClick={onAddGroupClick}
                variant="contained" 
                color="primary"
                style={{width:"100%"}}
            >
                Lag gruppe
                <AddBox style={{ marginLeft: '8px'}}></AddBox>
            </Button>

            
            <TextField style={{marginTop:'5px'}} 
                onChange={onSearchChange} 
                fullWidth={true} 
                label="Søk etter grupper" 
                variant="outlined" 
            />
            <h2>Dine grupper</h2>
            <StyledUl >
               
            </StyledUl> 
        </StyledContainer>
    );
};

export default GroupList;
