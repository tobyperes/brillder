import React, { useEffect } from "react";

import './ImageDialog.scss';
import { ImageCoverData } from "./model";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import DropCoverImage from "./DropCoverImage";
import CopyrightCheckboxes from "components/baseComponents/CopyrightCheckboxs";
import SourceInput from "components/baseComponents/SourceInput";


interface DialogProps {
  open: boolean;
  initFile: File | null;
  initData: ImageCoverData;
  upload(file: File, source: string): void;
  updateData(source: string): void;
  setDialog(open: boolean): void;
}

const ImageCoverDialog: React.FC<DialogProps> = ({ open, initFile, initData, upload, updateData, setDialog }) => {
  const [source, setSource] = React.useState(initData.imageSource || '');
  const [permision, setPermision] = React.useState(initData.imagePermision ? true : false as boolean | 1);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [removed, setRemoved] = React.useState(null as boolean | null);

  useEffect(() => {
    if (!file) {
      if (initFile) {
        setFile(initFile);
        setCroped(initFile);
      } else if (initData.value) {
        // get image by url
      }
    }
  }, [initFile, file, initData.value]);

  const validateSource = () => {
    if (source && source.trim().length > 0) {
      return true;
    }
    return false;
  }

  let canUpload = false;
  if (permision && validateSource() && !removed) {
    canUpload = true;
  }

  let className = "add-image-button"
  if (!removed) {
    className += " remove-image"
  }

  const handleClick = () => {
    if (!removed) {
      setFile(null);
      setCroped(null);
      setRemoved(true);
    } else {
      let el = document.createElement("input");
      el.setAttribute("type", "file");
      el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
      el.click();

      el.onchange = () => {
        if (el.files && el.files.length >= 0) {
          setFile(el.files[0]);
          setCroped(el.files[0]);
          setRemoved(false);
        }
      };
    }
  }

  return (
    <BaseDialogWrapper open={open} className="image-dialog-container" close={() => setDialog(false)} submit={() => { }}>
      <div className="dialog-header image-dialog">
        <div className={`cropping ${removed ? 'empty' : ''}`}>
          <div className="centered">
            {removed
              ? <SpriteIcon name="image" className="icon-image" />
              : <div className="image-desktop-preview cover-color">
                <DropCoverImage initFileName={initData.value} locked={false} file={file} setFile={setCroped} />
              </div>
            }
          </div>
          <div className="i-image-footer">
            <div className="file-name">
              {file ? file.name : initData.value}
            </div>
            <div className={"svgOnHover " + className} onClick={handleClick}>
              <SpriteIcon name="plus" className="svg-plus active text-white" />
            </div>
          </div>
        </div>
        <div className="bold margin-top-x2">
          Where did you get this image?
          <span className="text-theme-orange">*</span>
        </div>
        <SourceInput source={source} validationRequired={validationRequired} setSource={setSource} />
        <CopyrightCheckboxes
          validationRequired={validationRequired}
          permision={permision}
          setPermision={setPermision}
        />
      </div>
      <div className="upload-button-container">
        <div className={`upload-button ${(canUpload) ? 'active' : 'disabled'}`} onClick={() => {
          if (cropedFile && canUpload) {
            upload(cropedFile, source);
          } else if (canUpload) {
            updateData(source);
          } else {
            setValidation(true);
          }
        }}>
          <div className="background" />
          <SpriteIcon name="upload" />
          <div className="css-custom-tooltip bold">Upload</div>
        </div>
      </div>
    </BaseDialogWrapper>
  );
}

export default ImageCoverDialog;
