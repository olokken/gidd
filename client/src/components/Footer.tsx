import React from 'react';
import styled from 'styled-components';
import { AppBar, Button, Icon, Toolbar, MenuItem, makeStyles, ListItem, Drawer, TextField, TextareaAutosize } from '@material-ui/core';

const StyledTextArea = styled.textarea`
    resize: none;
    border-radius: 10px;
`;

const Footer = () => {

  return (
        <AppBar position="static" style={{display:'flex', height:'300px'}}>
            <Toolbar style={{display:"flex",flexDirection:"column", justifyContent:"space-between"}}>
                <h3>Gi oss tilbake meldinger!</h3>
                <div>
                    <StyledTextArea wrap={'off'} cols={70} rows={10}/>
                </div>
                <Button style={{backgroundColor:'white'}}>Send tilbakemeldinger</Button>
            </Toolbar>
        </AppBar>
  );
}

export default Footer;