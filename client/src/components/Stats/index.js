import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_STATS } from '../../utils/queries';


const Stats = props => {

    const { loading, data } = useQuery(QUERY_STATS);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>This is some data but it's not working{data}</div>
    );
}


export default Stats;