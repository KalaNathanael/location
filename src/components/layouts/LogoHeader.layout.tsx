import { FC } from "react";
import "./LogoHeader.styles.scss";

const LogoHeaderLayout: FC = () => {
  return (
    <div className="logo-header">
      <span className="left-logo">
        <img src={require("@/assets/images/logo.jpeg")} alt="tedis-logo" />
      </span>
      {/* <span className="right-logo">
        <img
          src={require("@/assets/svg/tedis-red-guy.svg").default}
          alt="red-guy"
        />
      </span> */}
    </div>
  );
};

export default LogoHeaderLayout;
