import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useContext,
    useEffect,
    useState,
} from 'react';
import styled from 'styled-components';
import FriendList from '../components/GroupsAndFriendsComponents/FriendList';
import GroupList from '../components/GroupsAndFriendsComponents/GroupList';
import User from '../interfaces/User';
import axios from '../Axios'
import { UserContext } from '../UserContext';
import Group from '../interfaces/Group'
import { Button, Drawer } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';



//Endringer kan forekomme her


const Container = styled.div`
    display: flex;
    margin-left: 10px;
    width: 100%;
`;


const GroupsAndFriends = () => {
    const [friends, setFriends] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const { user, setUser } = useContext(UserContext);
    const [selectedGroup, setSelectedGroup] = useState<Group>();
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
        drawerOpen2: false,
    });

    const { mobileView, drawerOpen, drawerOpen2 } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 951
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({
                    ...prevState,
                    mobileView: false,
                }));
        };
        setResponsiveness();
        window.addEventListener('resize', () => setResponsiveness());
    }, []);

    //henter alle dine grupper
    useEffect(() => {
        const url = `user/${user}/group`
        axios.get(url).then(response => { setGroups(response.data['groups']) }).catch(error => {
            console.log('Kunne ikke hente dine grupper' + error.message);
        })
    }, [friends, user]);


    //henter alle users
    useEffect(() => {
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                setUsers(response.data.filter(
                    (test: { userID: string; }) =>
                        Object.values(test)[0] != user && FriendCheck(test)
                ));
            })
            .catch((error) => console.log(error));
    }, [friends, user]);

    //sjekker om user finnes i friends
    const FriendCheck = (test: any) => {
        let a = true;
        friends.forEach(function (friend) {
            if (Object.values(friend)[0] === Object.values(test)[0]) {
                a = false;
            }
        })
        return a;
    }

    const updateFriends = () => {
         axios
            .get(`/user/${user}/user`)
            .then((response) => {
                console.log('Venner:')
                console.log(response.data['users']);
                setFriends(response.data['users']);
            })
            .catch((error) => console.log(error));
    }
    //henter ut alle venner
    useEffect(() => {
        updateFriends()
    }, [user]);


     const displayDesktop = () => {
        return (
            <Container>
            <div style={{ width: '20%', minWidth:'200px' }}>
                <FriendList updateFriends={updateFriends} users={users} friends={friends} />
            </div>
            <div style={{ width: '57%' }}>

            </div>

            <div style={{ width: '20%', minWidth:'200px', marginRight:'20px' }}>
                <GroupList friends={friends} groups={groups} />
            </div>
        </Container>
        );
    };

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));

        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        const handleDrawerOpen2 = () =>
            setState((prevState) => ({ ...prevState, drawerOpen2: true }));

        const handleDrawerClose2 = () =>
            setState((prevState) => ({ ...prevState, drawerOpen2: false }));

        return (
            <Container>
            <Button
                style={{
                    border: '1px solid lightgrey',
                    marginTop: '5px',
                    width:'90%',
                    marginRight:'5px',
                }}
                onClick={handleDrawerOpen}
            >
                Dine Venner  
            </Button>
            <Drawer
                style={{ width: '50px' }}
                {...{
                    anchor: 'bottom',
                    open: drawerOpen,
                    onClose: handleDrawerClose,
                }}
            >

                <br />
                <IconButton
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '0',
                    }}
                    onClick={handleDrawerClose}
                >
                    <CloseIcon />
                </IconButton>
                    <b style={{ textAlign: 'center' }}>Dine venner</b>
                    <Divider style={{marginTop: '20px'}}/>
                <FriendList updateFriends={updateFriends} users={users} friends={friends} />
            </Drawer>

            <Button
                style={{
                    border: '1px solid lightgrey',
                    marginTop: '5px',
                    width:'90%',
                    marginRight: '20px',
                }}
                onClick={handleDrawerOpen2}
            >
                Dine grupper
            </Button>
            <Drawer
                style={{ width: '50px' }}
                {...{
                    anchor: 'bottom',
                    open: drawerOpen2,
                    onClose: handleDrawerClose2,
                }}
            >
                <br />
                <IconButton
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '0',
                    }}
                    onClick={handleDrawerClose2}
                >
                    <CloseIcon />
                </IconButton>
                    <b style={{ textAlign: 'center' }}>Dine grupper</b>
                    <Divider style={{marginTop: '20px'}}/>
                <GroupList onClick={handleDrawerClose2} friends={friends} groups={groups} />
            </Drawer>    
        </Container>
        );
    };

    return (
        <div>{mobileView ? displayMobile() : displayDesktop()}</div>
    );
};

export default GroupsAndFriends;
