import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitArtifact from "./pages/SubmitArtifact";
import ArtifactDetails from "./pages/ArtifactDetails";
import EditArtifact from "./pages/EditArtifact";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitArtifact />} />
        <Route path="/artifacts/:id" element={<ArtifactDetails />} />
        <Route path="/artifacts/:id/edit" element={<EditArtifact />} />
      </Routes>
    </>
  );
}

export default App;