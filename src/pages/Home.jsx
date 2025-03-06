import { useEffect, useState } from "react";
import MessageWelcome from "@/components/MessageWelcome";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
const Home = () => {
  return (
    <div>
      <MessageWelcome />
    </div>
  );
};

export default Home;
