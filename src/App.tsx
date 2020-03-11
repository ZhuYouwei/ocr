import React, {useState} from "react";
import {getBase64, ImageUpload} from "./component/ImageUpload";
import {UploadFile} from "antd/lib/upload/interface";
import {useMsftOcr} from "./hooks";
import ReactJson from 'react-json-view'

export const App = () => {
    //with Tesseract
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    // const res = useTesseract(imageUrl);
    // const onChange = onChangeSetStr(setImageUrl);

    //with Microsoft Computer vision API
    const [image, setImage] = useState<File | null>(null);
    const res = useMsftOcr(image);
    const onChange = onChangeSetFile(setImage);
    if (!isAuthenticated()) {
        return (<h1>404 Not Found</h1>)
    }
    return (
        <div>
            <ImageUpload onChange={onChange}/>
            <ReactJson src={res}/>
        </div>
    );
};

const onChangeSetFile = (func: (f: File) => void) => (file: UploadFile<File>): void => {
    if (file.status === "done") {
        func(file.originFileObj as File);
    }
};
const onChangeSetStr = (func: (url: string | null) => void) => (file: UploadFile<File>): void => {
    if (file.status === "done") {
        getBase64(file.originFileObj, func);
    }
};
const isAuthenticated = (): boolean => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userName = urlParams.get('userName');
    return userName === process.env.REACT_APP_USERNAME;
};
