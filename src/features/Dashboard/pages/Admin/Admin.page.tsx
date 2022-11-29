import { routePaths } from "@/config";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import AdminCardUIC from "../../components/elements/AdminCard/AdminCard.uic";

import "./Admin.page.styles.scss";

const PAdmin: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-admin">
      <h5>Que cherchez-vous manager ?</h5>
      <div className="admin-menus">
        <AdminCardUIC
          icon="clarity:administrator-line"
          label="Gérer les utilisateurs"
          onClick={() => {
            navigate(routePaths.adminUsers);
          }}
        />
        <AdminCardUIC
          icon="fluent-emoji-high-contrast:fork-and-knife-with-plate"
          label="Gérer les articles"
          onClick={() => {
            navigate(routePaths.adminArticles);
          }}
        />
      </div>
    </div>
  );
};

export default PAdmin;
