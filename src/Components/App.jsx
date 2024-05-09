import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'
import './components.scss'
import './dashboard.scss'
import './defaults.scss'
import './main1.scss'
import './variables.scss'
import SignUp from './SignUp';
import Download from './Download';

const Container = () => {
    
    return (
        <Routes>
            <Route>
                <Route path="/" element={<SignUp />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/download" element={<Download />} /> */}

            </Route>
        </Routes>

    )
}

export default Container
