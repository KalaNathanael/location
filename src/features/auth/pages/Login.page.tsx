import { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Alert } from "@mui/material";

import LogoHeaderLayout from "@/components/layouts/LogoHeader.layout";
import AuthLoginContainer from "../components/containers/AuthLogin/AuthLogin.container";

import "./Login.styles.scss";

// type LoginPageProps = ConnectedProps<typeof connector>;
const LoginPage: FC = () => {
  return (
    <div className="p-login">
      <div className="main-content">
        <LogoHeaderLayout />

        <p className="intro-text">
          Votre application de location de matériels évenementiels
        </p>

        <h1 className="title">Connexion</h1>

        {false && (
          <div className="error-alert">
            <Alert variant="outlined" severity="error">
              Login ou mot de passe erroné
            </Alert>{" "}
          </div>
        )}
        <AuthLoginContainer />
      </div>
    </div>
  );
};

// const mapStateToProps = createStructuredSelector({
//   loginError: selectAuthErrors,
// });

// const connector = connect(mapStateToProps);
// export default connector(LoginPage);
export default LoginPage;
