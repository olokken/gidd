import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import { AppBar, Button} from '@material-ui/core';
import FeedbackForm from './FeedbackForm';
import Popup from '../Popup';
import Omoss from "./Omoss";


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
    const [openPopup2, setOpenPopup2] = useState<boolean>(false);
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
                                <FeedbackForm
                                    openPopup={openPopup}
                                    setOpenPopup={setOpenPopup}  
                                />
                            </Popup>
                            <Button onClick={() => setOpenPopup2(!openPopup2)} style={{color:"white"}}>Om GIDD</Button>
                            <Popup
                                title="Om oss"
                                openPopup={openPopup2}
                                setOpenPopup={setOpenPopup2}
                            >
                                <Omoss/>
                            </Popup>
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
        return (
            <StyledContainer>
                <StyledRow>
                    <StyledCol>
                        <StyledUl>
                            <li>Frontendutvikler: Mathias Myrold</li>
                            <li>Frontendutvikler: Ole Løkken</li>
                            <li>Frontendutvikler: Håvard Tysland</li>
                            <li>Frontendutvikler: William Forbrigd</li>
                            <li>Frontendutvikler: Iben Lind Dragesund</li>
                            <li>Backendutvikler: Ingebrigt Hovind</li>
                            <li>Backendutvikler: Erling sletta</li>
                            <li>Backendutvikler: Lea Grønning</li>
                        </StyledUl>
                    </StyledCol>
                    <StyledCol>
                        <StyledUl>
                            <li>
                                <Button
                                    onClick={() => setOpenPopup(!openPopup)}
                                    style={{ color: 'white' }}
                                >
                                    Kontakt GIDD
                                </Button>
                            </li>
                            <li>
                                <Button
                                    onClick={() => setOpenPopup2(!openPopup2)}
                                    style={{ color: 'white' }}
                                >
                                    Om GIDD
                                </Button>
                            </li>
                            <li>
                                <Button style={{ color: 'white' }}>
                                    Team 6
                                </Button>
                            </li>
                        </StyledUl>
                    </StyledCol>
                    <Popup
                        title="Send oss en mail"
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                    >
                        <FeedbackForm
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                        />
                    </Popup>
                    <Popup
                        title="Om oss"
                        openPopup={openPopup2}
                        setOpenPopup={setOpenPopup2}
                    >
                        <Omoss />
                    </Popup>

                    <StyledCol>
                        <StyledUl>
                            <li>GIDD har ikke ansvar for eksterne nettsider</li>
                            <li>
                                som det lenkes til. Kopiering av materiale fra
                                GIDD for
                            </li>
                            <li>
                                burk av annet sted er ikke tilatt uten avtale.
                            </li>
                        </StyledUl>
                    </StyledCol>
                </StyledRow>

                <hr />
                <StyledRow>
                    <div style={{ display: 'flex' }}>
                        <img
                            src={logo}
                            style={{
                                width: '40px',
                                margin: '10px',
                            }}
                        />
                        <p>
                            &copy;{new Date().getFullYear} GIDD |
                            Personvernerklæring og informasjonskapsler (cookies){' '}
                        </p>
                    </div>
                </StyledRow>
            </StyledContainer>
        );
    }

  return (
        <AppBar position="static" style={{}}>
            {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
  );
}

export default Footer;