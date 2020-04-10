import {useEffect, useState} from "react";
import {createWorker} from "tesseract.js";
import axios from "axios";
import {OcrResult} from "@azure/cognitiveservices-computervision/esm/models";


export const useTesseract = (image: string | null) => {
    const [ocr, setOcr] = useState<{ data: any }>({data: '没有识别到文字...'});
    const worker = createWorker({
        logger: m => console.log(m),
    });
    useEffect(() => {
        if (image != null) {
            (async () => {
                setOcr({data: "正在识别。。。"});
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
            })();
        }
    }, [image]);

    useEffect(() => {
        const doOCR = async (file: string) => {
            const res = await worker.recognize(file);
            setOcr(res);
        };
        if (image) {
            console.log("start recognizing")
            doOCR(image);
        } else {
            console.log("no file")
        }
        return () => {
            worker.terminate()
        };
    }, [image]);

    return ocr;
};

export const useMsftOcr = (image: File | string | null) => {
    const [ocr, setOcr] = useState<any>({data: '没有识别到文字...'});
    const ENDPOINT = process.env['REACT_APP_ENDPOINT'];
    const KEY = process.env['REACT_APP_KEY'];

    if (!KEY || !ENDPOINT) {
        throw new Error('Set your environment variables for your subscription key and endpoint.');
    }

    const uriBase = ENDPOINT + "vision/v2.0/ocr?language=zh-Hans&detectOrientation=true";
    useEffect(() => {
        if (image != null) {
            setOcr({data: "正在检测。。。"});
            (async () => {
                const res = await axios({
                    method: 'post',
                    url: uriBase,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Ocp-Apim-Subscription-Key': KEY
                    },
                    data: image
                });
                if (res.status === 200) {
                    console.log(res.data)
                    setOcr(res.data);
                } else {
                    setOcr({data: "识别失败。。。"});
                }
            })();
        }

    }, [image]);
    return ocr;
};
