import { Routes, Route } from "react-router-dom";
import AppPublic from "./AppPublic";


export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<AppPublic />} />
    </Routes>
  );
}
