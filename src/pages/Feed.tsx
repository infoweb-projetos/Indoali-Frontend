import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
//import { useNavigate } from 'react-router-dom';

const IrAoPerfil = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return (<a className="bg-white" href="/login" >Login</a>);
    } else {
        return (<a className="bg-white" href="/profile" >Seu perfil</a>);
    }
}

type Lugar = {
    id: number;
    descricao?: string;
    name: string;
    endereco: string;
  };

const Feed: React.FC = () => {
    const [lugares, setLugares] = useState([]);

    useEffect(() => {
        const fetchLocais = async () => {
            try {
              axios.get("http://localhost:3000/lugares").then((resposta: AxiosResponse) => {
                // console.log(resposta)
                const dados = resposta.data.lugares.map((item: { id: number; name: string; }) => {
                  return {
                    id: item.id,
                    name: item.name,
                  };
                });
                setLugares(dados);
              });
            } catch (error) {
                console.error('Erro ao buscar os locais:', error);
            }
        };

        fetchLocais(); 
    }, []);

    return (
        <main className="indoali">
            <div className="h-screen flex flex-col items-center justify-center">
                <h1 className="bg-white text-lg font-semibold m-[5px]">Home</h1>
                <IrAoPerfil />
                <div className="mt-5">
                    <h2 className="bg-white text-g font-semibold mb-2">Locais Disponíveis:</h2>
                    <ul>
                    {
                      lugares.map((item: Lugar) => {
                        return <li key={item.id} className="bg-white"><a href={`/local/${item.id}`}>{item.name}</a></li>
                      })
                    }
                    </ul>
                </div>
            </div>
        </main>
    );
}

export default Feed;