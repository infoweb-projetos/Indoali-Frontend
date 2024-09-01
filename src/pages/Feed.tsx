// import React, { useState } from 'react';
// import axios, { AxiosResponse } from "axios";
// import { useNavigate } from 'react-router-dom';
//import LogoWhite from "../assets/logowhite.svg"

const IrAoPerfil = () => {
    const token = localStorage.getItem('token');
    if (!token){
        return (<a className="bg-white" href="/login" >login</a>);
    }
    else{
        return (<a className="bg-white" href="/profile" >seu perfil</a>);
    }
}

const Feed: React.FC = () => {
    return(
        <main className="indoali">
            <div className="h-screen flex flex-col items-center justify-center">
                <h1 className="bg-white text-lg font-semibold m-[5px]">Home</h1>
                <IrAoPerfil/>
            </div>
        </main>
    );
}

export default Feed;