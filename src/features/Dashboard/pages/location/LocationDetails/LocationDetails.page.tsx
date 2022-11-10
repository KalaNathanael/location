import { FC, Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";

import { selectItemsBasket } from "@/store/reducers/items/items.selector";
import Button from "@/components/UICs/Button/Button.uic";

import { TCartElt } from "@/features/Dashboard/components/Conainers/CartModal/CartModal.container";

import { TBasket } from "@/store/reducers/items/items.reducer";

import "./LocationDetails.styles.scss";
import { formatNumberOnDisplay } from "@/utils";
import { Icon } from "@iconify/react";
import { routePaths } from "@/config";
import Swal from "sweetalert2";

type PLocationDetailsProps = ConnectedProps<typeof connector>;
const PLocationDetails: FC<PLocationDetailsProps> = ({ basket }) => {
  const navigate = useNavigate();

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
    <div className="p-location-details">
      <span className="header-icon">
        <Icon icon="mdi:package-variant-closed-delivered" fontSize={300} />{" "}
      </span>
      <h3 className="location-details-title">Détails de la commande</h3>
      <div className="location-details-content">
        {listCartItems().map((item, idx) => (
          <Fragment key={item.id}>
            <div className="item-card">
              <div className="item-card__content">
                <span className="name">
                  {item.label} (<em>{item.qty}</em>){" "}
                </span>
                <span className="category">
                  {item.categoryLabel}
                  {item.subCategoryLabel ? ` -> ${item.subCategoryLabel}` : ""}
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
            // isLoading={formik.isSubmitting}
            color="var(--ui-primary)"
            label="Valider la commande"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  basket: selectItemsBasket,
});
const connector = connect(mapStateToProps);

export default connector(PLocationDetails);
