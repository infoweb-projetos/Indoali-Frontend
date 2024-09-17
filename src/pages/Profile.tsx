import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');
        
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await axios.get('http://localhost:3000/usuarios/'+id, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        //console.log(response.data)

        setUserData(response.data);

        //console.log(userData)
      } catch (error: any) { 
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('Token inválido ou expirado. Redirecionando para login...');

          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          
          navigate('/login');
        } else {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  if (!userData) {
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Usuário não cadastrado</h1>
        <a className="bg-white" href="/login" >fazer login</a>
      </div>
    </main>;
  }

  const logout = async () => {
    try {
        localStorage.clear();
        navigate('/login');
    } catch (error) {
        console.error('Erro em sair da conta', error);
    }
  }

  return (
    <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Perfil do Usuário</h1>
        <p className="bg-white"><b>Nome:</b> {userData.dados.name}</p>
        <p className="bg-white"><b>Nome de usuário:</b> {userData.dados.userName}</p>
        <p className="bg-white"><b>Email:</b> {userData.dados.email}</p>
        <a className="bg-white mt-[5px]" href="/profile/edit" >editar perfil</a>
        <a className="bg-white mt-[5px]" onClick={logout} >sair</a>
        <a className="bg-white m-[5px]" href="/" >início</a>
      </div>
    </main>
  );
};

export default UserProfile;