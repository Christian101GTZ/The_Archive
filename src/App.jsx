/**
 * App.jsx — Main layout and routes
 *
 * Shows the Navbar on every page and picks which page to render based on the
 * URL. The last route ("*") catches any unknown address and shows NotFound.
 */
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitArtifact from "./pages/SubmitArtifact";
import ArtifactDetails from "./pages/ArtifactDetails";
import EditArtifact from "./pages/EditArtifact";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/submit" element={<SubmitArtifact />} />
        <Route path="/artifacts/:id" element={<ArtifactDetails />} />
        <Route path="/artifacts/:id/edit" element={<EditArtifact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;