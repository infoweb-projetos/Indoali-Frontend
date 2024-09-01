import React, {useState} from 'react'
import './Register.css'
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'

import logo from '/img/logowhite.svg'

const Register = () =>{

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [name, setName] = useState('')
    const [senha, setSenha] = useState('')
  
    const createUser = ()=>{
        event.preventDefault();
        Axios.post('http://localhost:3000/register', {
            Email: email,
            UserName: userName,
            Name: name,
            Senha: senha

        }).then(()=>{
            console.log('O usuário foi cadastrado')
            navigate('/login')
        })
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
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="nome"></label>
            <input
              type="text"
              id="nome"
              placeholder="nome"
              required
              onChange={event=>{setName(event.target.value)}}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="username"></label>
            <input
              type="text"
              id="username"
              placeholder="@username"
              required
              onChange={event=>{setUserName(event.target.value)}}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="email"></label>
            <input
              type="text"
              id="email"
              placeholder="email"
              required
              onChange={event=>{setEmail(event.target.value)}}
            />
          </div>
          <div className="info" style={{ marginBottom: '20px' }}>
            <label htmlFor="senha"></label>
            <input
              type="text"
              id="senha"
              placeholder="senha"
              required
              onChange={event=>{setSenha(event.target.value)}}
            />
          </div>
          <div id="input-enviar" style={{ marginBottom: '20px' }}>
            <input
              id="enviar"
              type="submit"
              value="Entrar"
              onClick={createUser}
            />
          </div>
          <div id="log-links">
            <p>
              Já possui uma conta?
              <a href="/login">Faça login</a>
            </p>
          </div>
        </form>
      </div>
    )
}

export default Register