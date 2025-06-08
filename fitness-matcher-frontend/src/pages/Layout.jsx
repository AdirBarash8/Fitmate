// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* this will render the child route component */}
      </main>
    </>
  );
};

export default Layout;
