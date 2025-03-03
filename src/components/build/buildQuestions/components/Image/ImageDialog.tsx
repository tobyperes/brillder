import React, { useEffect } from "react";
import { FormControlLabel, Radio } from "@material-ui/core";

import "./ImageDialog.scss";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";
import { ImageAlign, ImageComponentData } from "./model";
import Slider from "@material-ui/core/Slider";
import ImageDesktopPreview from "./ImageDesktopPreview";
import { fileUrl } from "components/services/uploadFile";
import CopyrightCheckboxes from "components/baseComponents/CopyrightCheckboxs";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import SourceInput from "components/baseComponents/SourceInput";

interface DialogProps {
  open: boolean;
  alwaysUpdate?: boolean;
  initFile: File | null;
  initData: ImageComponentData;
  upload(
    file: File,
    source: string,
    caption: string,
    align: ImageAlign,
    height: number
  ): any;
  updateData(
    source: string,
    caption: string,
    align: ImageAlign,
    height: number,
    newImageFile?: File,
  ): void;
  setDialog(open: boolean): void;
}

const ImageDialog: React.FC<DialogProps> = ({
  open,
  alwaysUpdate,
  initFile,
  initData,
  upload,
  updateData,
  setDialog,
}) => {
  const [source, setSource] = React.useState(initData.imageSource || "");
  const [caption, setCaption] = React.useState(initData.imageCaption || "");
  const [permision, setPermision] = React.useState(initData.imagePermision ? true : false as boolean | 1);
  const [validationRequired, setValidation] = React.useState(false);
  const [file, setFile] = React.useState(initFile as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);
  const [align, setAlign] = React.useState(
    initData.imageAlign ? initData.imageAlign : ImageAlign.center
  );
  const [height, setHeight] = React.useState(
    initData.imageHeight ? initData.imageHeight : 30
  );
  const [removed, setRemoved] = React.useState(null as boolean | null);
  const [isSaving, setSaving] = React.useState(false);

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

  useEffect(() => {
    setHeight(initData.imageHeight);
  }, [initData.imageHeight]);

  // Reset to initial data when dialog opens.
  useEffect(() => {
    if (open) {
      setFile(initFile);
      setCroped(initFile);
      setSource(initData.imageSource ?? "");
      setCaption(initData.imageCaption ?? "");
      setPermision(initData.imagePermision ? true : false);
      setAlign(initData.imageAlign ? initData.imageAlign : ImageAlign.center);
      setHeight(initData.imageHeight ? initData.imageHeight : 30);
    }
    /*eslint-disable-next-line*/
  }, [open]);

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

  let className = "add-image-button";
  if (!removed) {
    className += " remove-image";
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
  };

  const marks = [
    {
      value: 20,
      label: "-",
    },
    {
      value: 50,
      label: "+",
    },
  ];

  if (!open) {
    return <div />;
  }

  return (
    <BaseDialogWrapper
      open={open}
      className="image-dialog-container"
      close={() => setDialog(false)}
      submit={() => { }}
    >
      <div className="close-button svgOnHover" onClick={() => setDialog(false)}>
        <SpriteIcon name="cancel-thick" className="w100 h100 active" />
      </div>
      <div className="dialog-header image-dialog">
        <div className={`cropping ${removed ? "empty" : ""}`}>
          <div className="centered">
            {removed ? (
              <SpriteIcon name="image" className="icon-image" />
            ) : (
              <ImageDesktopPreview
                src={fileUrl(initData.value) || initData.url}
                height={height}
                align={align}
                file={cropedFile}
              />
            )}
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
        <div className="flex-inline">
          <span className="bold">Desktop Alignment:</span>
          <FormControlLabel
            checked={align === ImageAlign.center}
            control={<Radio onClick={() => setAlign(ImageAlign.center)} />}
            label="Centre"
          />
          <FormControlLabel
            checked={align === ImageAlign.left}
            control={<Radio onClick={() => setAlign(ImageAlign.left)} />}
            label="Left"
          />
        </div>
        <div className="flex">
          <div className="bold">Image size:</div>
          <Slider
            className="i-s-slider"
            defaultValue={height}
            aria-labelledby="discrete-slider"
            step={1}
            marks={marks} min={20} max={50}
            onChange={(e: any, v: any) => setHeight(v)}
          />
        </div>
        <div className="bold">
          Where did you get this image?
          <span className="text-theme-orange">*</span>
        </div>
        <SourceInput source={source} validationRequired={validationRequired} setSource={setSource} />
        <CopyrightCheckboxes
          validationRequired={validationRequired}
          permision={permision}
          setPermision={setPermision}
        />
        <QuillEditor
          disabled={false}
          className="quill-caption"
          data={caption}
          showToolbar={true}
          toolbar={['bold', 'italic', 'superscript', 'subscript', 'latex']}
          placeholder="Add caption"
          imageDialog={true}
          onChange={v => setCaption(v)}
        />
      </div>
      <div className="centered last-button">
        <div
          className={`upload-button ${canUpload ? "active" : "disabled"}`}
          onClick={async () => {
            if (!isSaving) {
              setSaving(true);
              if (cropedFile && canUpload && !alwaysUpdate) {
                const res = await upload(cropedFile, source, caption, align, height);
                if (res) {
                  setSaving(false);
                }
              } else if (canUpload) {
                updateData(source, caption, align, height, cropedFile ?? undefined);
                setSaving(false);
              } else {
                setValidation(true);
                setSaving(false);
              }
            }
          }}
        >
          <div className="background" />
          <SpriteIcon name="upload" />
          <div className="css-custom-tooltip bold">Upload</div>
        </div>
      </div>
    </BaseDialogWrapper>
  );
};

export default ImageDialog;
