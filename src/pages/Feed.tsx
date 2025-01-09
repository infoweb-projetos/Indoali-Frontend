import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import Inicio from '../assets/inicioselec.svg';
import Busca from '../assets/buscaicon.svg';
import Planner from '../assets/plannericon.svg';
import Perfil from '../assets/perfilicon.svg';
import Star from '../assets/star.svg'
import Local from '../assets/localimage.jpg'
import Promocao from '../assets/imagens/imagempadrao.jpg'
import Notif from '../assets/notif.svg';
import Lupa from '../assets/lupa.svg';
// import Css from '../assets/carousel.css'
//import { useNavigate } from 'react-router-dom';

type Lugar = {
    id: number;
    descricao?: string;
    name: string;
    endereco: string;
    fotoperfil?: string;
  };

const Feed: React.FC = () => {
    const [lugares, setLugares] = useState([]);
    const [userData, setUserData] = useState<any>();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLocais = async () => {
            try {
              axios.get("http://localhost:3000/lugares").then((resposta: AxiosResponse) => {
                // console.log(resposta)
                const dados = resposta.data.lugares.map((item: { id: number; name: string; fotoperfil: string; }) => {
                  return {
                    id: item.id,
                    name: item.name,
                    fotoperfil: item.fotoperfil
                  };
                });
                setLugares(dados);
              });
            } catch (error) {
                console.error('Erro ao buscar os locais:', error);
            }
        };

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

        fetchLocais(); 
        fetchUserProfile();

        const script = document.createElement('script');

        script.src = "/src/assets/carousel.js";
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
      
    }, []);

    const IrAoPerfil = () => {
      const token = localStorage.getItem('token');
      if (!token || !userData) {
          return (<h2 className="text-lg font-bold font-[asap] text-center text-[#2F2959] underline" onClick={logout}>Faça Login</h2>); 
      } else {
        try {
          return (<h2 className="text-lg truncate pl-2 pr-2 font-bold font-[asap] text-center text-[#2F2959]">Olá, {userData.dados.name ? userData.dados.name.split(" ")[0] : userData.dados.userName.split(" ")[0]}</h2>);
        } catch {
          return (<h2 className="text-lg font-bold font-[asap] text-center text-[#2F2959] underline" onClick={logout}>Faça Login</h2>); 
        }
      }
    }

    const logout = async () => {
      try {
          localStorage.clear();
          navigate('/login');
      } catch (error) {
          console.error('Erro em sair da conta', error);
      }
    }

    return (
      <>
      <link href="/src/assets/carousel.css" rel="stylesheet" type="text/css"/>
      <header className="p-4 flex items-center justify-between bg-[#F7F5FF]">
        <div id = "logo">
          <figure>
            <img src={Star} alt = "Logo do Indoalí"/>
          </figure>
        </div>
        <IrAoPerfil/>
        <div id = "notif">
          <button>
            <img src={Notif} alt = "Notificações"/>
          </button>
        </div>
      </header>
      <main className="p-4">
        <section>
          <div className="carousel-container relative overflow-hidden rounded-lg shadow-lg max-w-md">
            <div className="carousel-track">
              <div className="carousel-slide min-w-full">
                <img src={Promocao} alt="Semana do Cinema - Slide 1" className="w-full rounded-lg"/>
              </div>
              <div className="carousel-slide min-w-full">
                <img src={Promocao} alt="Semana do Cinema - Slide 2" className="w-full rounded-lg"/>
              </div>
              <div className="carousel-slide min-w-full">
                <img src={Promocao} alt="Semana do Cinema - Slide 3" className="w-full rounded-lg"/>
              </div>
            </div>

            <div className="carousel-indicators absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              <span className="carousel-indicator w-2.5 h-2.5 bg-white bg-opacity-50 rounded-full cursor-pointer transition-all duration-300" data-slide="0"></span>
              <span className="carousel-indicator w-2.5 h-2.5 bg-white bg-opacity-50 rounded-full cursor-pointer transition-all duration-300" data-slide="1"></span>
              <span className="carousel-indicator w-2.5 h-2.5 bg-white bg-opacity-50 rounded-full cursor-pointer transition-all duration-300" data-slide="2"></span>
            </div>
          </div>
        </section>
                
        <div className="flex items-center bg-[#E8E5F8] p-2 rounded-lg shadow-sm mt-6">
          <input type="text" placeholder="Procurar por novos rolês..." className="w-full bg-[#E8E5F8] text-sm outline-none px-2 text-[#7C7A87] placeholder-[#7C7A87]"/>
          <button>
            <img src={Lupa} alt="Buscar" className="w-5 h-5"/>
          </button>
        </div>
                
        <section>
            <div className="section">
            <div className="section-header">
              <h2>🔥 Em alta!</h2>
              <a href="">ver mais +</a>
            </div>
            <div className="carousel" id="carousel-em-alta">
            {localStorage.getItem('token') ?
              lugares.map((item: Lugar) => {
                return <div className="carousel-item text-[#2F2959]" key={item.id} onClick={() => window.open(`/local/${item.id}`, "_self")} >
                        <img src={item.fotoperfil ? `http://localhost:3000/uploads/${item.fotoperfil}` : Local} alt={item.name}/>
                        <p className="max-h-10 text-ellipsis overflow-hidden text-sm" >{item.name}</p>
                      </div>
              }) : null
            }
            </div>
            </div>
        </section>
        <section>
            <div className="section">
            <div className="section-header">
              <h2>🔄 Que tal um replay?</h2>
              <a href="">ver mais +</a>
            </div>
            <div className="carousel" id="carousel-replay">
            {localStorage.getItem('token') ?
              lugares.map((item: Lugar) => {
                return <div className="carousel-item text-[#2F2959]" key={item.id} onClick={() => window.open(`/local/${item.id}`, "_self")} >
                        <img src={item.fotoperfil ? `http://localhost:3000/uploads/${item.fotoperfil}` : Local} alt={item.name}/>
                        <p className="max-h-10 text-ellipsis overflow-hidden text-sm" >{item.name}</p>
                      </div>
              }) : null
            }
            </div>
            </div>
        </section>
        <section>
          <div className="section">
          <div className="section-header">
            <h2>📍 Pertinho de você</h2>
            <a href="">ver mais +</a>
          </div>
          <div className="carousel" id="carousel-replay">
          {localStorage.getItem('token') ?
              lugares.map((item: Lugar) => {
                return <div className="carousel-item text-[#2F2959]" key={item.id} onClick={() => window.open(`/local/${item.id}`, "_self")} >
                        <img src={item.fotoperfil ? `http://localhost:3000/uploads/${item.fotoperfil}` : Local} alt={item.name}/>
                        <p className="max-h-10 text-ellipsis overflow-hidden text-sm" >{item.name}</p>
                      </div>
              }) : null
            }
          </div>
          </div>
        </section>
        <section>
          <div className="section">
          <div className="section-header">
            <h2>💸 Tá liso?</h2>
            <a href="">ver mais +</a>
          </div>
          <div className="carousel" id="carousel-replay">
          {localStorage.getItem('token') ?
              lugares.map((item: Lugar) => {
                return <div className="carousel-item text-[#2F2959]" key={item.id} onClick={() => window.open(`/local/${item.id}`, "_self")} >
                        <img src={item.fotoperfil ? `http://localhost:3000/uploads/${item.fotoperfil}` : Local} alt={item.name}/>
                        <p className="max-h-10 text-ellipsis overflow-hidden text-sm" >{item.name}</p>
                      </div>
              }) : null
            }
          </div>
          </div>
        </section>
      </main>
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
      </>
    );
}

export default Feed;