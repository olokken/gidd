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
import FeedCard from '../components/GroupsAndFriendsComponents/FeedCard';
import User from '../interfaces/User';
import axios from '../Axios'
import { UserContext } from '../UserContext';
import Group from '../interfaces/Group'



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
    const [selectedGroup, setSelectedGroup] = useState<Group>({
        owner: {
            firstName: '',
            surname: '',
            userID: '',
            email: '',
            picture: '',
            password: '',
            phoneNumber: '',
            activityLevel: '',
            points: ''
        },
        groupName: '',
        groupId: '0',
        users: []
    });

    //henter alle users
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

    const handleGroupClicked = (group: Group) => {
        console.log(group);
        setSelectedGroup(group);
    }

    const leaveGroup = () => {
        const groupId = selectedGroup.groupId;
        axios
            .delete(`group/${groupId}/user/${user}`)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .catch((error) => {
                alert("Du kan ikke forlate gruppen mens du er eier");
                console.log('Kunne ikke forlate gruppe: ' + error.message)
            }
            );
    }


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

    //henter ut alle venner
    useEffect(() => {
        axios
            .get(`/user/${user}/user`)
            .then((response) => {
                console.log('Venner:')
                console.log(response.data['users']);
                setFriends(response.data['users']);
            })
            .catch((error) => console.log(error));
    }, [user]);

    return (
        <Container>
            <div style={{ width: '20%' }}>
                <FriendList users={users} friends={friends} />
            </div>
            <div style={{ width: '57%' }}>
                <FeedCard selectedGroup={selectedGroup} leaveGroup={leaveGroup}></FeedCard>
            </div>

            <div style={{ width: '20%' }}>
                <GroupList friends={friends} groups={groups} handleGroupClicked={handleGroupClicked} />
            </div>
        </Container>
    );
};

export default GroupsAndFriends;
