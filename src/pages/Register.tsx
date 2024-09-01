import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import '../assets/indoali.css';
//import { ReactComponent as LogoWhite } from "../assets/logowhite.svg";
import LogoWhite from "../assets/logowhite.svg"

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/usuarios/', {
        email,
        senha,
        userName,
        name,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering', error);
    }
  };

  return (
    <div className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <figure style={{ marginBottom: '26px' }}>
          <img src={LogoWhite} width="282px" alt="Logotipo do Indoalí" />
        </figure>
        <form onSubmit={handleRegister}>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="nome"></label>
            <input type="text" id="nome" placeholder="nome" required 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="username"></label>
            <input type="text" id="username" placeholder="@username" required 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="email"></label>
            <input type="email" id="email" placeholder="email" required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="senha"></label>
            <input type="password" id="senha" placeholder="senha" required 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div id="input-enviar" style={{ marginBottom: '20px' }}>
            <input id="enviar" type="submit" value="Entrar" />
          </div>
          <div id="log-links">
            <p>Já possui uma conta? <a href="/login">Faça login</a></p>
          </div>
        </form>
      </div>
    </div>
    
  );
};

export default Register;