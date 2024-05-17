import React from 'react';
import './styles/main.css';
import './styles/login.css';
import {CreateRoomProcess} from './js/CreateRoom'
import  { useState, useEffect } from "react";

function CreateRoomPage() {

    const handleJoinRoom = () => {
        window.location.href = '/login';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    useEffect(() => {

        CreateRoomProcess()

    })

    return (
        <div>
            <header id="nav">
                <div className="nav--list">
                    <a href="login.html">
                        <h3 id="logo">
                            <img src="./images/logoEnsat.png" alt="Site Logo" width="150" />
                            <span></span>
                        </h3>
                    </a>
                </div>

                <div id="nav__links">
                    <button className="nav__link" id="create__room__btn" onClick={handleJoinRoom}>
                        Join Room
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ede0e0" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                        </svg>
                    </button>
                </div>
            </header>

            <main id="room__lobby__container">
                <div id="form__container">
                    <div id="form__container__header">
                        <p>👋 Create a Room</p>
                    </div>

                    <form id="create-form" onSubmit={handleSubmit}>
                        <div className="form__field__wrapper">
                            <div style={{ marginTop: '20px', marginLeft: '20px', marginBottom: '20px' }}>
                                <label style={{ fontWeight: '400px', fontSize: '15px' }}>Your Name</label>
                            </div>
                            <input type="text" name="name" required placeholder="Enter your display name..." style={{ marginLeft: '25px', width: '90%' }} />
                        </div>

                        <div className="form__field__wrapper">
                            <button type="submit" className="room" style={{ marginLeft: '27%', marginBottom: '30px' }}>Go to Room</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CreateRoomPage;
