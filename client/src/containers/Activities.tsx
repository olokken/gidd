import React, { ChangeEvent, KeyboardEventHandler, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import SideFilter from '../components/Filters/SideFilter';

//Endringer kan forekomme her
interface Activity {
    id:number;
    titlle:string; 
    time:Date;  
    repeat:number; 
    user_id:number; 
    capacity:number; 
    group_id:number; 
    description:string; 
    level:string; 
    latitude:number; 
    longitude:number; 
    picture:any; 
  }

const Container = styled.div`
    display: flex;
    margin-top:100px; 
    margin-left:10px; 
`;

const HomePage = () => {
    const [activities, setActivities] = useState<Activity[]>([]); 

    return (
        <Container>
            <SideFilter></SideFilter>

        </Container>
    );
};

export default HomePage;
