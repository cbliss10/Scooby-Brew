import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ConfigPage } from "./components/configure/ConfigPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import Layout from "./components/common/layout";
import { BrewPage } from "./components/brew/BrewPage";
import { WebSocketContextProvider } from "./context/websocketContext";

function App() {
  return (
    <WebSocketContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<BrewPage />} />
            <Route path="/config" element={<ConfigPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </WebSocketContextProvider>
  );
}

export default App;
