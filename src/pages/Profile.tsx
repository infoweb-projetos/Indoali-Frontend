import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Favorito = {
  id: number;
  id_lugar: number;
  name: string;
};
// type Amigo = {
//   id: number;
//   id_emissor: number;
//   id_receptor: number;
// };

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  
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

  useEffect(() => {
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

      fetchFavoritos(); 
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

  return (
    <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Perfil do Usuário</h1>
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
          </ul>
          {favoritos.length > 5 && (
            <a href="/favoritos">Ver mais+</a> // Redireciona para uma página com todos os favoritos
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