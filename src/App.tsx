import React, { useState, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import {createWorker} from "tesseract.js";

const worker = createWorker({
  logger: m => console.log(m),
});

export const App = () => {
  const [file, setFile] = useState<string | null>(null);
  const [ocr, setOcr] = useState('没有识别到文字...');

  useEffect(()=>{
    const _ = async ()=>{
      await worker.load();
      await worker.loadLanguage('chi_sim');
      await worker.initialize('chi_sim');
    };
    _();
  },[]);
  const doOCR = async (file: string) => {
    const { data: { text } } = await worker.recognize(file);
    setOcr(text);
  };
  useEffect(() => {
    if (file){
      console.log("start recognizing")
      doOCR(file);
    } else {
      console.log("no file")
    }
  },[file]);

  return (
      <div>
        <ImageUpload onFileUpload={setFile} />
        <p>{ocr}</p>
      </div>
  );
};
