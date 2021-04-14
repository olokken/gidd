import React from 'react';
import { Button } from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';

interface Props {
    onClick: () => void;
}
const AddButton = ({ onClick }: Props) => {
    return (
        <Button onClick={onClick} variant="contained" color="primary">
            Legg til ny aktivitet
            <AddBox style={{ marginLeft: '8px' }}></AddBox>
        </Button>
    );
};

export default AddButton;
