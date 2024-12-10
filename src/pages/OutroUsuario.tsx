import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Voltar from '../assets/voltar.svg';
import Foto from '../assets/profileimage.jpeg';
import Notif from '../assets/notif.svg';
import Inicio from '../assets/inicioicon.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannericon.svg';
import Perfil from '../assets/perfilicon.svg';
import { TextareaAutosize } from '@mui/material';

const OutroUsuario: React.FC = () => {
    const navigate = useNavigate();
    const { userName } = useParams<{ userName: string }>();
    const [userData, setUserData] = useState<any>();
    const [relationshipStatus, setRelationshipStatus] = useState<string>('');
    const [ idAmizade, setIdAmizade ] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            try {
              const token = localStorage.getItem('token');
              const userId = localStorage.getItem('userId'); // ID do usuário logado
        
              if (!token) throw new Error('Usuário não autenticado');
        
              // Buscar todas as amizades do usuário logado
              // const response = await axios.get(`http://localhost:3000/amizades/usuario/${userId}`, {
              //   headers: { Authorization: `Bearer ${token}` }
              // });
        
              // const amizades = response.data.amigosdousuario;

              const responseuser = await axios.get('http://localhost:3000/usuarios/username/'+userName, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
              });
              const amizade = await axios.get(`http://localhost:3000/amizades/${userId}/${responseuser.data.dados.id}`,{
                headers: {
                  Authorization: `Bearer ${token}`,
              }
              });
              setUserData(responseuser.data);

            //console.log(response.data)

            // const user = responseuser.data;

        
              // Verificar se o perfil visitado está entre as amizades
              // const amizadeExistente = amizades.find((amigo: any) => 
              //   amigo.id_emissor === user.dados.id || amigo.id_receptor === user.dados.id
              // );
              

              // Atualizar o estado baseado no status da amizade
              if (amizade.data) {
                 setIdAmizade(amizade.data.id)
                 if (userId == amizade.data.id_emissor){
                     setRelationshipStatus(amizade.data.aceito ? 'amigo' : 'pendente');
                 }
                 else{
                     setRelationshipStatus(amizade.data.aceito ? 'amigo' : 'recebida');
                 }
               } else {
                 setRelationshipStatus('nenhum');
               }
               //console.log(amizade)
              
            } catch (error) {
              console.error('Erro ao buscar os dados da página', error);
            }
          };

        fetchData();
        }, []);

        if (!userData) {
        //localStorage.clear();
        return <main className="indoali">
            <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...{/*O usuário @{userName} não existe*/}</h1>
            </div>
        </main>;
        }

    // return (
    // <main className="indoali">
    //     <div className="h-screen flex flex-col items-center justify-center">
    //     <h1 className="bg-white text-lg font-semibold m-[5px]">Perfil do Usuário</h1>
    //     { userData.dados.name && (<p className="bg-white"><b>Nome:</b> {userData.dados.name}</p>)}
    //     <p className="bg-white"><b>Nome de usuário:</b> {userData.dados.userName}</p>
    //     <p className="bg-white"><b>Email:</b> {userData.dados.email}</p>
    //     <a className="bg-white m-[5px]" onClick={() => navigate(-1)} >voltar</a>
    //     </div>
    // </main>
    // )

    const adicionarAmizade = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Requisição para buscar o usuário pelo username
      const response = await axios.get(`http://localhost:3000/usuarios/username/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usuario = response.data.dados;
    
      // Crie uma solicitação de amizade
      await axios.post(
        `http://localhost:3000/amizades`,
        { id_emissor: Number(userId), id_receptor: Number(usuario.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      location.reload()

    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  const apagarAmizade = async () => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:3000/amizades/${idAmizade}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        location.reload()
    } catch (error) {
        console.error('Erro em apagar amizade', error)
    }
  }

  const aceitarAmizade = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/amizades/${idAmizade}`, 
            {aceito: true},
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        location.reload()

    } catch (error) {
        console.error('Erro em aceitar amizade', error)
    }
  }

return (
    <main className="indoali">
        <header className="p-4 flex items-center justify-between bg-[#F7F5FF] w-screen">
        <button >
        <img className="h-5 w-5" src={Voltar} alt="Sair da conta" onClick={() => navigate(-1)} />
        </button>
        <h1 className="text-lg truncate pl-2 pr-2 text-[#2F2959] font-bold">Perfil de {userData.dados.name ? userData.dados.name.split(" ")[0] : userData.dados.userName.split(" ")[0]}</h1>
        <button>
        <img src={Notif} alt="Notificações" />
        </button>
    </header>
    <section className="w-full p-4">
        <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-col w-3/5">
            
            <h2 className="text-xl font-semibold text-[#7F6EF2] truncate">{userData.dados.name ? userData.dados.name : userData.dados.userName}</h2>
            <p className="text-base text-[#7C7A87]">@{userData.dados.userName}</p>
            <p className="text-xs text-[#E98800]">Perfil criado em {userData.dados.datacriacao.split("-")[2].split("T")[0]}/{userData.dados.datacriacao.split("-")[1]}/{userData.dados.datacriacao.split("-")[0]}</p>
            {relationshipStatus === 'amigo' && (
                <button className="mt-2 w-40 py-1 bg-transparent border border-[#7F6EF2] text-[#7F6EF2] rounded-md text-base"
                  onClick={apagarAmizade}>
                  Remover Amizade
                </button>
              )}
              
              {relationshipStatus === 'pendente' && (
                <button className="mt-2 w-40 py-1 bg-transparent border border-[#7F6EF2] text-[#7F6EF2] rounded-md text-base"
                  onClick={apagarAmizade}>
                  Cancelar Solicitação
                </button>
              )}
              
              {relationshipStatus === 'nenhum' && (
                <button className="mt-2 w-40 py-1 bg-[#7F6EF2] text-white rounded-md text-base"
                  onClick={adicionarAmizade}>
                  Enviar Solicitação
                </button>
              )}

              {relationshipStatus === 'recebida' && (
                <div className="flex">
                <button className="mt-2 w-20 mr-1 py-1 bg-[#7F6EF2] text-white rounded-md text-base"
                  onClick={aceitarAmizade}>
                  Aceitar
                </button>
                <button className="mt-2 w-20 ml-1 py-1 bg-transparent border border-[#7F6EF2] text-[#7F6EF2] rounded-md text-base"
                  onClick={apagarAmizade}>
                  Recusar
                </button>
                </div>
              )}
        </div>
        <img className="w-24 h-24 rounded-full" src={Foto} alt="Foto de perfil"/>
    </div>
        <div className="mt-4">
        <h3 className="text-[#7F6EF2]">Sobre esse perfil:</h3>
        <TextareaAutosize className="resize-none w-full mt-2 p-3 border border-[#7F6EF2] rounded-md text-base" readOnly minRows={3} value={userData.dados.descricao}/>
        </div>
    </section>
    <section>
        <footer className="p-7"></footer>
        <nav className="fixed bottom-0 left-0 right-0 bg-[#F7F5FF] shadow-lg p-2 w-screen">
        <div className="flex justify-around">
            <button className="flex flex-col items-center text-[#7F6EF2]" onClick={() => window.open("/", "_self")}>
            <img src={Inicio} alt="Início"/>
            <span className="text-sm">Início</span>
            </button>
            <button className="flex flex-col items-center text-[#7F6EF2]">
            <img src={Busca} alt="Busca"/>
            <span className="text-sm">Busca</span>
            </button>
            <button className="flex flex-col items-center text-[#7F6EF2]">
            <img src={Planner} alt="Planner"/>
            <span className="text-sm">Planner</span>
            </button>
            <button className="flex flex-col items-center text-[#7F6EF2]" onClick={() => window.open("/profile", "_self")}>
            <img src={Perfil} alt="Perfil"/>
            <span className="text-sm">Perfil</span>
            </button>
        </div>
        </nav>
    </section>
    </main>
    );
};

export default OutroUsuario;