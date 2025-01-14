import MessageWelcome from "@/components/MessageWelcome";
import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router";

const Default = () => {
  return (
    <div className="w-full min-h-screen bg-vag-primary">
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Default;
