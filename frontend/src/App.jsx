import { Box } from "@mui/material";
import Upload from "./Components/Upload/Upload";
import Message from "./Components/Message/Message";
import { useState } from "react";

function App() {
  const [messages, setMessages] = useState({});
  const [isLastMessage, setIsLastMessage] = useState(false);

  return (
    <>
      <Box className="container">
        <Box>
          <Box className="flex flex-col gap-4 p-4">
            {messages.map((message, index) => {
              <Message
                className="border rounded-2xl p-4"
                message={message}
                isLastMessage={
                  index + 1 === messages.length && messages % 2 === 0
                }
              />;
            })}
            <Message messages={messages} />
          </Box>
          <Upload />
        </Box>
      </Box>
    </>
  );
}

export default App;
