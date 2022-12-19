import styled, { css } from "styled-components";

const iconContainerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    font-weight: normal;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.47);
    margin-bottom: 10px;
  }
`;

export const FormInputLabel = styled.label`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const IconOverlay = styled.div`
  ${iconContainerStyles}
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  span {
    color: #fff;
  }
`;

export const FormInputFileContainer = styled.div`
  width: 100%;
  min-height: 140px;
  position: relative;
  background: #f5f5f5 no-repeat center center;
  background-size: cover;
  ${(props) => {
    if (props.thumbnail) {
      return css`
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: no-repeat center center;
          background-size: cover;
          background-image: url(${props.thumbnail});
          filter: blur(4px);
          z-index: 0;
        }
      `;
    }
  }}
  border: 2px dashed rgba(0, 0, 0, 0.14);
  border-radius: 7px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover ${IconOverlay.toString()} {
    opacity: 1;
  }
`;

export const InputFile = styled.input`
  display: none;
`;

export const ImgThumbnail = styled.img`
  max-width: 100%;
  height: 100%;
  max-height: 150px;
  position: relative;
`;

export const FilenameContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const IconContainer = styled.div`
  ${iconContainerStyles}
`;
