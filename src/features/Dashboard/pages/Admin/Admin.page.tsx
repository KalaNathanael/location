import "./Admin.page.styles.scss";

import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminCardUIC from "../../components/elements/AdminCard/AdminCard.uic";

import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import { routePaths } from "@/config";


const PAdmin: FC = () => {
  const navigate = useNavigate();
  const connectedUser = useSelector(selectConnectedUser);
  const isUserAdmin: boolean = connectedUser?.profil.id === 2;


  return (
    <div className="page p-admin">
      <h5>Que cherchez-vous manager ?</h5>
      <div className="admin-menus">
        {isUserAdmin && <AdminCardUIC
          icon="clarity:administrator-line"
          label="Gérer les utilisateurs"
          onClick={() => {
            navigate(routePaths.adminUsers);
          }}
        />}
        <AdminCardUIC
          icon="fluent-emoji-high-contrast:fork-and-knife-with-plate"
          label="Gérer les articles"
          onClick={() => {
            navigate(routePaths.adminCategories);
          }}
        />
      </div>
    </div>
  );
};

export default PAdmin;
