import React, {useRef, useState} from "react";
import {getBase64, ImageUpload} from "./component/ImageUpload";
import {UploadFile} from "antd/lib/upload/interface";
import {useMsftOcr} from "./hooks";
import ReactJson from 'react-json-view'
import {AgGridReact} from 'ag-grid-react';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowDataChangedEvent, RowSelectedEvent} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Input} from 'antd';
import {OcrResult} from "@azure/cognitiveservices-computervision/esm/models";

const {TextArea} = Input;

export const App = () => {

    //upload function
    const [image, setImage] = useState<File | null>(null);
    const onChange = onChangeSetFile(setImage);
    //const onChange = onChangeSetStr(setImageUrl);


    //with Microsoft Computer vision API
    const ocrResult = useMsftOcr(image);

    // with Tesseract
    // const [imageUrl, setImageUrl] = useState<string | null>(null);
    // const res = useTesseract(imageUrl);

    // grid function
    const api = useRef<GridApi | null>(null);
    const columnApi = useRef<ColumnApi | null>(null);
    const colDef: ColDef [] = [
        {headerName: "Region", field: "region", checkboxSelection: true, flex: 1},
        {headerName: "Word", field: "word", flex: 4},
        {headerName: "Area", field: 'area', flex: 2}
    ];
    const defaultColDef: ColDef = {
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        sortable: true,
        resizable: true,
    };
    const rowData = getRecordResult(ocrResult);

    const onGridReady = (e: GridReadyEvent) => {
        api.current = e.api;
        columnApi.current = e.columnApi;
    };

    const onRowSelected = (e: RowSelectedEvent) => {
        const rows = e.api.getSelectedRows();
        const value = rows.map(r => r.word).join('\n');
        setInput(value);
    };
    const onRowDataChanged = (e: RowDataChangedEvent) => {
        if (e.api.getDisplayedRowCount() === 0) {
            e.api.showNoRowsOverlay();
        } else {
            e.api.hideOverlay();
            //e.columnApi.autoSizeAllColumns();
            e.api.resetRowHeights()

        }
    };
    const onColumnResized = (e) => {
        e.api.resetRowHeights();
    };

    // Result
    const [input, setInput] = useState<string>("");
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }

    // Auth
    if (!isAuthenticated()) {
        return (<h1>404 Not Found</h1>)
    }
    return (
        <div>
            <h1>图书馆文字识别流程优化</h1>

            <h2>上传图片</h2>
            <ImageUpload onChange={onChange}/>

            <h2>识别结果</h2>
            <div className="ag-theme-alpine" style={{height: '600px'}}>
                <AgGridReact
                    columnDefs={colDef}
                    defaultColDef={defaultColDef}
                    rowSelection={'multiple'}
                    onGridReady={onGridReady}
                    onRowDataChanged={onRowDataChanged}
                    onRowSelected={onRowSelected}
                    rowData={rowData}
                    onColumnResized={onColumnResized}
                    rowHeight={25}
                >
                </AgGridReact>
            </div>

            <h2>点击行进行编辑</h2>
            <div style={{paddingTop: '30px'}}>
                <TextArea
                    autoSize={true}
                    value={input}
                    onChange={onInputChange}
                />
            </div>

            {/*<h2>Json Result</h2>*/}
            {/*<ReactJson src={getJsonDisplayResult(ocrResult)}/>*/}


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

const getJsonDisplayResult = (res: OcrResult) =>
    ({
        data: res.regions?.map(r => ({
            region: r.lines?.map(l => {
                const line = l.words?.map(w => w.text).join('');
                const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
                return line?.match(REGEX_CHINESE) ? {text: line, area: l.boundingBox} : ""
            })
        }))
    })

const getRecordResult = (ocr: OcrResult) => {
    var res: any[] = [];
    ocr.regions?.map((r, i) => {
        var path = {};
        path['region'] = i;
        r.lines?.map(l => {
            path['area'] = l.boundingBox;
            const words = l.words?.map(w => w.text).join('');
            path['word'] = words;
            res.push({...path});
        })
    })
    return res;
}
