import React from 'react';
import styled from 'styled-components';
import Group from '../../interfaces/Group';
import GroupCard from './GroupCard';

const StyledUl = styled.ul`
    height: 300px;
    overflow-y: scroll;
    padding: 0;
`;

interface GroupsProps {
    groups: Group[];
    handleGroupClicked: (group: Group) => void;
}

export const Groups: React.FC<GroupsProps> = ({
    groups,
    handleGroupClicked,
}: GroupsProps) => {
    return (
        <StyledUl>
            {groups
                /*
                .filter((group: Group) => {
                    if (searchInput === '') {
                        return group;
                    } else if (
                        group.groupName != null &&
                        group.groupName
                            .toLowerCase()
                            .includes(searchInput.toLocaleLowerCase())
                    ) {
                        return group;
                    }
                })
                */
                .map((group: Group) => (
                    <GroupCard
                        key={group.groupId}
                        group={group}
                        handleGroupClicked={handleGroupClicked}
                    />
                ))}
        </StyledUl>
    );
};
