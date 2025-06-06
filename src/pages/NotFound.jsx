import React from 'react';
import { Link } from 'react-router';

export default function NotFound() {
    return (
        <div style={{ color: 'white' }}>
            <h2>404</h2>
            <h2>page not found.</h2>
            <Link style={{color:'gray'}} to="/">Go Back Home</Link>
        </div >
    );
}
