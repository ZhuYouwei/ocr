import React from "react";
import "antd/dist/antd.css";
import "../styles.css";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {UploadFile} from "antd/lib/upload/interface";

// ImageUpload component by antd
export class ImageUpload extends React.Component<{
  onChange: (_: UploadFile<File>) => void;
},
    {loading: boolean,imageUrl:string}> {
  state = {
    loading: false,
    imageUrl: ""
  };

  _handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
      {
        this.setState({
          imageUrl,
          loading: false
        });
      }


    );
    }
    this.props.onChange(info.file);
  };

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="random"
        listType="picture-card"
        className="avatar-uploader"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this._handleChange}
      >
        {imageUrl !== "" ? (
          <img src={imageUrl} alt="avatar" style={{width: "100%"}}/>
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
