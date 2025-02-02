import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';
import Voltar from '../assets/voltar.svg';
import FotoGenerica from '../assets/profileimage.jpeg';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [message, setMessage] = useState<string | null>(null);
  const [sair, setSair] = useState<boolean>(false);

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoLocal, setFotoLocal] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

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
        setDescricao(response.data.dados.descricao);
        setFotoLocal(response.data.dados.fotoperfil);

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
        name, 
        descricao,},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formData = new FormData();
      if (foto) {
        formData.append('foto', foto); // Nome do campo deve ser 'foto'
      }
      await axios.post(`http://localhost:3000/usuarios/uploadfoto/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);

      // File preview
      const reader = new FileReader();
      reader.onload = () => {
        const previewElement = document.getElementById("file-preview") as HTMLImageElement;
        if (previewElement) previewElement.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRemove = () => {
    setFoto(null)
    setFotoLocal("")
  };

  return (
    <main className="indoali h-screen justify-start">
      { sair ? <>
        <div className="w-full h-full bg-black bg-opacity-50 fixed" onClick={() => {setSair(false)}}></div>
        <div className="bg-white fixed bottom-1/2 flex flex-col justify-center p-4 text-center rounded-md">
          <p className="text-[#2F2959] text-lg">Tem certeza que deseja excluir sua conta?</p>
          <p className="text-[#ff0000]">Essa ação não pode ser desfeita!</p>
          <div className="flex justify-between">
            <button className="bg-[#7F6EF2] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-white" onClick={() => {setSair(false)}}>Cancelar</button>
            <button className="bg-[#E98800] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-white" onClick={handleDeleteProfile}>Apagar</button>
          </div>
        </div>
      </> : null
      }
      <header className="p-4 flex items-center justify-between bg-[#F7F5FF] w-screen">
        <button >
        <img className="h-5 w-5" src={Voltar} alt="Sair da conta" onClick={() => navigate(-1)} />
        </button>
        <h1 className="text-lg pl-4 pr-4 text-[#2F2959] font-bold">Editar Perfil</h1>
        <div className="w-5"></div>
      </header>
      <div className="flex flex-col items-center p-4 w-full justify-center">
        <div>
          { foto ? 
          <>
            <label  className='remove flex h-32 w-32' htmlFor="removefoto">
              <img id="file-preview" className='object-cover rounded-full w-32 h-32'/>
              <div className='flex flex-col justify-center absolute h-32 w-32 bg-black bg-opacity-50 rounded-full'><p className="text-lg text-white text-center">Remover foto</p></div>
            </label>
          </> : 
          <>
            {fotoLocal ?
              <>
                <label  className='remove flex h-32 w-32' htmlFor="removefoto">
                  <img id="file-preview" src={`http://localhost:3000/uploads/${fotoLocal}`} className='bg-blend-darken object-cover rounded-full w-32 h-32'/>
                  <div className='flex flex-col justify-center absolute h-32 w-32 bg-black bg-opacity-50 rounded-full'><p className="text-lg text-white text-center">Remover foto</p></div>
                </label>
              </> :
              <>
                <label  className='adiciona flex h-32 w-32' htmlFor="addfoto">
                  <img src={FotoGenerica} className='object-cover rounded-full w-32 h-32'/> 
                  <div className='flex flex-col justify-center absolute h-32 w-32 bg-black bg-opacity-50 rounded-full'><p className="text-lg text-white text-center">Adicionar foto</p></div>
                </label>
              </>
            }
          </> } 
          <input type="button" id="removefoto" className="hidden" onClick={handleFileRemove}/>
          <input type="file" id="addfoto" className="hidden" accept="image/*" onChange={handleFileChange}/>
        </div>
        <form onSubmit={handleUpdateProfile}>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-[#2F2959]" htmlFor="nome"><b>Nome:</b></label>
                <input className="border border-[#7F6EF2]" type="text" id="Nome" 
                onChange={(e) => setName(e.target.value.replace(/[\\\\\\/]/gi, '')
                )} value={name} placeholder="nome"/>
            </div>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-[#2F2959]" htmlFor="username"><b>Username:</b></label>
                <input className="border border-[#7F6EF2]" type="text" id="username" required      
                    value={userName} 
                    placeholder="Nome de usuário"
                    onChange={(e) => {
                        setUserName(e.target.value.split(" ").join("").replace(/[`~!@#$%^&*()|+\=?;:´¨¹²³£¢¬°'",<>{}ºª§\[\]\\\/]/gi, '').toLowerCase()); 
                        handleInputChange();
                    }}/> 
            </div>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-[#2F2959]" htmlFor="email"><b>Email:</b></label>
                <input className="border border-[#7F6EF2]" type="text" id="username" required
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value); 
                        handleInputChange();
                    }}/>
            </div>
            <div className="info" style={{ marginBottom: '20px' }}>
                <label className="text-[#2F2959]" htmlFor="descricao"><b>Descrição:</b></label>
                <TextareaAutosize id="descricao" className="pt-2.5 pb-2.5 border border-[#7F6EF2] resize-none" required
                    value={descricao}
                    placeholder="Descrição"
                    onChange={(e) => {
                        setDescricao(e.target.value); 
                        handleInputChange();
                        (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);
                    }}/>
                    
            </div>
            {message && (
                <p className="text-[#ff0000] text-xs text-center">
                    {message}
                </p>
            )}
            <div id="input-enviar" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <input id="enviar" type="submit" value="Atualizar"/>
            </div>
        </form>
        <button
        onClick={() => {setSair(true)}}
        className="delete-button pt-1.5 pb-1.5 border border-[#E98800]">
        Excluir Perfil
        </button>
        <footer className="p-7"></footer>
      </div>
    </main>
  );
};

export default EditProfile;