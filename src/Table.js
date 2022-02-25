import React from 'react'
import './Table.css';
import numeral from 'numeral';

function Table({ countries }) {
    return (
        <div className='table'>
            {countries.map(({ country, cases }) => (
                <tr>
                    <td className='text-dark' >{country}</td>
                    <td className='text-dark'><strong>{numeral(cases).format('0,0')}</strong></td>
                </tr>
            ))}

        </div>
    );
}

export default Table;
