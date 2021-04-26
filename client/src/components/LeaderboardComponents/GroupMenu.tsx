import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Group from '../../interfaces/Group';
import {
    ClickAwayListener,
    Grow,
    MenuList,
    Paper,
    Popper,
} from '@material-ui/core';

interface Props {
    anchorEl: HTMLElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    groups: Group[];
    setGroup: React.Dispatch<React.SetStateAction<Group>>;
}
export default function GroupMenu({
    anchorEl,
    setAnchorEl,
    groups,
    setGroup,
}: Props) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const renderGroupMenuItems = groups.map((group, index: number) => {
        return (
            <MenuItem
                key={index}
                onClick={() => {
                    setGroup(group);
                    setAnchorEl(null);
                }}
            >
                {group.groupName}
            </MenuItem>
        );
    });

    return (
        <div>
            <Popper
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="menu-list-grow"
                                >
                                    {renderGroupMenuItems}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}
