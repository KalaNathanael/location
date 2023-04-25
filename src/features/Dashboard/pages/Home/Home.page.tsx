import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";

import Button from "@/components/UICs/Button/Button.uic";
import LogoHeaderLayout from "@/components/layouts/LogoHeader.layout";
import HomeOption from "../../components/layouts/HomeOption/HomeOption.layout";

import { store } from "@/store";
import { routePaths } from "@/config";

import "./Home.styles.scss";
import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import { logout } from "@/store/reducers/app/app.reducer";

// type HomePageProps = ConnectedProps<typeof connector>;
type HomePageProps = ConnectedProps<typeof connector>;
const HomePage: FC<HomePageProps> = ({ connectedUser }) => {
  const dispatch = store.dispatch;
  let navigate = useNavigate();

  return (
    <div className="page p-dashboard">
      <LogoHeaderLayout />
      <h1 className="welcome-message">
        <span className="welcome">Bienvenue</span>
        <span className="name">{`${connectedUser?.noms} ${connectedUser?.prenoms}`}</span>
        <span className="logout-button">
          <Button
            label="Déconnexion"
            inverted={true}
            color="var(--ui-red-normal)"
            Icon={<Icon icon="ri:logout-circle-line" fontSize={24} />}
            onClick={() => {
              dispatch(logout());
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
          isDisabled={false}
        />
        <HomeOption
          color="yellow"
          icon={"gridicons:stats-alt"}
          label={"Statistiques"}
          onClick={() => navigate("#")}
          isDisabled={true}
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

const mapStateToProps = createStructuredSelector({
  connectedUser: selectConnectedUser,
});
const connector = connect(mapStateToProps);
export default connector(HomePage);
