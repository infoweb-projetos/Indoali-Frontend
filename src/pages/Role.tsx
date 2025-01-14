import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Inicio from '../assets/inicioicon.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannericon.svg';
import Perfil from '../assets/perfilicon.svg';
import Voltar from '../assets/voltar.svg';
import LocalIcon from '../assets/pin.png';
import HorarioIcon from '../assets/relogio.png';
import ParticipantesIcon from '../assets/participantes.svg';
import CoroaIcon from '../assets/coroa.svg';
import Foto from '../assets/profileimage.jpeg';

type User = {
    userName: string;
    fotoperfil: string;
    criador: boolean;
}

type Local = {
    id: number;
    name: string;
    fotoperfil: string;
}

const Role: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [role, setRole] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [local, setLocal] = useState<Local | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/roles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response.data.dados)
                setRole(response.data.dados);
            } catch (error) {
                console.error('Erro ao buscar os detalhes do role:', error);
            }
        };
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/roles/${id}/users`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userIds: string[] = response.data.todosUsuarios.split(' ');
                console.log(userIds)
                const users = await Promise.all(
                    userIds.map(async (userId, index) => {
                      const userResponse = await axios.get(`http://localhost:3000/usuarios/${userId}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                        return {
                            userName: userResponse.data.dados.userName,
                            fotoperfil: userResponse.data.dados.fotoperfil,
                            criador: index === 0
                        };
                    })
                  );
                console.log(users)
                setUsers(users)
            } catch (error) {
                console.error('Erro ao buscar os usuarios do role:', error);
            }
        };
        fetchRole();
        fetchUsers();
    }, [id]);

    useEffect(() => {
        const fetchLocal = async () => {
          if (role && role.id_lugar) {
            try {
              const response = await axios.get(`http://localhost:3000/lugares/${role.id_lugar}`);
              console.log(response.data.dados);
              setLocal(response.data.dados);
            } catch (error) {
              console.error('Erro ao encontrar o local do role:', error);
            }
          }
        };
    
        fetchLocal();
      }, [role]);

    if (!role || !local) {
        return <main className="indoali">
            <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...</h1>
            </div>
        </main>;
    }

    return <main>
    <header className="p-4 flex items-center justify-between bg-[#F7F5FF] w-screen">
        <button >
            <img className="h-5 w-5" src={Voltar} alt="Voltar à página anterior" onClick={() => navigate(-1)} />
        </button>
        <h1 className="text-lg truncate pl-2 pr-2 text-[#2F2959] text-center font-bold">{role.titulo}</h1>
        <div className="w-5"></div>
    </header>
    <section className="p-4">
      <div className="mb-6">
          <div className="flex items-center">
              <img className="pr-2 w-5" src={LocalIcon}/>
              <h3 className="text-lg italic text-[#7F6EF2]">Local</h3>
          </div>
          <div className="shadow-lg p-1 mb-2 rounded-xl bg-[#F7F5FF]" onClick={() => window.open(`/local/${local.id}`, "_self")}>
              <div className="flex text-sm rounded-xl items-center p-3">
                  <img className="rounded-full mr-2 w-10 h-10" src={`http://localhost:3000/uploads/${local.fotoperfil}`}/>
                  <h2 className="truncate text-lg text-[#FF9500]">{local.name}</h2>
              </div>
          </div>
      </div>
      <div className="mb-6">
          <div className="flex items-center mb-2">
              <img className="pr-2 w-6" src={HorarioIcon}/>
              <h3 className="text-lg italic text-[#7F6EF2]">Data e hora</h3>
          </div>
          <div className="flex justify-between text-[#2F2959] ">
            <p>
                {role.diasemana + " - "}
                {new Date(role.datahora).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                })}
            </p>
            <p>
            <b>
                {`${role.datahora.split(":")[0].split("T")[1]}:${role.datahora.split(":")[1]}`} 
            </b>
            </p>
          </div>
      </div>
      <div className="mb-6">
          <div className="flex items-center mb-2">
              <img className="pr-2 w-6" src={ParticipantesIcon}/>
              <h3 className="text-lg italic text-[#7F6EF2]">Participantes</h3>
          </div>
          <div className="grid grid-cols-4 gap-5">
              {users.map((user, index) => (
                <div key={index} className="text-center">
                    <a href={`/user/${user.userName}`}>
                        {user.criador ? <img className="absolute w-4 mb-2" style={{marginLeft: "2.75rem"}} src={CoroaIcon}/> : null}
                        <img className="w-12 h-12 rounded-full m-auto" src={user.fotoperfil ? `http://localhost:3000/uploads/${user.fotoperfil}` : Foto} alt={`${user.userName}`} />
                        <p className="max-h-8 text-ellipsis overflow-hidden text-xs text-[#2F2959]">{`@${user.userName}`}</p>
                    </a>
                </div>
              ))}
              {/* <div className="text-center">
                  <img className="absolute w-4 ml-8 mb-2" src={CoroaIcon}/>
                  <img className="w-12 h-12 rounded-full" src="img/profileimage.jpeg" alt="Amigo 1"/>
                  <p className="text-xs text-[#868686]">@cossito</p>
              </div>
              <div className="text-center">
                  <img className="w-12 h-12 rounded-full" src="img/profileimage.jpeg" alt="Amigo 2"/>
                  <p className="text-sm text-[#868686]">@iarao</p>
              </div>
              <div className="text-center">
                  <img className="w-12 h-12 rounded-full" src="img/profileimage.jpeg" alt="Amigo 3"/>
                  <p className="text-sm text-[#868686]">@luzia</p>
              </div>
              <div className="text-center">
                  <img className="w-12 h-12 rounded-full" src="img/profileimage.jpeg" alt="Amigo 4"/>
                  <p className="text-sm text-[#868686]">@kuabrs</p>
              </div>
              <div className="text-center">
                  <img className="w-12 h-12 rounded-full" src="img/profileimage.jpeg" alt="Amigo 5"/>
                  <p className="text-sm text-[#868686]">@loona</p>
              </div> */}
            </div>
      </div>
      <div className="flex justify-center">
          <button className="p-2 rounded-full border-2 border-[#F02929] text-[#F02929]">
              <p className="px-4">Sair do rolê</p>
          </button>
      </div>
    </section>
    <section>
        <footer className="p-12"></footer>
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
            <button className="flex flex-col items-center text-[#7F6EF2]" onClick={() => window.open("/planner", "_self")}>
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
}

export default Role