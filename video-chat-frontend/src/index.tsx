import React from 'react';
import axios from "axios";
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import "./index.css"
import Modal from 'react-modal';

const MyTheme = {
  color: {
    bgColor: "#f3efe4",
    textColor: "#665c54",
    borderColor: "#928374",
    clickColor: "#689d6a",
    navColor: "#1d2021",
    navTextColor: "white",
    btnColor: "#645943",
    tableBorderColor: "#dadfec",
    tableBgColor: "#ecf0fa",
  },
  font: "Noto Sans CJK KR"
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={MyTheme}>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);

Modal.setAppElement('#root');
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';