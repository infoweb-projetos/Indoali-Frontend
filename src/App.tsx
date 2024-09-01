import { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import api from './services/api';

const App: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/items')
      .then((response: { data: React.SetStateAction<null>; }) => setData(response.data))
      .catch((error: any) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default App;