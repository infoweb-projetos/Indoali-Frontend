import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logout from '../assets/sairdaconta.svg';
import Foto from '../assets/profileimage.jpeg';
import Notif from '../assets/notif.svg';
import Inicio from '../assets/inicioicon.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannericon.svg';
import Perfil from '../assets/perfilselec.svg';
import FavIcon from '../assets/heart_orange_fill.svg';
import AmiIcon from '../assets/amigosicon.svg'
import Local from '../assets/localimage.jpg'
import { TextareaAutosize } from '@mui/material';

type Favorito = {
  id: number;
  id_lugar: number;
  name: string;
};
type Amigo = {
  id: number;
  id_amigo: number;
  name: string;
  username: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [sair, setSair] = useState<boolean>(false);
  
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

    const fetchFavoritos = async () => {
      try {
        const id = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // Faz a primeira requisição para obter os favoritos do usuário
        const resposta = await axios.get("http://localhost:3000/favoritos/usuario/"+id, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        //console.log(resposta)
        
        // extrai os id de cada favorito e realiza a requisição para cada lugar favorito
        const dados = await Promise.all(
          resposta.data.favoritosdousuario.map(async (item: { id: number; id_lugar: number }) => {
            const lugarResposta = await axios.get("http://localhost:3000/lugares/"+item.id_lugar, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            const lugar = lugarResposta.data;  // pega os dados do lugar diretamente
            //console.log(lugar.dados.name)
            return {
              id: item.id,
              id_lugar: item.id_lugar,
              name: lugar.dados.name,
            };
          })
        );
    
        // Atualiza o estado com os favoritos
        setFavoritos(dados);
        //console.log(dados)
      } catch (error) {
        console.error('Erro ao buscar os favoritos:', error);
      }
    };

    const fetchAmigos = async () => {
      try {
        const id = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // Faz a primeira requisição para obter os amigos do usuário
        const resposta = await axios.get("http://localhost:3000/amizades/usuario/"+id, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        //console.log(resposta)
        
        // extrai os id de cada amigo e realiza a requisição para cada usuário adicionado
        const dados = await Promise.all(
          resposta.data.amigosdousuario
          .filter((item: { aceito: boolean }) => item.aceito === true)
          .map(async (item: { id: number; id_emissor: number; id_receptor: number }) => {
            if (item.id_emissor != Number(id)){
            const userResposta = await axios.get("http://localhost:3000/usuarios/"+item.id_emissor, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            const amigo = userResposta.data;
            //console.log(amigo.dados.name)
            return {
              id: item.id,
              id_amigo: item.id_emissor,
              name: amigo.dados.name,
              username: amigo.dados.userName
            };
            } else {
              const userResposta = await axios.get("http://localhost:3000/usuarios/"+item.id_receptor, {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              });
              const amigo = userResposta.data;
              //console.log(amigo.dados.name)
              return {
                id: item.id,
                id_amigo: item.id_receptor,
                name: amigo.dados.name,
                username: amigo.dados.userName
              };
            }
          })
        );
    
        // Atualiza o estado com os favoritos
        setAmigos(dados);
        //console.log(dados)
      } catch (error) {
        console.error('Erro ao buscar os amigos:', error);
      }
    };

    fetchUserProfile();
    fetchFavoritos(); 
    fetchAmigos();
  }, []);

  // const login = async () => {
  //   try {
  //       localStorage.clear();
  //       navigate('/login');
  //   } catch (error) {
  //       console.error('Erro em ir para login', error);
  //   }
  // }


  if (!userData) {
    //localStorage.clear();
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...{/*Usuário não cadastrado*/}</h1>
        {/*<a className="bg-white" onClick={login} >fazer login</a>*/}
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

  const primeirosfavoritos = favoritos.slice(0, 5);
  const primeirosamigos = amigos.slice(0, 5);
  //console.log(primeirosamigos)

//   return (
//     <main className="indoali">
//       <div className="h-screen flex flex-col items-center justify-center">
//         <h1 className="bg-white text-lg font-semibold m-[5px]">Seu Perfil</h1>
//         <p className="bg-white"><b>Nome:</b> {userData.dados.name}</p>
//         <p className="bg-white"><b>Nome de usuário:</b> {userData.dados.userName}</p>
//         <p className="bg-white"><b>Email:</b> {userData.dados.email}</p>
//         <div id="favoritos" className="bg-white mt-2">
//           <h2 className="text-g font-semibold mb-2">Seus favoritos</h2>
//           <ul>
//           {
//             primeirosfavoritos.map((item: Favorito) => {
//               return <li key={item.id} className="bg-white"><a href={`/local/${item.id_lugar}`}>{item.name}</a></li>
//             })
//           }
//           {favoritos.length <= 0 && (
//             <p>Você não favoritou nenhum lugar</p> // Redireciona para uma página com todos os favoritos
//           )}
//           </ul>
//           {favoritos.length > 5 && (
//             <a href="/favoritos">Ver mais+</a>
//           )}
//         </div>
//         <div id="amigos" className="bg-white mt-2">
//           <h2 className="text-g font-semibold mb-2"><a href="/amigos">Seus amigos</a></h2>
//           <ul>
//           {
//             primeirosamigos.map((item: Amigo) => {
//               return <li key={item.id} className="bg-white"><a href={`/${item.username}`}>{item.name ? item.name : item.username}</a></li>
//             })
//           }
//           {amigos.length <= 0 && (
//             <p>Você não tem nenhum amigo aqui</p>
//           )}
//           </ul>
//           {amigos.length > 5 && (
//             <a href="/amigos">Ver mais+</a> // Redireciona para uma página com todos os amigos
//           )}
//         </div>
//         <a className="bg-white mt-[5px]" href="/profile/edit" >editar perfil</a>
//         <a className="bg-white mt-[5px]" onClick={logout} >sair</a> FAZER ISSO AQUI
//         <a className="bg-white m-[5px]" href="/" >início</a>
//       </div>
//     </main>
//   );
// };

return (
  <main className="indoali">
      <header className="p-4 flex items-center justify-between bg-[#F7F5FF] w-screen">
    <button >
      <img src={Logout} alt="Sair da conta" onClick={() => {setSair(true)}} />
    </button>
    <h1 className="text-lg text-[#2F2959] font-bold">Seu Perfil</h1>
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
          <button className="mt-2 w-40 py-1 bg-[#7F6EF2] text-white rounded-md text-base" onClick={() => window.open("/profile/edit", "_self")}>Editar perfil</button>
      </div>
      <img className="w-24 h-24 rounded-full" src={Foto} alt="Foto de perfil"/>
  </div>
    <div className="mt-4">
      <h3 className="text-[#7F6EF2]">Sobre seu perfil:</h3>
      <TextareaAutosize className="resize-none w-full mt-2 p-3 border border-[#7F6EF2] rounded-md text-base" readOnly minRows={3} value={userData.dados.descricao}/>
    </div>
  </section>
  <section className="p-4 w-full">
    <div className="flex justify-between items-center mb-2">
      <div className="flex" onClick={() => window.open("/amigos", "_self")}>
        <img className="mr-1" src={AmiIcon} />
        <h3 className="font-bold text-[#7F6EF2]">Amigos</h3>
      </div>
      {amigos.length > 5 && (
        <a href="/amigos" className="text-[#E98800] text-base">ver mais +</a> // Redireciona para uma página com todos os amigos
      )}
    </div>
    {amigos.length <= 0 && (
      <div className='flex flex-col text-[#2F2959]'>
        <p className='text-center'>Você não tem nenhum amigo aqui</p>
        <a className='m-auto' href="/amigos">+ Encontre seus amigos</a>
      </div>
    )}
    <div className="grid grid-cols-5 gap-5 overflow-x-auto">
      {
        primeirosamigos.map((item: Amigo) => {
        return <div className="text-center" key={item.id}>
                <a href={`/user/${item.username}`}>
                <img className="w-12 h-12 rounded-full m-auto" src={Foto} alt="Amigo 1"/>
                <p className="max-h-8 text-ellipsis overflow-hidden text-xs text-[#7C7A87]">{item.name ? item.name : item.username}</p>
                </a>
               </div>
        })
      }
      {/* <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Amigo 2"/>
        <p className="text-sm text-[#868686]">@cossito</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Amigo 2"/>
        <p className="text-sm text-[#868686]">@iarao</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Amigo 3"/>
        <p className="text-sm text-[#868686]">@luzia</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Amigo 4"/>
        <p className="text-sm text-[#868686]">@kuabrs</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Amigo 5"/>
        <p className="text-sm text-[#868686]">@loona</p>
      </div> */}
    </div>
  </section>
  <section className="p-4 w-full">
    <div className="flex justify-between items-center mb-2">
      <div className="flex" onClick={() => window.open("/favoritos", "_self")}>
        <img className="mr-1" src={FavIcon} />
        <h3 className="font-bold text-[#7F6EF2]">Seus favoritos</h3>
      </div>
      {favoritos.length > 5 && (
        <a href="/favoritos" className="text-[#E98800] text-base">ver mais +</a>
      )}
    </div>
    {favoritos.length <= 0 && (
      <div className='flex flex-col text-[#2F2959]'>
        <p className='text-center'>Você não favoritou nenhum lugar</p>
        <a className='m-auto' href="/pesquisar">+ Enconte novos lugares</a>
      </div>
    )}
    <div className="grid grid-cols-5 gap-4 overflow-x-auto">
      {
        primeirosfavoritos.map((item: Favorito) => {
        return <div className="text-center" key={item.id}>
                <a href={`/local/${item.id_lugar}`}>
                <img className="w-12 h-12 rounded-full m-auto" src={Local} alt={item.name}/>
                <p className="max-h-8 text-xs text-[#7C7A87]">{item.name}</p>
                </a>
               </div>
        })
      }
      {/* <div className="text-center" key={item.id}>
        <a href={`/local/${item.id_lugar}`}>
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt={item.name}/>
        <p className="text-sm text-[#868686]">{item.name}</p>
        </a>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Favorito 2"/>
        <p className="text-sm text-[#868686]">Bodega do..</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Favorito 3"/>
        <p className="text-sm text-[#868686]">Honorato Sushi</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Favorito 4"/>
        <p className="text-sm text-[#868686]">Parque das..</p>
      </div>
      <div className="text-center">
        <img className="w-12 h-12 rounded-full" src="../assets/image (1).png" alt="Favorito 5"/>
        <p className="text-sm text-[#868686]">Loop</p>
      </div> */}
    </div>
  </section>
  <section className="p-4 w-full">
    <div className="grid grid-cols-2 gap-4">
      <button className="py-2 px-4 bg-white border border-[#7F6EF2] text-[#7C7A87] text-base rounded-md hover:bg-[#F7F5FF] hover:text-[#2F2959] hover:border-[#2F2959]" >Conta</button>
      <button className="py-2 px-4 bg-white border border-[#7F6EF2] text-[#7C7A87] text-base rounded-md hover:bg-[#F7F5FF] hover:text-[#2F2959] hover:border-[#2F2959]">Endereços</button>
      <button className="py-2 px-4 bg-white border border-[#7F6EF2] text-[#7C7A87] text-base rounded-md hover:bg-[#F7F5FF] hover:text-[#2F2959] hover:border-[#2F2959]">Configurações</button>
      <button className="py-2 px-4 bg-white border border-[#7F6EF2] text-[#7C7A87] text-base rounded-md flex items-center justify-center hover:bg-[#F7F5FF] hover:text-[#2F2959] hover:border-[#2F2959]" >Ajuda{/*<img src="../assets/Vector.svg" alt="Busca"/>*/}</button>
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
  { sair ? <>
        <div className="w-full h-full bg-black bg-opacity-50 fixed top-0" onClick={() => {setSair(false)}}></div>
        <div className="bg-white fixed bottom-1/2 flex flex-col justify-center p-4 text-center rounded-md">
          <p className="text-[#2F2959] text-lg mb-2">Tem certeza que deseja sair de sua conta?</p>
          {/* <p className="text-[#ff0000]">Essa ação não pode ser desfeita!</p> */}
          <div className="flex justify-between">
            <button className="bg-[#7F6EF2] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-white" onClick={() => {setSair(false)}}>Cancelar</button>
            <button className="bg-[#E98800] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-white" onClick={logout}>Sair</button>
          </div>
        </div>
      </> : null
      }
  </main>
  );
};

export default UserProfile;