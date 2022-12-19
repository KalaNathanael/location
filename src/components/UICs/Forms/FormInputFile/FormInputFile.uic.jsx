import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "@/utils";
import { Icon } from "@iconify/react";
import {
  FormInputFileContainer,
  FormInputLabel,
  IconContainer,
  IconOverlay,
  ImgThumbnail,
  InputFile,
} from "./FormInputFile.styles";

const FormInputFile = ({
  className,
  label,
  onChange,
  name,
  onBlur,
  filename,
  value,
  placeholder = "Cliquer pour ajouter",
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const triggerInputFile = () => inputFileRef.current.click();
  const inputFileRef = useRef(null);

  useEffect(() => {
    if (typeof value === "string") {
      setSelectedFile(null);

      inputFileRef.current.value = "";
    } else if (typeof value === "object") {
      ValidateFileUpload();
    }
  }, [value]);

  useEffect(() => {
    if (typeof filename === "object" && filename instanceof Blob) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setThumbnail(e.target.result);
      };

      reader.readAsDataURL(filename);
    } else if (isEmpty(filename)) {
      setThumbnail(null);
      setSelectedFile(null);
    }
  }, [filename]);

  const ValidateFileUpload = () => {
    const fuData = inputFileRef.current;
    const fileUploadPath = fuData.value;
    const extensions = ["gif", "bmp", "png", "jpeg", "jpg", "pdf"];

    //To check if user upload any file
    if (!isEmpty(fileUploadPath)) {
      const extension = fileUploadPath
        .substring(fileUploadPath.lastIndexOf(".") + 1)
        .toLowerCase();

      //The file uploaded is correct
      if (extensions.indexOf(extension) !== -1) {
        // To Display
        if (fuData.files && fuData.files[0]) {
          const reader = new FileReader();

          reader.onload = function (e) {
            setThumbnail(e.target.result);
          };

          reader.readAsDataURL(fuData.files[0]);
        }
      } else {
        setThumbnail(null);
      }
    }
  };

  return (
    <React.Fragment>
      {label ? (
        <FormInputLabel className="form-input-label">{label}</FormInputLabel>
      ) : null}
      <FormInputFileContainer onClick={triggerInputFile} thumbnail={thumbnail}>
        <InputFile
          name={name}
          onBlur={onBlur}
          ref={inputFileRef}
          className={`${className}`}
          type="file"
          onChange={(event) => {
            setSelectedFile(event.target.files[0]);
            onChange(event.target.files[0]);
            ValidateFileUpload();
          }}
        />

        {thumbnail && (
          <ImgThumbnail id="thumb" src={thumbnail} alt="thumbnail" />
        )}

        {selectedFile &&
          (thumbnail ? (
            <IconOverlay>
              <span className="mr-1">
                {selectedFile?.name || (!isEmpty(filename) && filename)}
              </span>
              <div>
                <Icon
                  style={{ fontSize: "24px" }}
                  color="#F16E00"
                  icon={"material-symbols:add"}
                />
              </div>
            </IconOverlay>
          ) : (
            <IconContainer>
              <span className="mr-1">
                {selectedFile?.name || (!isEmpty(filename) && filename)}
              </span>
              <div>
                <Icon
                  style={{ fontSize: "24px" }}
                  color="#F16E00"
                  icon={"material-symbols:add"}
                />
              </div>
            </IconContainer>
          ))}

        {!selectedFile &&
          (thumbnail ? (
            <IconOverlay>
              <span className="mr-1">
                {!thumbnail ? placeholder : "Cliquer pour modifier"}
              </span>
              <div>
                <Icon
                  style={{ fontSize: "24px" }}
                  color="#F16E00"
                  icon={"material-symbols:add"}
                />
              </div>
            </IconOverlay>
          ) : (
            <IconContainer>
              <span className="mr-1">
                {!thumbnail ? placeholder : "Cliquer pour modifier"}
              </span>
              <div>
                <Icon
                  style={{ fontSize: "24px" }}
                  color="#F16E00"
                  icon={"material-symbols:add"}
                />
              </div>
            </IconContainer>
          ))}
      </FormInputFileContainer>
    </React.Fragment>
  );
};

FormInputFile.defaultProps = {
  className: "",
  label: "",
  name: "",
  filename: "",
  onChange: () => {},
  onBlur: () => {},
};

FormInputFile.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  filename: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default FormInputFile;
