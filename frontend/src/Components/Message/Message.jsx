import React, { useEffect, useState } from "react";

const Message = ({ message, isLastMessage, picUrl, messagesBoxRef }) => {
  const [messageDisplay, setMessageDisplay] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isLastMessage) {
      setMessageDisplay(message);
      return;
    }

    
    const messageTimeoutId = setTimeout(() => {
      setMessageDisplay(messageDisplay + message[index]);
      setIndex(index + 1);

      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }, 10);

    if (index === message.length) clearTimeout(messageTimeoutId);

    return () => clearTimeout(messageTimeoutId);
  }, [index]);

  return (
    <div
      className="grid gap-4 grid-cols-2 p-4 border rounded-2xl"
      style={{ gridTemplateColumns: "50px 1fr" }}
    >
      <div>
        <img className="w-full h-10 rounded-2xl" src={picUrl} />
      </div>
      <div>{messageDisplay}</div>
    </div>
  );
};

export default Message;
