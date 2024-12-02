import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import LogoWhite from "../assets/logowhite.svg"
import FavoritoIcon from "../assets/heart_purple_fill.svg";
import NaoFavoritoIcon from "../assets/heart_purple_line.svg";

const Local: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [local, setLocal] = useState<any>(null);
  const [isFavoritado, setIsFavoritado] = useState<boolean>(false);
  const navigate = useNavigate()

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

  if (!local) {
    return <main className="indoali">
      <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...</h1>
      </div>
    </main>;
  }

  return (
    <main className="indoali">
        <div  className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">{local.dados.name}</h1> 
            <p className="bg-white">{local.dados.descricao}</p>
            <p className="bg-white"><b>Localização:</b> {local.dados.endereco}</p>

            <button onClick={handleFavoritar} className="bg-white p-[5px]">
              <img src={isFavoritado ? FavoritoIcon : NaoFavoritoIcon} alt="Favoritar" width={24} height={24} />
            </button>

            <a className="bg-white m-[5px]" onClick={() => navigate(-1)} >voltar</a>
        </div>
    </main>
  );
};

export default Local;