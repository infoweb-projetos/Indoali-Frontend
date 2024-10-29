import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OutroUsuario: React.FC = () => {
    //const navigate = useNavigate();
    const { userName } = useParams<{ userName: string }>();
    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            //const id = localStorage.getItem('userId');
            
            if (!token) {
            throw new Error('Usuário não autenticado');
            }

            const response = await axios.get('http://localhost:3000/usuarios/username/'+userName, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            //console.log(response.data)

            setUserData(response.data);

            //console.log(userData)
            } catch (error) { 
                console.error('Erro ao buscar perfil do usuário:', error);
            }
        };

        fetchUserProfile();
        }, []);

        if (!userData) {
        //localStorage.clear();
        return <main className="indoali">
            <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">O usuário @{userName} não existe</h1>
            </div>
        </main>;
        }

    return (
    <main className="indoali">
        <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="bg-white text-lg font-semibold m-[5px]">Perfil do Usuário</h1>
        { userData.dados.name && (<p className="bg-white"><b>Nome:</b> {userData.dados.name}</p>)}
        <p className="bg-white"><b>Nome de usuário:</b> {userData.dados.userName}</p>
        <p className="bg-white"><b>Email:</b> {userData.dados.email}</p>
        <a className="bg-white m-[5px]" href="/" >início</a>
        </div>
    </main>
    )
};

export default OutroUsuario;