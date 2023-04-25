import { Icon } from "@iconify/react";
import { FC } from "react";
import styled from "styled-components";

type KPICardUICProps = {
  icon: string;
  value: number;
  title: string;
  color: "red" | "green" | "yellow" | "blue" | "orange";
};
const KPICardUIC: FC<KPICardUICProps> = ({ color, icon, title, value }) => {
  return (
    <KPIContainer color={color}>
      <KPISymbol color={color}>
        <Icon icon={icon} fontSize={24} />
      </KPISymbol>
      <KPIMainData>
        <KPIValue color={color}>{value}</KPIValue>
        <KPITitle color={color}>{title}</KPITitle>
      </KPIMainData>
    </KPIContainer>
  );
};

export default KPICardUIC;

const KPIContainer = styled.div<{
  color: string;
}>`
  width: 150px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  background-color: rgba(var(--ui-${({ color }) => color}-rgb), 0.2);
  border-radius: 12px;
`;

const KPISymbol = styled.div<{
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 50%;
  color: var(--ui-${({ color }) => color}-dark);
  background: linear-gradient(
    135deg,
    rgba(var(--ui-${({ color }) => color}-rgb-dark), 0) 0%,
    rgba(var(--ui-${({ color }) => color}-rgb-dark), 0.24) 100%
  );
`;

const KPIMainData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.5;
`;

const KPIValue = styled.span<{
  color: string;
}>`
  font-size: 28px;
  font-weight: 600;
  color: var(--ui-${({ color }) => color}-dark);
`;

const KPITitle = styled.span<{
  color: string;
}>`
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  color: var(--ui-${({ color }) => color}-dark);
`;
