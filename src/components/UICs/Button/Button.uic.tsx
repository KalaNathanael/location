import { FC } from "react";
import styled from "styled-components";
import PulseLoader from "../Loaders/Pulse/PulseLoader.uic";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  isLoading?: boolean;
  Icon?: React.ReactNode;
  inverted?: boolean;
  color?: string;
};
const Button: FC<ButtonProps> = ({
  label,
  isLoading = false,
  Icon,
  inverted = false,
  color = "",
  onClick,
  ...otherProps
}) => {
  return (
    <ButtonContainer
      withIcon={!!Icon}
      onClick={onClick}
      {...otherProps}
      isLoading={isLoading}
      inverted={inverted}
      color={color}
    >
      {!!Icon && Icon}
      {label}
      {isLoading && (
        <div style={{ width: "25%", height: "calc(100% - 16px)" }}>
          <PulseLoader color={inverted ? color : "#fff"} />
        </div>
      )}
    </ButtonContainer>
  );
};

export default Button;

const ButtonContainer = styled.button<{
  isLoading: boolean;
  withIcon: boolean;
  inverted: boolean;
  color: string;
}>`
  position: relative;
  cursor: pointer;
  height: 100%;
  width: 100%;
  display: flex;
  padding: 0 15px;
  justify-content: ${({ withIcon }) => (withIcon ? "space-between" : "center")};
  align-items: center;
  border: none;
  color: ${({ inverted, color }) =>
    inverted ? (color ? color : "var(--ui-primary)") : "#fff"};
  background-color: #fff;
  font-weight: bold;
  font-size: 16px;
  line-height: 1.25;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
    0 1px 2px 0px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  z-index: 0;

  * {
    pointer-events: none;
  }

  ${({ isLoading }) => {
    if (isLoading) return "cursor: progress;";
  }}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 100px;
    background-color: ${({ color }) => (color ? color : "var(--ui-primary)")};
    opacity: ${({ inverted }) => (inverted ? 0.1 : 1)};
    z-index: -2;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 100px;
    background-color: rgba(0, 0, 0);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover&::after {
    opacity: ${({ inverted }) => (inverted ? 0.05 : 0.15)};
  }

  &:focus,
  &:active {
    border: none;
  }

  &:disabled {
    cursor: not-allowed;
    border: none;

    &::after {
      background-color: #fff;
      opacity: 0.3;
    }
    &:hover::after {
      opacity: 0.3;
    }
  }
`;
