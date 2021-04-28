import React, { ChangeEvent, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@material-ui/core';
import FriendCard from './FriendCard';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBox from '@material-ui/icons/AddBox';
import User from '../../interfaces/User';
import axios from '../../Axios';
import { UserContext } from '../../UserContext';

const StyledContainer = styled.div`
    margin-left: 1rem;
    margin-top: 1rem;
    width: 95%;
`;

const StyledUl = styled.ul`
    height: 300px;
    overflow-y: scroll;
    padding: 0;
`;

interface Props {
    users: User[];
    friends: User[];
    updateFriends: () => void;
}

const FriendList = ({ users, friends, updateFriends }: Props) => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectInput, setSelectInput] = useState<User | null>(null);
    const [searchValue, setSearchValue] = React.useState('');
    const { user, setUser } = useContext(UserContext);

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput((event.target as HTMLInputElement).value);
    };

    const onAddFriendClick = () => {
        if (selectInput === null) {
            console.log('ingen bruker valgt ');
        } else {
            postFriend(Object.values(selectInput)[0]);
            setSelectInput(null);
            setSearchValue('');
        }
    };
    const postFriend = (friendId: string) => {
        axios
            .post(`/user/${user}/user`, {
                userId: user,
                friendId: friendId,
            })
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .then(updateFriends)
            .catch((error) => {
                console.log('Could not post friend: ' + error.message);
                alert('Du er allerede venn med denne brukeren');
            });
    };
''

    return (
        <StyledContainer>
            <Autocomplete
                id="free-solo-demo"
                value={selectInput}
                noOptionsText="ingen valg"
                onChange={(event: any, newValue: User | null) => {
                    setSelectInput(newValue);
                }}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                    setSearchValue(newInputValue);
                }}
                options={users}
                getOptionLabel={(options) =>
                    options.firstName + ' ' + options.surname
                }
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
                style={{ width: '100%' }}
            >
                Legg til venn
                <AddBox style={{ marginLeft: '8px' }}></AddBox>
            </Button>

            <TextField
                style={{ marginTop: '5px' }}
                onChange={onSearchChange}
                fullWidth={true}
                label="Søk etter venner"
                variant="outlined"
            />
            <h2>Dine venner</h2>
            <StyledUl>
                {friends
                    .filter((friend: User) => {
                        if (searchInput === '') {
                            return friend;
                        } else if (
                            friend.firstName + ' ' + friend.surname != null &&
                            (friend.firstName + ' ' + friend.surname)
                                .toLowerCase()
                                .includes(searchInput.toLocaleLowerCase())
                        ) {
                            return friend;
                        }
                    })
                    .map((friend: User) => (
                        <FriendCard
                            updateFriends={updateFriends}
                            key={friend.userId}
                            friend={friend}
                        />
                    ))}
            </StyledUl>
        </StyledContainer>
    );
};

export default FriendList;
