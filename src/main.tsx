import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Envolvemos la aplicación en BrowserRouter para el enrutamiento
    <BrowserRouter> */}
      {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
       <Provider store={store}>
        <App /> {/* Renderizamos el componente principal de la aplicación */}
      </Provider>
     {/*  <App />
    </BrowserRouter>*/}
  </React.StrictMode>
);
