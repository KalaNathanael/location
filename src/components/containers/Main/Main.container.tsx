import { ReactNode } from "react";
import { FC } from "react";

import "./Main.styles.scss";

interface MainContainerProps {
  children?: ReactNode;
}
const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return <div className="main-container">{children}</div>;
};

export default MainContainer;
