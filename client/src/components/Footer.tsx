import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import logo from '../assets/logo.png';
import { AppBar, Button, Icon, Toolbar, MenuItem, makeStyles, ListItem, Drawer, TextField, TextareaAutosize } from '@material-ui/core';
import FeedbackForm from './FeedbackForm';
import Popup from '../components/Popup';


const StyledTextArea = styled.textarea`
    resize: none;
    border-radius: 10px;
`;

const StyledFooter = styled.div`
    padding-top: 3em;
    position: realtive;
    bottom:  0;
    width: 100%;
`;
const StyledContainer = styled.div`
    resize: none;
    border-radius: 10px;
`;  

const StyledRow= styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 10px;
   
`;

const StyledCol= styled.div`
    padding: 10px;
    font-size: 10px;
`;

const StyledUl = styled.ul`
     list-style: none;
     
`;

const Footer = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [state, setState] = useState({
    mobileView: false
  })
const { mobileView } = state;
  
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 951
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

    const displayMobile = () => {
        return(
             <StyledContainer>
                     <StyledRow>
                        <StyledCol>
                            <Button onClick={() => setOpenPopup(!openPopup)} style={{color:"white"}}>Kontakt GIDD</Button>
                            <Popup
                                title="Send oss en mail"
                                openPopup={openPopup}
                                setOpenPopup={setOpenPopup}
                            >
                                <FeedbackForm  />
                            </Popup>
                            <Button style={{color:"white"}}>Om GIDD</Button>
                            <Button style={{color:"white"}}>Team 6</Button>
                        </StyledCol>
                    
                     </StyledRow>

                     <hr />
                     <StyledRow>
                         <p>&copy;{new Date().getFullYear} GIDD AS | Personvernerklæring og informasjonskapsler (cookies) </p>
                     </StyledRow>
                 </StyledContainer>
        )
    }

    const displayDesktop = () => {
        return(
                 <StyledContainer>
                     <StyledRow>
                        <StyledCol>
                            <StyledUl>
                                <li>Administrerende direktør: Mathias Myrold</li>
                                <li>Frontendutvikler: Ole</li>
                                <li>Frontendutvikler: Håvard</li>
                                <li>Frontendutvikler: William</li>
                                <li>Backendutvikler: Ingebrigt</li>
                                <li>Backendutvikler: Erling</li>
                                <li>Backendutvikler: Iben</li>
                                <li>Backendutvikler: Lea</li>
                            </StyledUl>
                        </StyledCol>
                        <StyledCol>
                            <StyledUl>
                                <li ><Button onClick={() => setOpenPopup(!openPopup)} style={{color:"white"}}>Kontakt GIDD</Button></li>
                                <li ><Button style={{color:"white"}}>Om GIDD</Button></li>
                                <li ><Button style={{color:"white"}}>Team 6</Button></li>
                            </StyledUl>
                        </StyledCol>
                         <Popup
                            title="Send oss en mail"
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                            >
                        <FeedbackForm  />
                        </Popup>
                        <StyledCol>
                            <StyledUl>
                                <li>GIDD har ikke ansvar for eksterne nettsider</li>
                                <li>som det lenkes til. Kopiering av materiale fra GIDD for</li>
                                <li>burk av annet sted er ikke tilatt uten avtale.</li>
                                <li> <img src={logo} style={{
                                    width:"50px", 
                                    margin: "10px",
                                    cursor:"pointer"}} /></li>

                            </StyledUl>
                        </StyledCol>
                     </StyledRow>

                     <hr />
                     <StyledRow>
                         <p>&copy;{new Date().getFullYear} GIDD | Personvernerklæring og informasjonskapsler (cookies) </p>
                     </StyledRow>
                 </StyledContainer>
        )
    }

  return (
        <AppBar position="static" style={{}}>
            {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
  );
}

export default Footer;