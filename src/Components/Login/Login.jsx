import React, {useState} from 'react'
import './Login.css'
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'

import logo from '/img/logowhite.svg'

const Login = () =>{

  const navigate = useNavigate();

  const [email, setLoginEmail] = useState('')
  const [senha, setLoginSenha] = useState('')

  const loginUser = (event) => {
      event.preventDefault();

      Axios.post('http://localhost:3000/login', {
          Email: email,
          Senha: senha

        }).then((response) => {
          console.log(response.data.message);
          navigate('/');

        }).catch((error) => {
          console.error('Erro ao fazer login:', error);
        });
    }

    return(
        <div>
        <figure style={{ marginBottom: '26px' }}>
          <img
            src={logo}
            width="282px"
            alt="Logotipo do Indoalí"
          />
        </figure>
        <form>
          <div className="info" style={{ marginBottom: '30px' }}>
            <label htmlFor="email"></label>
            <input
              type="text"
              id="email"
              placeholder="E-mail ou username"
              required
              onChange={event => { setLoginEmail(event.target.value) }}
            />
          </div>
          <div className="info" style={{ marginBottom: '10px' }}>
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              required
              onChange={event => { setLoginSenha(event.target.value) }}
            />
          </div>
          <div id="log-links">
            <p>
              <a href="/register">Criar Conta</a>
            </p>
            <p>
              <a href="esqueceusenha.html">Esqueceu sua senha?</a>
            </p>
          </div>
          <div id="input-enviar" style={{ marginTop: '26px' }}>
            <input
              id="enviar"
              type="submit"
              value="Entrar"
              onClick={loginUser}
            />
          </div>
        </form>
      </div>
    )
}

export default Login