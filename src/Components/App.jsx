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
import Favourites from './Favourites';
import Collections from './Collection';
import Collectionslist from './collectionlist';

const Container = () => {
    
    return (
        <Routes>
            <Route>
                <Route path="/" element={<SignUp />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path='/collections' element={< Collections/>}/>
                <Route path="/collectionslist" element={<Collectionslist/>}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/favourites" element={<Favourites/>}/>
                {/* <Route path="/download" element={<Download />} /> */}

            </Route>
        </Routes>

    )
}

export default Container
