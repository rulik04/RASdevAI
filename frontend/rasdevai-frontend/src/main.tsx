import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./states/store";
import "./assets/styles/global.scss";
import "antd/dist/reset.css";
import "./fonts/Montserrat/Montserrat-VariableFont_wght.ttf";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
