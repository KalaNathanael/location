import { FC, Fragment, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";

import {
  selectItemsBasket,
  selectItemsEventDetails,
} from "@/store/reducers/items/items.selector";
import Button from "@/components/UICs/Button/Button.uic";

import { TCartElt } from "@/features/Dashboard/components/Containers/CartModal/CartModal.container";

import { TBasket } from "@/store/reducers/items/items.reducer";

import "./LocationDetails.styles.scss";
import { formatNumberOnDisplay } from "@/utils";
import { Icon } from "@iconify/react";
import { routePaths } from "@/config";
import Swal from "sweetalert2";
import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import { APIsaveCommand } from "@/features/Dashboard/api/command.api";
import { ToastError, ToastSuccess } from "@/utils/toast";

type PLocationDetailsProps = ConnectedProps<typeof connector>;
const PLocationDetails: FC<PLocationDetailsProps> = ({
  basket,
  eventDetails,
  connectedUser,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const listCartItems = () => {
    let alter = basket as TBasket;
    let toReturn: Array<TCartElt> = [];

    Object.keys(alter).forEach((key) => {
      let elts: TCartElt[] = alter[key].selectedSubItems.map((elt) => {
        return {
          categoryId: key,
          categoryLabel: alter[key].label,
          subCategoryLabel: elt.subCat ? elt.subCat.label : undefined,
          id: elt.subItemId,
          label: elt.subItemLabel,
          price: elt.subItemPrice,
          qty: elt.selectedQuantity,
        };
      });
      toReturn = [...toReturn, ...elts];
    });
    return toReturn;
  };

  const handleSaveCommand = async () => {
    setLoading(true);
    try {
      const response = await APIsaveCommand(
        basket,
        eventDetails,
        connectedUser.id
      );
      if (response.error) {
        ToastError.fire({ text: response.message });
      } else {
        ToastSuccess.fire({
          text: "La commande a été enregistrée avec succès !",
          timer: 8000,
        });
        navigate(routePaths.location);
      }
    } catch (e: any) {
      ToastError.fire();
    }
  };

  const onValidation = () => {
    Swal.fire({
      title: "Validation de la commande",
      icon: "question",
      text: "Vous vous apprêtez à valider la commande pour cet évènement, en êtes-vous sûr ?",
      showCancelButton: true,
      confirmButtonColor: "var(--ui-primary)",
      confirmButtonText: "Oui, Valider",
      cancelButtonText: "Fermer",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveCommand();
      }
    });
  };

  const onDeny = () => {
    Swal.fire({
      title: "Annulation de la commande",
      icon: "warning",
      text: "Vous vous apprêtez à annuler la commande pour cet évènement, en êtes-vous sûr ?",
      showCancelButton: true,
      confirmButtonColor: "var(--ui-red-normal)",
      confirmButtonText: "Oui, Annuler",
      cancelButtonText: "Fermer",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(routePaths.location);
      }
    });
  };

  return (
    <div className="page p-location-details">
      <span className="header-icon">
        <Icon icon="mdi:package-variant-closed-delivered" fontSize={300} />{" "}
      </span>
      <h3 className="location-details-title">Détails de la commande</h3>
      <div className="location-details-content">
        <h5 className="location-details-content__subtitle">Client</h5>
        <div className="location-details-content__client">
          <span>
            <strong>Nom : </strong>
            {eventDetails.client.nom_prenom}
          </span>
          <span>
            <strong>Email : </strong> {eventDetails.client.email}
          </span>
          <span>
            <strong>Téléphone : </strong> {eventDetails.client.telephone}
          </span>
        </div>

        <h5 className="location-details-content__subtitle">Date</h5>
        <div className="location-details-content__date">
          <span>
            <strong>Début :</strong>{" "}
            {eventDetails.dateTime.start.toLocaleString("fr", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          </span>
          <span>
            <strong>Fin :</strong>{" "}
            {eventDetails.dateTime.end.toLocaleString("fr", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          </span>
        </div>

        <h5 className="location-details-content__subtitle">Panier</h5>
        <div className="location-details-content__panier">
          {listCartItems().map((item, idx) => (
            <Fragment key={item.id}>
              <div className="item-card">
                <div className="item-card__content">
                  <span className="name">
                    {item.label} (<em>{item.qty}</em>){" "}
                  </span>
                  <span className="category">
                    {item.categoryLabel}
                    {item.subCategoryLabel
                      ? ` -> ${item.subCategoryLabel}`
                      : ""}
                  </span>
                </div>
                <div className="item-card__price">
                  <span className="price">
                    {formatNumberOnDisplay(item.qty * item.price, " ")} F
                  </span>
                  <span className="calcul">
                    {" "}
                    {item.qty} * {formatNumberOnDisplay(item.price, " ")}{" "}
                  </span>
                </div>
              </div>
              {idx < listCartItems().length - 1 && <hr />}
            </Fragment>
          ))}
          {listCartItems().length === 0 && "Aucun élément"}
        </div>
      </div>
      <div className="location-details-buttons">
        <div className="clear-button">
          <Button
            type="button"
            label="Annuler la commande"
            onClick={() => {
              onDeny();
            }}
            color="var(--ui-red-lighter)"
          />
        </div>
        <div className="submit-button">
          <Button
            type="button"
            onClick={() => {
              onValidation();
            }}
            color="var(--ui-primary)"
            label="Valider la commande"
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  basket: selectItemsBasket,
  eventDetails: selectItemsEventDetails,
  connectedUser: selectConnectedUser,
});
const connector = connect(mapStateToProps);

export default connector(PLocationDetails);
