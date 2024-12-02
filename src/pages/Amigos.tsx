import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Amigo = {
  id: number;
  id_amigo: number;
  name: string;
  username: string;
};

type Solicitacao = {
  id: number;
  id_usuario: number;
  name: string;
  username: string;
  enviado: boolean;
}

const Amigos: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  
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
                enviado: false
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
                  enviado: true
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
            username: sol.username
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

  return (
    <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Amizades</h1>
        <div id="amigos" className="bg-white mt-2">
          <h2 className="text-g font-semibold mb-2">Seus amigos</h2>
          <ul>
          {
            amigos.map((item: Amigo) => {
              return <li key={item.id} className="bg-white">
                <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
                |
                <button
                onClick={() => apagaramizade(item.id)}
                className="bg-white text-g m-[5px]">remover amizade</button>
                </li>
            })
          }
          {amigos.length <= 0 && (
            <p>Você não tem nenhum amigo aqui</p>
          )}
          </ul>
        </div>
        <div id="s_recebidas" className="bg-white mt-2">
          <h2 className="text-g font-semibold mb-2">Solicitações recebidas</h2>
          <ul>
          {
            recebidas.map((item: Solicitacao) => {
              return <li key={item.id} className="bg-white">
                <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
                |
                <button
                onClick={() => aceitaramizade(item.id)}
                className="bg-white text-g m-[5px]">aceitar</button>
                |
                <button
                onClick={() => apagaramizade(item.id)}
                className="bg-white text-g m-[5px]">declinar</button>
                </li>
            })
          }
          {recebidas.length <= 0 && (
            <p>Você não tem nenhuma solicitação de amizade</p>
          )}
          </ul>
        </div>
        <div id="s_enviadas" className="bg-white mt-2">
          <h2 className="text-g font-semibold mb-2">Solicitações enviadas</h2>
          <ul>
          {
            enviadas.map((item: Solicitacao) => {
              return <li key={item.id} className="bg-white">
                <a className="m-[5px]" href={`/user/${item.username}`}>{item.name ? item.name : item.username}</a>
                 |
                <button
                onClick={() => apagaramizade(item.id)}
                className="bg-white text-g m-[5px]">cancelar</button>
                </li>
            })
          }
          {enviadas.length <= 0 && (
            <p>Você não enviou nenhuma nova solicitação</p>
          )}
          </ul>
        </div>
        <div className="m-4">
          <h2 className="text-g font-semibold mb-2 bg-white">Adicionar amigo</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => {setUsername(e.target.value); handleInputChange();}}
            placeholder="Digite o nome de usuário"
            className="p-2 border rounded"
          />
          <button onClick={adicionarAmizade} className="bg-white text-g m-[5px]">
            Adicionar Amigo
          </button>
          {errorMessage && (
          <p className="text-white text-xs text-center mt-[5px]">
            {errorMessage}
          </p>
          )}
        </div>

        <a className="bg-white m-[5px]" onClick={() => navigate(-1)} >voltar</a>
      </div>
    </main>
  );
};

export default Amigos;