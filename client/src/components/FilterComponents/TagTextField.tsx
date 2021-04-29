import React, { ChangeEvent, useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Tag from '../../interfaces/Tag';
import axios from '../../Axios';

interface Props {
    onTagsChange: (tags: string[]) => void;
}

const TagTextField = ({ onTagsChange }: Props) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [currTags, setCurrTags] = useState<string[]>();

    useEffect(() => {
        axios.get('/tag').then((data) => {
            setTags(data.data);
        });
    }, []);

    useEffect(() => {
        if (currTags) {
            onTagsChange(currTags);
        }
    }, [currTags]);

    const onChangeTags = (event: ChangeEvent<any>, newInputValue: string[] | undefined) => {
        if (newInputValue) {
            setCurrTags(newInputValue);
        }
    }

    return (
        <Autocomplete
            id="free-solo-demo"
            multiple
            options={tags.map((option) => option.description)}
            onChange={onChangeTags}
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
