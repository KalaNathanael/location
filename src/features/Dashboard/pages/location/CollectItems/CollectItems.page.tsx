import "./CollectItems.page.styles.scss";

import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import IconButton from "@mui/material/IconButton";

import Button from "@/components/UICs/Button/Button.uic";
import CSetCollect from "@/features/Dashboard/components/Containers/CollectModal/CollectModal.container";

import { useAppDispatch } from "@/store";
import { clearSelectedCommand } from "@/store/reducers/items/items.reducer";

import { routePaths } from "@/config";
import { useSelector } from "react-redux";
import { selectItemsSelectedCommand } from "@/store/reducers/items/items.selector";
import { TCommand } from "@/types/command";

const PCollectItems: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedCommand = useSelector(selectItemsSelectedCommand);

  const [onCollect, setOnCollect] = useState(false);

  const onReturn = () => {
    if (onCollect) {
      Swal.fire({
        title: "Voulez vous abandonnez le recensement ?",
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Confirmer",
        confirmButtonColor: "var(--ui-primary)",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(routePaths.location);
          dispatch(clearSelectedCommand());
        }
      });
    } else {
      navigate(routePaths.location);
      dispatch(clearSelectedCommand());
    }
  };

  if (selectedCommand === null) {
    navigate(routePaths.location);
    return <></>;
  }

  return (
    <div className="page p-collect-items">
      <h3 className="page__title">
        <IconButton
          aria-label="back-drop"
          color="primary"
          size="medium"
          onClick={onReturn}
          sx={{ width: "fit-content" }}
        >
          <Icon icon="akar-icons:arrow-left" fontSize={20} />
        </IconButton>
        Terminer la commande
      </h3>

      {!onCollect && selectedCommand && (
        <div className="collect-pre-step">
          <div className="command-details">
            <h5>Détails sur la commande</h5>
            <div className="content">
              <span className="data">
                <strong>Code : </strong>
                {(selectedCommand as TCommand).codeCommande}
              </span>
              <h6>Client</h6>
              <div className="sub-content">
                <span className="data">
                  <strong>Nom : </strong>
                  {(selectedCommand as TCommand).client.nom_prenom}
                </span>
                <span className="data">
                  <strong>Email : </strong>
                  {(selectedCommand as TCommand).client.email}
                </span>
                <span className="data">
                  <strong>Téléphone : </strong>
                  {(selectedCommand as TCommand).client.telephone}
                </span>
              </div>
              <h6>Date</h6>
              <div className="sub-content">
                <span className="data">
                  <strong>Début : </strong>
                  {new Date((selectedCommand as TCommand).dateDebut).toLocaleDateString(
                    "fr",
                    { dateStyle: "full" }
                  )}{" "}
                  à{" "}
                  {new Date((selectedCommand as TCommand).dateDebut).toLocaleTimeString(
                    "fr",
                    { timeStyle: "medium" }
                  )}
                </span>
                <span className="data">
                  <strong>Fin : </strong>
                  {new Date((selectedCommand as TCommand).dateFin).toLocaleDateString(
                    "fr",
                    { dateStyle: "full" }
                  )}{" "}
                  à{" "}
                  {new Date((selectedCommand as TCommand).dateFin).toLocaleTimeString(
                    "fr",
                    { timeStyle: "medium" }
                  )}
                </span>
              </div>
            </div>
          </div>
          <p>Voulez-vous démarrer l’enregistrement des articles retournés ?</p>
          <Button
            type="button"
            label="Démarrer"
            onClick={() => {
              setOnCollect(true);
            }}
          />
        </div>
      )}
      {onCollect && selectedCommand && (
        <CSetCollect
          commandCode={(selectedCommand as TCommand).codeCommande}
          devisDetails={(selectedCommand as TCommand).commandArticles!}
        />
      )}
    </div>
  );
};

export default PCollectItems;
