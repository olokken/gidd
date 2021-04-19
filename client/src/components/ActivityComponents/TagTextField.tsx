import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Tag from '../../interfaces/Tag';
import axios from '../../Axios';

const TagTextField = () => {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        //Få tak i alle tags og setTags
        //axios.get('/').then();
    }, []);

    return (
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={tags.map((option) => option.desc)}
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
