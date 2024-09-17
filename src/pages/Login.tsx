import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoWhite from "../assets/logowhite.svg"

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      navigate('/');
    } catch (error) {
      console.error('Error logging in', error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message);
      } else {
        setErrorMessage('Ocorreu um erro inesperado.');
      }
      //setErrorMessage(error.response.data.message);
    }
  };

  if (token){
    navigate('/');
  }

  return (
    <main className="indoali">
    <div className="h-screen flex flex-col items-center justify-center">
      <figure style={{ marginBottom: '26px' }}>
        <img src={LogoWhite} width="282px" alt="Logotipo do Indoalí" />
      </figure>
      <form onSubmit={handleLogin}>
        <div className="info" style={{ marginBottom: '30px' }}>
          <label htmlFor="email"></label>
          <input type="email" id="email" placeholder="E-mail ou username" required 
          value={email} onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage(''); 
          }}/>
        </div>
        <div className="info" style={{ marginBottom: '10px' }}>
          <label htmlFor="password"></label>
          <input type="password" id="password" placeholder="Senha" required 
          value={senha} onChange={(e) => {
            setSenha(e.target.value);
            setErrorMessage('');
          }}/>
        </div>
        {errorMessage && (
              <p className="text-white text-xs m-[0.5rem] text-center">
                {errorMessage}
              </p>
        )}
        <div id="log-links">
          <p><a href="/register">Criar Conta</a></p>
          <p><a href="/login">Esqueceu sua senha?</a></p>
        </div>
        <div id="input-enviar" style={{ marginTop: '26px' }}>
          <input id="enviar" type="submit" value="Entrar" />
        </div>
      </form>
    </div>
  </main>
  );
};

export default Login;