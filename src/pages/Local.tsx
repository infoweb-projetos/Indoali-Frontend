import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import LogoWhite from "../assets/logowhite.svg"
import FavoritoIcon from "../assets/heart_purple_fill.svg";
import NaoFavoritoIcon from "../assets/heart_purple_line.svg";
import VoltarIcon from "../assets/voltar.svg";
// import EstrelaIcon from "../assets/estrela.png";
import PinIcon from "../assets/pin.png";
import RelogioIcon from "../assets/relogio.png";
import TelefoneIcon from "../assets/telefone.png";
import FacebookIcon from "../assets/facebook.png";
import InstagramIcon from "../assets/instagram.png";
import FogoIcon from "../assets/fogo.png";
import CameraIcon from "../assets/camera.png";
import PadraoImg from "../assets/imagens/imagempadrao.jpg";
import Fechar from "../assets/x.svg";

const Local: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [local, setLocal] = useState<any>(null);
  const [isFavoritado, setIsFavoritado] = useState<boolean>(false);
  const navigate = useNavigate()
  const [openPopper, setOpenPopper] = useState<number | null>(null);

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/lugares/${id}`);
        //console.log(response)
        setLocal(response.data);
      } catch (error) {
        console.error('Erro ao buscar os detalhes do local:', error);
      }
    };

    const checkIfFavoritado = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/favoritos/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favoritos = response.data.favoritosdousuario;
        //console.log(favoritos)
        //console.log(id)
        setIsFavoritado(favoritos.some((fav: { id_lugar: number | string }) => fav.id_lugar.toString() === id ));
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      }
      //console.log(isFavoritado)
    };

    fetchLocal();
    checkIfFavoritado();
  }, [id]);

  const handleFavoritar = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      if (isFavoritado) {
        const favoritoResponse = await axios.get(`http://localhost:3000/favoritos/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favorito = favoritoResponse.data.favoritosdousuario.find(
          (fav: { id_lugar: number | string }) => fav.id_lugar.toString() === id 
        );
        await axios.delete(`http://localhost:3000/favoritos/${favorito.id}`, {
          data: { id_usuario: userId, id_lugar: id },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          'http://localhost:3000/favoritos',
          { id_usuario: Number(userId), id_lugar: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFavoritado(!isFavoritado);
    } catch (error) {
      console.error('Erro ao (des)favoritar o local:', error);
    }
  };

  const handleDetailsClick = (id: number) => {
    setOpenPopper(openPopper === id ? null : id);
  };

  if (!local) {
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...</h1>
      </div>
    </main>;
  }

  return (
  <main className="indoali">
    <section style={{backgroundImage: `url(${local.dados.fotoperfil ? `http://localhost:3000/uploads/${local.dados.fotoperfil}` : PadraoImg})`}} className="p-4 h-48 w-full flex flex-col justify-between shadow-md bg-cover bg-center">
      <div className="absolute h-48 top-0 left-0 w-full bg-gradient-to-t from-black/50"></div>
      <a className="bg-white w-8 h-8 rounded-full drop-shadow content-center items-center" onClick={() => navigate(-1)} >
        <img  className="mx-auto" width="16px" src={VoltarIcon} alt="Voltar" />
      </a>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white drop-shadow">{local.dados.name}</h2>
        <button onClick={handleFavoritar} className="bg-white w-10 h-10 rounded-full drop-shadow content-center items-center">
          <img className="mx-auto" width="22px" src={isFavoritado ? FavoritoIcon : NaoFavoritoIcon} />
        </button>
      </div>
    </section>
    <section className="p-4 w-full rounded-b-2xl shadow bg-[#F7F5FF]">
      <p className="text-[#7C7A87] mb-2">Informações</p>
      {/* <div className="my-2 flex items-center">
        <img className="w-4 h-4" src={EstrelaIcon}/>
        <p className="ml-1 mr-2 text-[#2F2959]"><b>3.7</b></p>
        <a href="">
          <p className="text-[#2F2959]"><u>Ver avaliações</u></p>
        </a>
      </div> */}
      <div className="mb-2 flex items-center" onClick={() => window.open(`https://www.google.com.br/maps/search/${local.dados.endereco}`, "_blank")}>
        <img className="w-3.5 h-4 mr-2" src={PinIcon} />
        <p className="text-[#7F6EF2] hover:underline hover:text-[#2F2959] pb-rs">{local.dados.endereco}</p>
      </div>
      {local.dados.horarios ? 
      <div className="mb-2 flex items-center">
        <img className="w-4 h-4 mr-2" src={RelogioIcon} />
        <p className="text-[#7F6EF2] hover:text-[#2F2959] pb-rs">{local.dados.horarios}</p>
      </div> : null
      }
      {local.dados.numero ? 
      <div className="mb-2 flex items-center">
        <img className="w-4 h-4 mr-2" src={TelefoneIcon} />
        <p className="text-[#7F6EF2] hover:text-[#2F2959] pb-rs">{local.dados.numero}</p>
      </div> : null
      }
      {local.dados.facebook || local.dados.instagram ?
      <ul className="flex justify-end">
        {local.dados.facebook ?
        <li className="mr-2 bg-white w-10 h-10 rounded-full drop-shadow content-center items-center">
          <a href={local.dados.facebook} target="_blank">
            <img className="mx-auto" src={FacebookIcon} width="20px" alt="Facebook" />
          </a>
        </li> : null
        }
        {local.dados.instagram ?
        <li className="bg-white w-10 h-10 rounded-full drop-shadow content-center items-center">
          <a href={local.dados.instagram} target="_blank">
            <img className="mx-auto" src={InstagramIcon} width="20x" alt="Instagram" />
          </a>
        </li> : null
        }
      </ul> : null
      }
    </section>
    {local.dados.descricao || local.dados.promocao || local.dados.galeria ?
    <section className="w-full p-4">
      {local.dados.descricao?<p className="text-[#2F2959] mb-4">{local.dados.descricao}</p>:null}
      {local.dados.promocao ?
        <div className="flex flex-col italic text-[#E98800] mb-4">
          <div className="flex items-center mb-2">
            <img src={FogoIcon} className="mr-2 w-3.5 h-4" />
            <h3>Promoção</h3>
          </div>
          <picture>
            <img className="rounded-lg w-full" src={`http://localhost:3000/uploads/${local.dados.promocao}`} alt="Promoção" />
          </picture>
        </div>
        : null
      }
      {local.dados.galeria ?
        <div className="flex flex-col italic text-[#7C7A87]">
          <div className="flex items-center mb-2">
            <img src={CameraIcon} className="mr-2 w-4 h-3.5" />
            <h3>Galeria</h3>
          </div>
          <div className="carousel carousel-center space-x-4 flex overflow-x-auto">
            {local.dados.galeria.split(" ").length > 1 ? 
              local.dados.galeria.split(" ").map((imageSrc : string, index : number) => (
                <>
                  <div key={index} className="carousel-item shrink-0 w-9/12" onClick={() => handleDetailsClick(index)}>
                    <img className="rounded-lg h-48 w-full object-cover" src={`http://localhost:3000/uploads/${imageSrc}`} alt={`Imagem ${index + 1}`} />
                  </div>
                </>
              )) :
              <div className="carousel-item shrink-0 w-full" onClick={() => handleDetailsClick(0)}>
                <img className="rounded-lg object-cover" src={`http://localhost:3000/uploads/${local.dados.galeria}`} alt="Imagem"/>
              </div>
            }
          </div>
        </div>
        : null
      }
    </section>
    : null }
    {local.dados.galeria ? local.dados.galeria.split(" ").map((imageSrc : string, index : number) => (
      openPopper == index ?
      <>
        <div className="w-full h-full bg-black bg-opacity-50 fixed top-0 right-0 z-10" onClick={() => handleDetailsClick(index)}></div>
        <div key={index} className="carousel-item  fixed shrink-0 z-20 pl-4 pr-4 top-1/2 -translate-y-2/4">
          <img className="w-full object-cover" src={`http://localhost:3000/uploads/${imageSrc}`} alt={`Imagem ${index + 1}`} />
        </div> 
        <div className="fixed top-0 z-30 right-0 p-4" onClick={() => handleDetailsClick(index)}>
          <div className="bg-black bg-opacity-20 w-8 h-8 rounded-full flex content-center items-center">
            <img className="mx-auto" width="16px" src={Fechar} />
          </div>
        </div>
      </> : null
    )) : null}
  </main>
  );
};

export default Local;