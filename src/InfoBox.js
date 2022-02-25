import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';
import numeral from 'numeral';

function InfoBox({ title, cases, isRed, isOrange, isGreen, active, total, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red" || isOrange && "infoBox--orange" || isGreen && "infoBox--green"}`}>
            <CardContent>
                {/* Title */}
                <Typography className='infoBox__title' color="textSecondary">{title}</Typography>

                {/* Cases */}
                <h2 className={`infoBox__cases ${!isRed && isGreen && "infoBox__cases--green" || isOrange && "infoBox__cases--orange"}`}>{numeral(cases).format('0,0')}</h2>

                {/* Total */}
                <Typography className='infoBox__total' color="textSecondary"> Total Cases : {total}</Typography>

            </CardContent>
        </Card >
    )
}

export default InfoBox;