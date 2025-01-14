import React, { useEffect, useState } from "react";

const MessageWelcome = () => {
  const message = "Welcome to us!";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(displayedText + message[index]);
        setIndex(index + 1);
      }, 200); // 200ms delay for each character
      return () => clearTimeout(timeout); // Cleanup the timeout if component unmounts
    }
  }, [index, displayedText, message]);
  return <div className="text-[2rem] text-center my-4">{displayedText}</div>;
};

export default MessageWelcome;
