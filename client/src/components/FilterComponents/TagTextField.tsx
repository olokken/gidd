import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Tag from '../../interfaces/Tag';
import axios from '../../Axios';

const TagTextField = () => {
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        axios.get('').then((data) => {
            console.log(data.data);
        });
    }, []);

    return (
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={tags.map((option) => option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    margin="normal"
                    variant="outlined"
                />
            )}
        />
    );
};

export default TagTextField;
