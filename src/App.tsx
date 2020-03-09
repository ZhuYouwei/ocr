import React, { useState, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";

export const App = () => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://api.mydomain.com").then(response =>
      console.log("dummy change")  
      console.log("hishishi", response)
      );
    };
    fetchData();
  }, [file]);

  return <ImageUpload onFileUpload={setFile} />;
};
