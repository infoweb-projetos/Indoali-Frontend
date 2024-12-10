import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Inicio from '../assets/inicioicon.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannericon.svg';
import Perfil from '../assets/perfilicon.svg';
import Voltar from '../assets/voltar.svg';
import Details from '../assets/details.svg';
import Lupa from '../assets/lupa.svg';
import Foto from '../assets/profileimage.jpeg';

type Amigo = {
  id: number;
  id_amigo: number;
  name: string;
  username: string;
  descricao: string;
};

type Solicitacao = {
  id: number;
  id_usuario: number;
  name: string;
  username: string;
  enviado: boolean;
  descricao: string;
}

const Amigos: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openPopper, setOpenPopper] = useState<number | null>(null);
  
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
              username: amigo.dados.userName,
              descricao: amigo.dados.descricao
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
                username: amigo.dados.userName,
                descricao: amigo.dados.descricao
              };
            }
          })
        );
    
        setAmigos(dados);
        //console.log(dados)
      } catch (error) {
        console.error('Erro ao buscar os amigos:', error);
      }
    };

    const fetchSolicitacoes = async () => {
        try {
          const id = localStorage.getItem('userId');
          const token = localStorage.getItem('token');
  
          // Faz a primeira requisição para obter os amigos do usuário
          const resposta = await axios.get("http://localhost:3000/amizades/usuario/"+id, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          
          // extrai os id de cada amigo e realiza a requisição para cada usuário adicionado
          const dados = await Promise.all(
            resposta.data.amigosdousuario
            .filter((item: { aceito: boolean }) => item.aceito === false)
            .map(async (item: { id: number; id_emissor: number; id_receptor: number }) => {
              if (item.id_emissor != Number(id)){
              const userResposta = await axios.get("http://localhost:3000/usuarios/"+item.id_emissor, {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              });
              const solicitacao = userResposta.data;
              return {
                id: item.id,
                id_usuario: item.id_emissor,
                name: solicitacao.dados.name,
                username: solicitacao.dados.userName,
                enviado: false,
                descricao: solicitacao.dados.descricao
              };
              } else {
                const userResposta = await axios.get("http://localhost:3000/usuarios/"+item.id_receptor, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                });
                const solicitacao = userResposta.data;
                return {
                  id: item.id,
                  id_usuario: item.id_receptor,
                  name: solicitacao.dados.name,
                  username: solicitacao.dados.userName,
                  enviado: true,
                  descricao: solicitacao.dados.descricao
                };
              }
            })
          );
      
          setSolicitacoes(dados);
          //console.log(dados)
        } catch (error) {
          console.error('Erro ao buscar os amigos:', error);
        }
      };

    fetchUserProfile();
    fetchAmigos();
    fetchSolicitacoes();
  }, []);

  const login = async () => {
    try {
        localStorage.clear();
        navigate('/login');
    } catch (error) {
        console.error('Erro em ir para login', error);
    }
  }

  const adicionarAmizade = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Requisição para buscar o usuário pelo username
      const response = await axios.get(`http://localhost:3000/usuarios/username/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usuario = response.data.dados;
      if (!usuario) {
        setErrorMessage('Usuário não encontrado');
        return;
      }
    
      // Crie uma solicitação de amizade
      const resp = await axios.post(
        `http://localhost:3000/amizades`,
        { id_emissor: Number(userId), id_receptor: Number(usuario.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualize a lista de solicitações enviadas
      const novasolic = resp;
      setSolicitacoes((s) => [
        ...s,
        {
          id: novasolic.data.id,
          id_usuario: usuario.id,
          name: usuario.name,
          username: usuario.userName,
          enviado: true,
          descricao: usuario.dados.descricao
        },
      ]);
      console.log(usuario)
      //alert('Solicitação de amizade enviada');
    } catch (error) {
      setErrorMessage('Erro ao enviar solicitação')
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  const apagaramizade = async (id: any) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:3000/amizades/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setAmigos((a) =>
          a.filter((item) => item.id !== id)
        );
        setSolicitacoes((s) =>
          s.filter((item) => item.id !== id)
        );
    } catch (error) {
        console.error('Erro em apagar amizade', error)
    }
  }

  const aceitaramizade = async (id: any) => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/amizades/${id}`, 
            {aceito: true},
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

        const sol = solicitacoes.find((s) => s.id === id);
        if (sol){
          const am: Amigo = {  
            id: sol.id,
            id_amigo: sol.id_usuario,
            name: sol.name,
            username: sol.username,
            descricao: sol.descricao
          };
          amigos.push(am)
        }

        setSolicitacoes((s) =>
          s.filter((item) => item.id !== id)
        );
    } catch (error) {
        console.error('Erro em aceitar amizade', error)
    }
  }

  const handleInputChange = () => {
    setErrorMessage(''); 
  };

  if (!userData) {
    //localStorage.clear();
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Usuário não cadastrado</h1>
        <a className="bg-white" onClick={login} >fazer login</a>
      </div>
    </main>;
  }

  const enviadas = solicitacoes.filter( (s) => s.enviado == true );
  const recebidas = solicitacoes.filter( (s) => s.enviado == false );

  // return (
  //   <main className="indoali">
  //     <div className="h-screen flex flex-col items-center justify-center">
  //       <h1 className="bg-white text-lg font-semibold m-[5px]">Amizades</h1>
  //       <div id="amigos" className="bg-white mt-2">
  //         <h2 className="text-g font-semibold mb-2">Seus amigos</h2>
  //         <ul>
  //         {
  //           amigos.map((item: Amigo) => {
  //             return <li key={item.id} className="bg-white">
  //               <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
  //               |
  //               <button
  //               onClick={() => apagaramizade(item.id)}
  //               className="bg-white text-g m-[5px]">remover amizade</button>
  //               </li>
  //           })
  //         }
  //         {amigos.length <= 0 && (
  //           <p>Você não tem nenhum amigo aqui</p>
  //         )}
  //         </ul>
  //       </div>
  //       <div id="s_recebidas" className="bg-white mt-2">
  //         <h2 className="text-g font-semibold mb-2">Solicitações recebidas</h2>
  //         <ul>
  //         {
  //           recebidas.map((item: Solicitacao) => {
  //             return <li key={item.id} className="bg-white">
  //               <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
  //               |
  //               <button
  //               onClick={() => aceitaramizade(item.id)}
  //               className="bg-white text-g m-[5px]">aceitar</button>
  //               |
  //               <button
  //               onClick={() => apagaramizade(item.id)}
  //               className="bg-white text-g m-[5px]">declinar</button>
  //               </li>
  //           })
  //         }
  //         {recebidas.length <= 0 && (
  //           <p>Você não tem nenhuma solicitação de amizade</p>
  //         )}
  //         </ul>
  //       </div>
  //       <div id="s_enviadas" className="bg-white mt-2">
  //         <h2 className="text-g font-semibold mb-2">Solicitações enviadas</h2>
  //         <ul>
  //         {
  //           enviadas.map((item: Solicitacao) => {
  //             return <li key={item.id} className="bg-white">
  //               <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
  //                |
  //               <button
  //               onClick={() => apagaramizade(item.id)}
  //               className="bg-white text-g m-[5px]">cancelar</button>
  //               </li>
  //           })
  //         }
  //         {enviadas.length <= 0 && (
  //           <p>Você não enviou nenhuma nova solicitação</p>
  //         )}
  //         </ul>
  //       </div>
  //       <div className="m-4">
  //         <h2 className="text-g font-semibold mb-2 bg-white">Adicionar amigo</h2>
  //         <input
  //           type="text"
  //           value={username}
  //           onChange={(e) => {setUsername(e.target.value); handleInputChange();}}
  //           placeholder="Digite o nome de usuário"
  //           className="p-2 border rounded"
  //         />
  //         <button onClick={adicionarAmizade} className="bg-white text-g m-[5px]">
  //           Adicionar Amigo
  //         </button>
  //         {errorMessage && (
  //         <p className="text-[#ff0000] text-xs text-center mt-[5px]">
  //           {errorMessage}
  //         </p>
  //         )}
  //       </div>

  //       <a className="bg-white m-[5px]" onClick={() => navigate(-1)} >voltar</a>
  //     </div>
  //   </main>
  // );

  const handleDetailsClick = (id: number) => {
    setOpenPopper(openPopper === id ? null : id);
  };

  return (
    <main className="indoali">
    <div>
      <header className="p-4 flex items-center justify-between bg-[#F7F5FF] w-screen">
        <button >
        <img className="h-5 w-5" src={Voltar} alt="Voltar à página anterior" onClick={() => navigate(-1)} />
        </button>
        <h1 className="text-lg pl-4 pr-4 text-[#2F2959] font-bold">Seus Amigos</h1>
        <div className="w-5"></div>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex items-center bg-[#E8E5F8] p-2 rounded-lg">
          <input type="text" placeholder="Procurar amigos..." className="w-full bg-[#E8E5F8] text-sm outline-none px-2 text-[#7C7A87]"/>
          <button>
            <img src={Lupa} alt="Buscar" className="w-5 h-5"/>
          </button>
        </div>

        <div className="space-y-4">
          {
            amigos.map((item: Amigo) => {
            return <div  key={item.id} className="flex items-center justify-between bg-[#F7F5FF] p-4 rounded-lg border border-[#E8E5F8] hover:border-[#BFB6F8] hover:bg-[#E8E5F8]">
            <div className="flex items-center space-x-4">
              <img src={Foto} alt={item.username} className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#E98800]">{item.name ? item.name : item.username}</h3>
                <p className="text-xs text-[#7C7A87]">@{item.username}</p>
                <button onClick={() => window.open(`/user/${item.username}`, "_self")} className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-md">Ver perfil</button>
              </div>
            </div>
            <button onClick={() => handleDetailsClick(item.id)}>
              <img src={Details} alt="info" className="w-6 h-6"/>
            </button>
          </div>
            })
          }
          {amigos.length <= 0 && (
            <div className='flex flex-col text-[#2F2959]'>
              <p className='text-center'>Você não tem nenhum amigo aqui</p>
            </div>
          )}
        </div>
        <h2 className="text-base pl-4 pr-4 text-[#2F2959] font-bold text-center">Solicitações recebidas</h2>
        <hr className="border border-[#9593A4]" />
        <div className="space-y-4">
          {
            recebidas.map((item: Solicitacao) => {
            return <div key={item.id} className="flex items-center justify-between bg-[#F7F5FF] p-4 rounded-lg border border-[#E8E5F8] hover:border-[#BFB6F8] hover:bg-[#E8E5F8]">
            <div className="flex items-center space-x-4">
              <img src={Foto} alt={item.username} className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#E98800]">{item.name ? item.name : item.username}</h3>
                <p className="text-xs text-[#7C7A87]">@{item.username}</p>
                <button onClick={() => window.open(`/user/${item.username}`, "_self")} className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-md">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src={Details} alt="info" className="w-6 h-6"/>
            </button>
          </div>
            })
          }
          {recebidas.length <= 0 && (
            <div className='flex flex-col text-[#2F2959]'>
              <p className='text-center'>Você não tem nenhuma solicitação de amizade</p>
            </div>
          )}
        </div>
        <h2 className="text-base pl-4 pr-4 text-[#2F2959] font-bold text-center">Solicitações enviadas</h2>
        <hr className="border border-[#9593A4]" />
        <div className="space-y-4">
          {
            enviadas.map((item: Solicitacao) => {
            return <div key={item.id} className="flex items-center justify-between bg-[#F7F5FF] p-4 rounded-lg border border-[#E8E5F8] hover:border-[#BFB6F8] hover:bg-[#E8E5F8]">
            <div className="flex items-center space-x-4">
              <img src={Foto} alt={item.username} className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#E98800]">{item.name ? item.name : item.username}</h3>
                <p className="text-xs text-[#7C7A87]">@{item.username}</p>
                <button onClick={() => window.open(`/user/${item.username}`, "_self")} className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-md">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src={Details} alt="info" className="w-6 h-6"/>
            </button>
          </div>
            })
          }
          {enviadas.length <= 0 && (
            <div className='flex flex-col text-[#2F2959]'>
              <p className='text-center'>Você não enviou nenhuma nova solicitação</p>
            </div>
          )}
        </div>
          {/* <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <img src="img/roge.png" alt="Iara Monyke" className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#FF9500]">Iara Monyke</h3>
                <p className="text-xs text-[#A7A7A7]">@Luv.areila</p>
                <button className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-lg">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src="img/Vector.png" alt="info" className="w-6 h-6"/>
            </button>
          </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <img src="img/roge.png" alt="Wesley" className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#FF9500]">Wesley</h3>
                <p className="text-xs text-[#A7A7A7]">@poligontunes</p>
                <button className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-lg">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src="img/Vector.png" alt="info" className="w-6 h-6"/>
            </button>
          </div>
        

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <img src="img/roge.png" alt="Josilmar" className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#FF9500]">Josilmar</h3>
                <p className="text-xs text-[#A7A7A7]">@rogeroge</p>
                <button className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-lg">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src="img/Vector.png" alt="info" className="w-6 h-6"/>
            </button>
          </div>
        

        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <img src="img/roge.png" alt="Iraikare" className="w-12 h-12 rounded-full"/>
              <div>
                <h3 className="text-sm font-semibold text-[#FF9500]">Iraikare</h3>
                <p className="text-xs text-[#A7A7A7]">@iaraoreidelas</p>
                <button className="text-sm text-white bg-[#7F6EF2] py-0,8 px-5 rounded-lg">Ver perfil</button>
              </div>
            </div>
            <button>
              <img src="img/Vector.png" alt="info" className="w-6 h-6"/>
            </button>
          </div> */}
        
      </main>
    </div>
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
    {
            amigos.map((item: Amigo) => {
            return <>
            {openPopper === item.id && (
              <>
              <div className="w-full h-full bg-black bg-opacity-50 fixed top-0 right-0 z-10" onClick={() => handleDetailsClick(item.id)}></div>
              <div className="bg-white fixed bottom-1/2 flex flex-col justify-center p-4 text-center rounded-md z-20">
                <p className="text-[#E98800] text-lg mb-1 font-semibold">{item.name ? item.name : item.username}</p>
                <p className="text-[#2F2959] text-base mb-1">@{item.username}</p>
                <div className="border border-[#7F6EF2] rounded-md m-auto mb-2 p-1" style={{ maxWidth: '17rem' }}>
                  <p className="text-[#2F2959] text-base">{item.descricao}</p>
                </div>
                <div className="flex justify-between space-x-4">
                  <button className="bg-[#7F6EF2] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-white" onClick={() => handleDetailsClick(item.id)}>Cancelar</button>
                  <button className="transparent border border-[#E98800] rounded-md pt-1 pb-1 pl-5 pr-5 mt-2 text-[#E98800]" onClick={apagaramizade}>Remover amizade</button>
                </div>
              </div>
            </> 
            )}
            </>
            })
          }
    </main>
  );
};

export default Amigos;