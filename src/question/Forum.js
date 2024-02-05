import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Header from '../composent/Header';

function Forum(){

    const {state} = useLocation()

    const [discussions, setDiscussions] = useState([{question: state, }])

    return (
        <div>
            <Header></Header>

        </div>
    )

} export default Forum;
