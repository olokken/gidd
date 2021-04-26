import React from 'react'
import styled from 'styled-components'
import Group from '../../interfaces/Group'

const FeedContainer = styled.div`
    margin-left:20px;
`

interface Props {
    selectedGroup: Group;
}
export default function FeedCard({ selectedGroup }: Props) {
    return (
        selectedGroup.groupName !== '' ?
            <FeedContainer>
                <h2>{selectedGroup.groupName}</h2>
                {selectedGroup.groupId}

            </FeedContainer> :
            <FeedContainer>
                <h2>Ingen gruppe valgt</h2></FeedContainer>

    )
}
