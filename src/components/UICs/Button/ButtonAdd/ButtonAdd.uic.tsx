import React from "react";
import styled from "styled-components";

type ButtonAddProps = React.HTMLAttributes<HTMLButtonElement> & {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  label: string;
};

const ButtonAdd: React.FC<ButtonAddProps> = ({ onClick, label, ...rest }) => {
  return (
    <ButtonAddContainer onClick={onClick} {...rest}>
      {label}
      <img src={require("./new-icon.svg").default} alt="new-icon" />
    </ButtonAddContainer>
  );
};

export default ButtonAdd;

export const ButtonAddContainer = styled.button`
  cursor: pointer;
  height: 43px;
  background: var(--ui-primary);
  border-radius: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  padding-left: 26px;
  padding-right: 8px;
  transition: box-shadow 200ms ease-in-out;

  &:hover {
    box-shadow: 0px 15px 21px -4px rgba(88, 101, 255, 0.36);
  }

  * {
    pointer-events: none;
  }

  img {
    height: 31px;
    margin-left: 12px;
  }

  &:focus,
  &:active {
    border: none;
  }
`;
