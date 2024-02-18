import React, { useRef } from "react";
import { Box, Button } from "@mui/material";

const Upload = () => {
  const uploadRef = useRef(null);

  const handleUploadClick = () => {
    uploadRef.current.click();
  };

  const handleUploadChange = (e) => {
    console.log(e.target.files[0]);
  };

  return (
    <Box>
      <input
        style={{ display: "none" }}
        ref={uploadRef}
        type="file"
        onChange={handleUploadChange}
      />
      <Button onClick={handleUploadClick}>Click</Button>
    </Box>
  );
};

export default Upload;
