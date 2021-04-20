import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from 'react';
import styled from 'styled-components';
import FriendList from '../components/GroupsAndFriendsComponents/FriendList';
import GroupList from '../components/GroupsAndFriendsComponents/GroupList';



//Endringer kan forekomme her


const Container = styled.div`
    display: flex;
    margin-left: 10px;
    width: 100%;
`;

const GroupsAndFriends = () => {

    return (
        <Container>
            <div style={{width:'20%'}}>
                <FriendList/>
            </div>
            <div style={{width:'57%'}}>
              
            </div>

            <div style={{width:'20%'}}>
                <GroupList/>
            </div>
        </Container>
    );
};

export default GroupsAndFriends;
