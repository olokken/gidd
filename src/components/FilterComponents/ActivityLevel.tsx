import { FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActivityLevels from '../../interfaces/ActivityLevels';

const Container = styled.div`
    justify-content: center;
`;

interface Props {
    onLevelChange: (levels: ActivityLevels) => void;
}

const ActivityLevel = ({ onLevelChange }: Props) => {
    const [activityLevels, setActivityLevels] = useState<ActivityLevels>({
        Low: true,
        Medium: true,
        High: true,
    });

    useEffect(() => {
        onLevelChange(activityLevels);
    }, [activityLevels]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActivityLevels({
            ...activityLevels,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Container>
            <h3>Vanskelighetsgrad</h3>
            <FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Low"
                            checked={activityLevels.Low}
                            onChange={handleChange}
                        />
                    }
                    label="Lav"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Medium"
                            checked={activityLevels.Medium}
                            onChange={handleChange}
                        />
                    }
                    label="Middels"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            name="High"
                            checked={activityLevels.High}
                            onChange={handleChange}
                        />
                    }
                    label="Høy"
                    name="Høy"
                />
            </FormControl>
        </Container>
    );
};

export default ActivityLevel;
