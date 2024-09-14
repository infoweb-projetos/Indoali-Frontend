import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
//import LogoWhite from "../assets/logowhite.svg"

const Local: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [local, setLocal] = useState<any>(null);

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

    fetchLocal();
  }, [id]);

  if (!local) {
    return <div>Carregando...</div>;
  }

  return (
    <main className="indoali">
        <div  className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">{local.dados.name}</h1>
            <p className="bg-white">{local.dados.descricao}</p>
            <p className="bg-white"><b>Localização:</b> {local.dados.endereco}</p>
            <a className="bg-white m-[5px]" href="/" >início</a>
        </div>
    </main>
  );
};

export default Local;