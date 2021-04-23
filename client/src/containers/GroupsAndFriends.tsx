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
import User2 from '../interfaces/User';
import axios from '../Axios'
import { UserContext } from '../UserContext';



//Endringer kan forekomme her


const Container = styled.div`
    display: flex;
    margin-left: 10px;
    width: 100%;
`;

const GroupsAndFriends = () => {
    const [friends, setFriends] = useState<User2[]>([]);
    const [users, setUsers] = useState<User2[]>([]);
    const {user, setUser} = useContext(UserContext);


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
    const FriendCheck = (test : any) => {
        let a = true;
        friends.forEach(function (friend) {
            if(Object.values(friend)[0] === Object.values(test)[0]) {
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
            <div style={{width:'20%'}}>
                <FriendList users={users} friends={friends}/>
            </div>
            <div style={{width:'57%'}}>
              
            </div>

            <div style={{width:'20%'}}>
                <GroupList friends={friends}/>
            </div>
        </Container>
    );
};

export default GroupsAndFriends;
