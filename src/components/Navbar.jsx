import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <ul className="p-2 bg-vag-secondary list-none flex gap-4 items-center shadow-md">
      <li>
        <img className="size-[50px]" src="/logo.png" alt="logo" />
      </li>
      <li className="hover:opacity-65">
        <Link to={"/"}>Home</Link>
      </li>
      <li className="hover:opacity-65">
        <Link to={"/VideoGenerate"}>Video Generate</Link>
      </li>
      <li className="hover:opacity-65">
        <Link to={"/About"}>About</Link>
      </li>
    </ul>
  );
};

export default Navbar;
