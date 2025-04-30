import React from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {

    const [searchQuery, setSearchQuery] = useState("")
    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery)
        }
    }
    const onClearSearch = () => {
        setSearchQuery("")
        handleClearSearch();
    }

    const navigate = useNavigate();
    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <h2 className="text-xl font-medium text-black py-2">Notes</h2>

            <SearchBar
                value={searchQuery}
                onClearSearch={onClearSearch}
                handleSearch={handleSearch}
                onChange={({ target }) => {
                    setSearchQuery(target.value)
                }}
            />
            {
                localStorage.getItem("token") ? <ProfileInfo userInfo={userInfo} onLogout={onLogout} /> : ""
            }

        </div>
    )
}

export default Navbar