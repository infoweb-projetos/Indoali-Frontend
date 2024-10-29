import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const login = async () => {
    try {
        localStorage.clear();
        navigate('/login');
    } catch (error) {
        console.error('Erro em ir para login', error);
    }
  }


  if (!userData) {
    //localStorage.clear();
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Usuário não cadastrado</h1>
        <a className="bg-white" onClick={login} >fazer login</a>
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

  return (
    <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Seu Perfil</h1>
        <p className="bg-white"><b>Nome:</b> {userData.dados.name}</p>
        <p className="bg-white"><b>Nome de usuário:</b> {userData.dados.userName}</p>
        <p className="bg-white"><b>Email:</b> {userData.dados.email}</p>
        <div id="favoritos" className="bg-white mt-2">
          <h2 className="text-g font-semibold mb-2">Seus favoritos</h2>
          <ul>
          {
            primeirosfavoritos.map((item: Favorito) => {
              return <li key={item.id} className="bg-white"><a href={`/local/${item.id_lugar}`}>{item.name}</a></li>
            })
          }
          {favoritos.length <= 0 && (
            <p>Você não favoritou nenhum lugar</p> // Redireciona para uma página com todos os favoritos
          )}
          </ul>
          {favoritos.length > 5 && (
            <a href="/favoritos">Ver mais+</a>
          )}
        </div>
        <div id="amigos" className="bg-white mt-2">
          <h2 className="text-g font-semibold mb-2">Seus amigos</h2>
          <ul>
          {
            primeirosamigos.map((item: Amigo) => {
              return <li key={item.id} className="bg-white"><a href={`/${item.username}`}>{item.name ? item.name : item.username}</a></li>
            })
          }
          {amigos.length <= 0 && (
            <p>Você não tem nenhum amigo aqui</p>
          )}
          </ul>
          {amigos.length > 5 && (
            <a href="/amigos">Ver mais+</a> // Redireciona para uma página com todos os amigos
          )}
        </div>
        <a className="bg-white mt-[5px]" href="/profile/edit" >editar perfil</a>
        <a className="bg-white mt-[5px]" onClick={logout} >sair</a>
        <a className="bg-white m-[5px]" href="/" >início</a>
      </div>
    </main>
  );
};

export default UserProfile;