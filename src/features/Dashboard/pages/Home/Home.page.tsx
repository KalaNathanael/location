import { FC } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { Icon } from "@iconify/react";

import Button from "@/components/UICs/Button/Button.uic";
import LogoHeaderLayout from "@/components/layouts/LogoHeader.layout";
import HomeOption from "../../components/layouts/HomeOption/HomeOption.layout";

import { routePaths } from "@/config";

import "./Home.styles.scss";

// type HomePageProps = ConnectedProps<typeof connector>;
const HomePage: FC = () => {
  let user = {
    nom: "Nom",
    prenoms: "Prenoms",
    admin: 1,
  };
  let navigate = useNavigate();

  return (
    <div className="p-dashboard">
      <LogoHeaderLayout />
      <h1 className="welcome-message">
        <span className="welcome">Bienvenue</span>
        <span className="name">{`${user?.nom} ${user?.prenoms}`}</span>
        <span className="logout-button">
          <Button
            label="Déconnexion"
            inverted={true}
            color="var(--ui-red-normal)"
            Icon={<Icon icon="ri:logout-circle-line" fontSize={24} />}
            onClick={() => {
              navigate(routePaths.login);
            }}
          />
        </span>
      </h1>
      <p className="text-interim">Que souhaitez-vous faire ?</p>
      <div className="options">
        <HomeOption
          color="green"
          icon={"uit:create-dashboard"}
          label={"Espace administrateur"}
          onClick={() => navigate(routePaths.admin)}
          isDisabled={user?.admin !== 1}
        />
        <HomeOption
          color="blue"
          icon="healthicons:rdt-result-out-stock-outline"
          label={"Louer du matériel"}
          onClick={() => navigate(routePaths.location)}
        />
      </div>
    </div>
  );
};

// const mapStateToProps = createStructuredSelector({
//   user: selectAuthUser,
// });
// const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
//   logout: () => dispatch(logout()),
// });
// const connector = connect(mapStateToProps, mapDispatchToProps);
export default HomePage;
