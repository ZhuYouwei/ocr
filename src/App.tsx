import React, {useState} from "react";
import {ImageUpload} from "./component/ImageUpload";
import {UploadFile} from "antd/lib/upload/interface";
import {useMsftOcr} from "./hooks";
import ReactJson from 'react-json-view'

export const App = () => {
    //use with useTesseract
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    // const res = useTesseract(imageUrl);
    // const onChangeT = (file: UploadFile<File>) => {
    //     getBase64(file.originFileObj, setImageUrl);
    // };

    //use with Microsoft Computer VISION API
    const [image, setImage] = useState<File | null>(null);
    const res = useMsftOcr(image);
    const onChangeMS = (file: UploadFile<File>) => {
        if (file.status === "done") {
            setImage(file.originFileObj as File);
        }
    };
    if (!isAuthenticated()){
        return (<h1>404 Not Found</h1>)
    }
    return (

        <div>
            <ImageUpload onChange={onChangeMS}/>
            <ReactJson src={res}/>
        </div>

    );
};

const isAuthenticated = (): boolean => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userName = urlParams.get('userName');
    return userName === process.env.REACT_APP_USERNAME;
}
