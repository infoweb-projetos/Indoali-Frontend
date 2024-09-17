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
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');
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
      
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        senha,
      });
      
      const { accessToken, userId } = response.data;
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('userId', userId); 
      console.log(accessToken)
      console.log(userId)
      console.log(localStorage)

      navigate('/login');
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        //console.log(error.response)
        setErrorMessage(error.response.data.message); 
      } else {
        setErrorMessage('Erro ao registrar. Talvez o nome de usuário ou de email já exista');
      }
    }
  };

  if (token){
    navigate('/');
  }

  const handleInputChange = () => {
    setErrorMessage(''); 
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
            <input type="text" id="nome" placeholder="nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="username"></label>
            <input type="text" id="username" placeholder="@username" required 
            value={userName} 
            onChange={(e) => {
              setUserName(e.target.value); 
              handleInputChange();
            }}/>
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="email"></label>
            <input type="email" id="email" placeholder="email" required 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value); 
              handleInputChange();
            }}/>
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="senha"></label>
            <input type="password" id="senha" placeholder="senha" required 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {errorMessage && (
          <p className="text-white text-xs text-center">
            {errorMessage}
          </p>
          )}
          <div id="input-enviar" style={{ marginBottom: '20px', marginTop: '20px' }}>
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