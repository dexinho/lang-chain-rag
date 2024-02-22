import React, { useEffect, useState } from "react";

const Message = ({ message, isLastMessage, picUrl }) => {
  const [messageDisplay, setMessageDisplay] = useState("");
  const [index, setIndex] = useState(0);
  console.log(isLastMessage);
  useEffect(() => {
    if (!isLastMessage) {
      setMessageDisplay(message);
      return;
    }

    const messageTimeoutId = setTimeout(() => {
      setMessageDisplay(messageDisplay + message[index]);
      setIndex(index + 1);
    }, 10);

    if (index === message.length) clearTimeout(messageTimeoutId);

    return () => clearTimeout(messageTimeoutId);
  }, [index]);

  return (
    <div className="flex gap-4 flex-row border p-4 rounded-2xl">
      <div>
        <img className="w-10 h-10 rounded-2xl" src={picUrl} />
      </div>
      <div>{messageDisplay}</div>
    </div>
  );
};

export default Message;
