import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import styles from './Header.module.css';

export default function Header() {
    const [title, setTitle] = useState('Todo List');
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setTitle('Todo List');
        } else if (path === '/about') {
            setTitle('About');
        } else {
            setTitle('Not Found');
        }
    }, [location]);
    return (
        <>
            <h1>{title}</h1>
            <nav>
                <NavLink className={({ isActive }) => isActive ? styles.active : styles.inactive} to={'/'}>Home</NavLink>
                <NavLink className={({ isActive }) => isActive ? styles.active : styles.inactive} to={'/about'} >About</NavLink>
            </nav>
        </>
    );
}
