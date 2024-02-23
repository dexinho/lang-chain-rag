import React, { useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import fetchData from "../../utility/fetchData";

const Upload = () => {
  const uploadRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [uploadedName, setUploadedName] = useState("");

  const handleUploadClick = () => {
    uploadRef.current.click();
  };

  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    const url = "http://localhost:3000/pdf";
    const formData = new FormData();

    setUploadedName(file.name);

    formData.append("pdfFile", file);

    const body = {
      method: "POST",
      body: formData,
    };

    try {
      // setIsFetching(true);
      const data = await fetchData({ url, body, isFetching, setIsFetching });
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      // setIsFetching(false);
    }
  };

  return (
    <Box className="flex gap-4 flex-col">
      <input
        style={{ display: "none" }}
        ref={uploadRef}
        type="file"
        onChange={handleUploadChange}
      />
      {isFetching ? (
        <CircularProgress className="w-36"/>
      ) : (
        <Button variant="contained" onClick={handleUploadClick}>
          UPLOAD PDF
        </Button>
      )}
      <Typography className="flex items-center" variant="caption">
        {uploadedName && !isFetching && `File: ${uploadedName}`}
      </Typography>
    </Box>
  );
};

export default Upload;
