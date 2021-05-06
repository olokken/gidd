import React, { useState } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { MenuItem, withStyles } from '@material-ui/core';
import ActivityResponse from '../../interfaces/ActivityResponse';
import Chat from '../ChatComponents/Chat';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

interface Props {
    id: string;
    anchorEl: null | HTMLElement;
    onClose: () => void;
    notifications: ActivityResponse[];
    onItemClick: (activityId: number) => void;
}

const ChatAlerts = ({
    id,
    anchorEl,
    onClose,
    notifications,
    onItemClick,
}: Props) => {
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<number>();

    const onClick = (activityId: number) => {
        onItemClick(activityId);
        setCurrentId(activityId);
        setOpenChat(true);
    };

    const mapNotifications = notifications.map((not, index) => (
        <MenuItem
            onClick={() => onClick(not.activityId)}
            key={index}
            style={{ marginBottom: '1rem' }}
        >
            Du har nye meldinger <br></br> i aktiviteten : {not.title}
        </MenuItem>
    ));
    return (
        <div>
            <StyledMenu
                onClose={onClose}
                keepMounted
                open={Boolean(anchorEl)}
                id={id}
                anchorEl={anchorEl}
            >
                {mapNotifications}
            </StyledMenu>
            {currentId && (
                <Chat
                    open={openChat}
                    close={() => setOpenChat(false)}
                    activityId={currentId}
                ></Chat>
            )}
        </div>
    );
};

export default ChatAlerts;
