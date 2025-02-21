import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Portfolio from "./pages/Portfolio/Portfolio";
import Market from "./pages/Market/Market";
import News from "./pages/News/News";
import Tutorial from "./pages/Tutorial/Tutorial";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/market" element={<Market />} />
                <Route path="/news" element={<News />} />
                <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
        </Router>
    );
}

export default App;
