import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { EventContextProvider } from './context/EventContext';
import { LoadingContextProvider } from './context/LoadingContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EventContextProvider>
        <LoadingContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>  
        </LoadingContextProvider>
      </EventContextProvider>    
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
