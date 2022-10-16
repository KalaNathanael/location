import { FC } from "react";
import { Icon, IconifyIcon } from "@iconify/react";

import "./HomeOption.styles.scss";

interface HomeOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon: string | IconifyIcon;
  color: "blue" | "red" | "yellow" | "green";
  isDisabled?: boolean;
}
const HomeOption: FC<HomeOptionProps> = ({
  label,
  icon,
  color,
  isDisabled,
  onClick,
  ...otherProps
}) => {
  return (
    <div
      className={`l-dashboard-option ${isDisabled ? "disable" : color}`}
      onClick={onClick}
      {...otherProps}
    >
      <span className="icon">
        <Icon icon={icon} fontSize={100} />{" "}
      </span>
      <span className="label">{label}</span>
    </div>
  );
};

export default HomeOption;
