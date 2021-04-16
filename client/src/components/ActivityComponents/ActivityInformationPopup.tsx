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
        >
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex', float: 'right' }}>
                    {/* The typography and button component will be shown in a single line*/}
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
