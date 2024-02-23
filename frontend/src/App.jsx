import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import Upload from "./Components/Upload/Upload";
import Message from "./Components/Message/Message";
import { useEffect, useState, useRef } from "react";

import robotImage from "./assets/robot.jpg";
import userImage from "./assets/user.png";
import fetchData from "./utility/fetchData";

function App() {
  const [messages, setMessages] = useState([
    { role: "system", content: "How may I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const messagesBoxRef = useRef(null);
  const inputRef = useRef(null);

  const handleMessageChange = (e) => {
    setInput(e.target.value);
  };

  const handleMessageKey = async (e) => {
    try {
      if (e.key !== "Enter" || isFetching) return;

      setMessages((prevM) => [...prevM, { role: "user", content: input }]);
      setInput("");

      const url = "http://localhost:3000/message";
      const body = {
        method: "POST",
        body: JSON.stringify({ input }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await fetchData({ url, body, isFetching, setIsFetching });
      const data = await res.json();

      setMessages((prevM) => [
        ...prevM,
        { role: "system", content: data.kwargs.content },
      ]);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <Box className="container p-4 m-auto">
      <Box className="flex flex-col gap-4 w-3/5 m-auto justify-center items-center">
        <Typography variant="h3">Chatinho</Typography>
        <Box
          ref={messagesBoxRef}
          className="flex flex-col gap-4 p-4 border w-full min-h-32 max-h-96 overflow-y-auto"
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              className="border rounded-2xl p-4"
              message={message.content}
              picUrl={message.role === "system" ? robotImage : userImage}
              isLastMessage={
                index + 1 === messages.length && messages.length % 2
              }
              messagesBoxRef={messagesBoxRef}
            />
          ))}
          {isFetching && <CircularProgress className="m-auto" />}
        </Box>
        <TextField
          className="w-full"
          variant="standard"
          onChange={handleMessageChange}
          onKeyDown={handleMessageKey}
          inputRef={inputRef}
          value={input}
          placeholder="ask anything..."
        ></TextField>
        <Upload />
      </Box>
    </Box>
  );
}

export default App;
