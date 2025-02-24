import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <ul className="p-4 bg-vag-secondary text-[1.5rem] list-none flex gap-2 items-center shadow-md">
      <li>
        <img className="size-[50px]" src="/logo.png" alt="logo" />
      </li>
      <li className="hover:opacity-65 p-2">
        <Link to={"/"}>HOME</Link>
      </li>
      <li className="hover:opacity-65 p-2">
        <Link to={"/VideoGenerate"}>VIDEO GENERATE</Link>
      </li>
      <li className="hover:opacity-65 p-2">
        <Link to={"/About"}>ABOUT</Link>
      </li>
    </ul>
  );
};

export default Navbar;
