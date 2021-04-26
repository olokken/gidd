import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import Select from 'react-select';
import FriendCard from './FriendCard';
import GroupCard from './GroupCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBox from '@material-ui/icons/AddBox';
import User from '../../interfaces/User';
import axios from '../../Axios'
import { UserContext } from '../../UserContext';
import Group from '../../interfaces/Group'

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
    groups: Group[];
    onClick?: () => void;
}




const GroupList = ({ friends, groups, onClick }: Props) => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectInput, setSelectInput] = useState<User[]>([]);
    const [chosenGroupName, setChosenGroupName] = useState<string>('');
    const [searchValue, setSearchValue] = React.useState('');
    const { user } = useContext(UserContext);



    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };

    const onGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChosenGroupName((event.target as HTMLInputElement).value);
    };

    const onAddGroupClick = () => {
        console.log(selectInput);
        console.log(chosenGroupName);
        //console.log(getUserIds(selectInput));

        console.log("searchInput: " + searchValue);
        if (selectInput === null) {
            console.log('ingen bruker valgt ')
        } else {
            postGroup();
            setSelectInput([]);
            setSearchValue('');
        }
    }

    const getUserIds = (selectInput: User[]) => {
        const userIds: string[] = [];
        selectInput.forEach(input => userIds.push(Object.values(input)[0]));
        return userIds;
    }

    const postGroup = () => {
        console.log(getUserIds(selectInput).toString())
        axios
            .post(`/group`, {
                "groupName": chosenGroupName,
                "userIds": getUserIds(selectInput).toString(),
                "userId": user
            })
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .catch((error) => {
                console.log('Could not post friend: ' + error.message);
                alert('Du er allerede venn med denne brukeren');
            });
    }

    return (
        <StyledContainer>
            <TextField style={{ marginTop: '5px' }}
                onChange={onGroupNameChange}
                fullWidth={true}
                label="Gruppenavn"
                variant="outlined"
            />
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
                        label="Legg til medlemmer"
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />
            <Button
                onClick={onAddGroupClick}
                variant="contained"
                disabled={selectInput.length === 0}
                color="primary"
                style={{ width: "100%" }}
            >
                Lag gruppe
                <AddBox style={{ marginLeft: '8px' }}></AddBox>
            </Button>


            <TextField style={{ marginTop: '5px' }}
                onChange={onSearchChange}
                fullWidth={true}
                label="Søk etter grupper"
                variant="outlined"
            />
            <h2>Dine grupper</h2>
            <StyledUl>
            {groups.filter((group: Group) => {
                if (searchInput === "") {
                    return group
                } else if (group.groupName != null && (group.groupName).toLowerCase().includes(searchInput.toLocaleLowerCase())) {
                    return group
                }
            }).map((group: Group) =>
                <GroupCard onClick={onClick} key={group.groupId} group={group} />)
            }
            </StyledUl>
        </StyledContainer >
    );
};

export default GroupList;
