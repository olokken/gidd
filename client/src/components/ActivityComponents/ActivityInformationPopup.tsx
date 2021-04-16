import React, { Dispatch, SetStateAction } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    makeStyles,
    Typography,
    Button,
} from '@material-ui/core';

interface Props {
    title?: string;
    children?: React.ReactNode;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
          width: '0.4em'
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: '#000000',
        outline: '1px solid #302929'
      }
    },
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
    },
    dialogTitle: {
        
    },
}));

const ActivityInformationPopup = ({ openPopup, setOpenPopup, children }: Props) => {
    const classes = useStyles();
    return (
        <Dialog
            open={openPopup}
            fullWidth={true}
            maxWidth="sm"
            style={{
              padding: '0px'
            }}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex', float: 'right' }}>
                    <Button
                        color="secondary"
                        onClick={() => {
                            setOpenPopup(!openPopup);
                        }}
                    >
                        ×
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};

export default ActivityInformationPopup;
