// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css"

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet /> {/* this will render the child route component */}
      </main>
    </>
  );
};

export default Layout;
