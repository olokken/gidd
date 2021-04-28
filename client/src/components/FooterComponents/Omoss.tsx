import React from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { InputLabel, Button } from '@material-ui/core';

const Omoss = () => {
    return (
        <div style={{ maxWidth: '400px' }}>
            <h4>Litt om hva vi gjør</h4>
            <p>
                Gidd er en nettside som prøver å gjøre det lettere for kjente og
                ikkje so kjente å planlegge aktiviteter. Hos oss kan du lage
                eller melde deg på aktiviter som du selv ønsker. Vi har et ønske
                om å oppnå et samhold mellom folk som liker og holde seg i
                aktivitet. Få
            </p>
            <h4>Hvem er står bak?</h4>
            <p>
                Mathias Myrold, Håvard Tysland, Ole Løkken, William Forbrigd,
                Lea Grønning, Erling Sletta, Iben Lind Dragesund og Ingebrigt
                Hovind, Håkon
            </p>
        </div>
    );
};

export default Omoss;
