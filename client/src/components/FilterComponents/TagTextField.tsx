import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Tag from '../../interfaces/Tag';
import axios from '../../Axios';

const TagTextField = () => {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        axios.get('/tag').then((data) => {
            setTags(data.data);
        });
    }, []);

    return (
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={tags.map((option) => option.description)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Søk på tags"
                    margin="normal"
                    variant="outlined"
                />
            )}
        />
    );
};

export default TagTextField;
