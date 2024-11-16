import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [message, setMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  

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

        setEmail(response.data.dados.email);
        setName(response.data.dados.name);
        setUserName(response.data.dados.userName);

        setUserData(response.data);

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

const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('userId');
      await axios.patch(`http://localhost:3000/usuarios/${id}`, 
        {email,
        userName,
        name,},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/profile');
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        //console.log(error.response)
        setMessage(error.response.data.message); 
      } else {
        setMessage('Erro ao atualizar. Talvez o nome de usuário ou de email já exista');
      }
    }
  };

  const handleInputChange = () => {
    setMessage(''); 
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');

        if (!token || !id) {
          navigate('/login');
          throw new Error('Usuário não autenticado');
        }

        await axios.delete(`http://localhost:3000/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
      } catch (error) {
        console.error('Erro ao deletar perfil:', error);
        alert('Erro ao excluir o perfil. Tente novamente.');
      }
    }
  };

  return (
    <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Edite seu perfil</h1>
        <form onSubmit={handleUpdateProfile}>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-white" htmlFor="nome"><b>Nome:</b></label>
                <input type="text" id="nome" onChange={(e) => setName(e.target.value)} value={name} placeholder="nome"/>
            </div>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-white" htmlFor="username"><b>Username:</b></label>
                <input type="text" id="username" required      
                    value={userName} 
                    placeholder="nome de usuário"
                    onChange={(e) => {
                        setUserName(e.target.value); 
                        handleInputChange();
                    }}/> 
            </div>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-white" htmlFor="email"><b>Email:</b></label>
                <input type="text" id="username" required
                    value={email}
                    placeholder="email"
                    onChange={(e) => {
                        setEmail(e.target.value); 
                        handleInputChange();
                    }}/>
            </div>
            {message && (
                <p className="text-white text-xs text-center">
                    {message}
                </p>
            )}
            <div id="input-enviar" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <input id="enviar" type="submit" value="Atualizar"/>
            </div>
        </form>
        <button
        onClick={handleDeleteProfile}
        className="delete-button bg-white text-g font-semibold m-[5px]">
        Excluir Perfil
        </button>
        <a className="bg-white m-[5px]" onClick={() => navigate(-1)}>voltar</a>
      </div>
    </main>
  );
};

export default EditProfile;