import React, { useRef, useState } from "react";
import { Box, Button, useScrollTrigger } from "@mui/material";
import fetchData from "../../utility/fetchData";

const Upload = () => {
  const uploadRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleUploadClick = () => {
    uploadRef.current.click();
  };

  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    const url = "http://localhost:3000/pdf";
    const formData = new FormData();

    formData.append("pdfFile", file);

    const body = {
      method: "POST",
      body: formData,
    };

    try {
      const data = await fetchData({ url, body, isFetching, setIsFetching });
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Box>
      <input
        style={{ display: "none" }}
        ref={uploadRef}
        type="file"
        onChange={handleUploadChange}
      />
      <Button onClick={handleUploadClick}>UPLOAD PDF</Button>
    </Box>
  );
};

export default Upload;
