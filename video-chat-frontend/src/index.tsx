import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import "./index.css"
import Modal from 'react-modal';

const ThemeColor = {
  bgColor: "#ebdbb2",
  textColor: "#665c54",
  borderColor: "#928374",
  clickColor: "#689d6a",
  navColor: "#1d2021",
  navTextColor: "white",
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={ThemeColor}>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);

Modal.setAppElement('#root');