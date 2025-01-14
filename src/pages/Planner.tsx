import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notif from '../assets/notif.svg';
import Inicio from '../assets/inicioicon.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannerselec.svg';
import Perfil from '../assets/perfilicon.svg';
import Star from '../assets/star.svg';
import Mais from '../assets/add.svg';
import Foto from '../assets/profileimage.jpeg';

type Role = {
  id: number;
  titulo: string;
  datahora: string;
  diasemana: string;
  participantes: string[];
}

const PlannerRoles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');

        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await axios.get(`http://localhost:3000/roles/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //console.log(response)

        const rolesData: Role[] = await Promise.all(
          response.data.roles.map(async (role: any) => {
            const participantesComFotos = await Promise.all(
              role.participantes.todosUsuarios.split(" ").map(async (part: string) => {
                const responseUser = await axios.get(`http://localhost:3000/usuarios/${part}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                return responseUser.data.dados.fotoperfil;
              })
            );
            console.log(participantesComFotos)
            return {
              id: role.id,
              titulo: role.titulo,
              diasemana: role.diasemana,
              datahora: role.datahora,
              participantes: participantesComFotos,
            };
          })
        );


        setRoles(rolesData);
        console.log(rolesData)
      } catch (error: any) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('Token inválido ou expirado. Redirecionando para login...');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        } else {
          console.error('Erro ao buscar rolês do usuário:', error);
        }
      }
    };

    fetchRoles();
  }, [navigate]);

return (
    <main>
      <header className="p-4 flex items-center justify-between bg-[#F7F5FF]">
        <div id = "logo">
          <figure>
            <img src={Star} alt = "Logo do Indoalí"/>
          </figure>
        </div>
        <h2 className="text-lg truncate pl-2 pr-2 font-bold font-[asap] text-center text-[#2F2959]">Seus rolês</h2>
        <div id = "notif" className="flex pl-2">
          <button>
            <img src={Notif} alt = "Notificações"/>
          </button>
        </div>
      </header>
      <section className="p-4">
        {roles.map((item: Role) => {
        return <div key={item.id} className="shadow-lg p-1 text-[#7C7A87] bg-[#F7F5FF] mb-2 rounded-xl">
          <div className="flex text-sm rounded-xl bg-white border-2 border-[#FF9500] items-center p-3 justify-between">
              <div className="max-w-3/20 flex items-center text-sm justify-between">
                <p className='mr-2'><b>{item.diasemana}. {`${item.datahora.split("-")[2].split("T")[0]}`}</b></p>
                <p>20h</p>
              </div>
              <div className="truncate pl-2 pr-2 max-w-50porcento">
                <p className="truncate text-center">{item.titulo}</p>
              </div>
              <div className="flex pl-2">
                <img className="rounded-full -mr-1 w-6 h-6" src={item.participantes[0] != null ? `http://localhost:3000/uploads/${item.participantes[0]}` : Foto}/>
                <img className="rounded-full -mr-1 w-6 h-6" src={item.participantes[1] != null ? `http://localhost:3000/uploads/${item.participantes[1]}` : Foto}/>
                {item.participantes.length == 3 ?
                  <img className="rounded-full -mr-1 w-6 h-6" src={item.participantes[2] != null ? `http://localhost:3000/uploads/${item.participantes[2]}` : Foto}/> : null
                }
                {item.participantes.length > 3 ?
                <div className="flex justify-center w-6 h-6 font-semibold text-white bg-cover rounded-full"
                    style={{background: `linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)), url(${item.participantes[2] != null ? `http://localhost:3000/uploads/${item.participantes[2]}` : Foto})`,
                            backgroundSize: 'cover',}}>
                    <p className="my-auto w-6 text-center">+{item.participantes.length - 3}</p>
                </div> : null
                }
              </div>
          </div>
        </div>
          })
        }
      </section>
      <button className="bg-[#F7F5FF] rounded-lg p-4 fixed shadow-md bottom-20 right-4"><img src={Mais}/></button>
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
    );
}

export default PlannerRoles;