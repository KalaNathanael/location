import { FC } from "react";
import { Icon } from "@iconify/react";
import styled from "styled-components";

type AdminCardUICProps = {
  icon: string;
  label: string;
  onClick: () => void;
};
const AdminCardUIC: FC<AdminCardUICProps> = ({ icon, label, onClick }) => {
  return (
    <MenuCard
      onClick={() => {
        onClick();
      }}
    >
      <IconContainer>
        {" "}
        <Icon icon={icon} fontSize={30} color="white" />
      </IconContainer>
      <LabelContainer>{label}</LabelContainer>
    </MenuCard>
  );
};

export default AdminCardUIC;

const IconContainer = styled.span`
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--ui-primary);
  transition: all ease-in 100ms;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 4px;
    border: 2px solid white;
    border-radius: 8px;
    background-color: transparent;
    transition: all ease-in 100ms;
    z-index: -1;
  }
`;

const LabelContainer = styled.span`
  flex: 1;
  line-height: 1.5;
  font-size: 18px;
  font-weight: 500;
  transition: all ease-in 100ms;
  color: var(--text-primary);
`;

const MenuCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 2px solid var(--ui-primary);
  border-radius: 8px;
  padding: 8px;
  gap: 12px;
  transition: all ease-in 100ms;
  cursor: pointer;

  &:hover {
    border-color: white;
    background-color: var(--ui-primary);
    color: white;

    ${IconContainer.toString()} {
      background: white;
      & svg {
        color: var(--ui-primary) !important;
      }
      &::before {
        border-color: var(--ui-primary);
      }
    }

    ${LabelContainer.toString()} {
      color: white;
    }
  }
`;
