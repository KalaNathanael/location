import { FC, Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Modal } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import Button from "@/components/UICs/Button/Button.uic";

import { formatNumberOnDisplay } from "@/utils";
import { selectItemsBasket } from "@/store/reducers/items/items.selector";

import { store } from "@/store";
import {
  clearBasket,
  removeSubItemFromBasket,
  TBasket,
} from "@/store/reducers/items/items.reducer";

import "./CartModal.styles.scss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";

export type TCartElt = {
  categoryId: string;
  categoryLabel: string;
  subCategoryLabel?: string;
  id: string;
  label: string;
  price: number;
  qty: number;
};

type CCartModalProps = ConnectedProps<typeof connector> & {
  open: boolean;
  handleClose: () => void;
};
const CCartModal: FC<CCartModalProps> = ({ basket, handleClose, open }) => {
  const dispatch = store.dispatch;
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

  const clear = () => {
    Swal.fire({
      icon: "warning",
      title: "Êtes-vous sûr de vouloir vider le panier ?",
      showCancelButton: true,
      cancelButtonText: "Non, Annuler",
      confirmButtonText: "Oui, Vider",
      confirmButtonColor: "var(--ui-primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearBasket());
      }
    });
  };

  const remove = (categoryId, itemId) => {
    dispatch(
      removeSubItemFromBasket({ categoryId: categoryId, subItemId: itemId })
    );
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        handleClose();
      }}
    >
      <div className="c-cart-modal">
        <h5 className="cart-title">Panier</h5>
        <div className="cart-content">
          {listCartItems().map((item) => (
            <Fragment key={item.id}>
              <div className="item-card">
                <div className="item-card__delete">
                  <IconButton
                    color="primary"
                    onClick={() => remove(item.categoryId, item.id)}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </div>
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
              <hr />
            </Fragment>
          ))}
          {listCartItems().length === 0 && "Aucun élément"}
        </div>
        <div className="cart-buttons">
          <div className="cancel-button">
            <Button
              type="button"
              label="Fermer"
              onClick={() => {
                handleClose();
              }}
              color="var(--ui-grey-lighter)"
            />
          </div>
          <div className="clear-button">
            <Button
              type="button"
              label="Vider le panier"
              onClick={() => {
                clear();
              }}
              color="var(--ui-red-lighter)"
            />
          </div>
          <div className="submit-button">
            <Button
              type="button"
              // isLoading={formik.isSubmitting}
              color="var(--ui-primary)"
              label="Valider la location"
              onClick={() => {
                navigate(routePaths.locationConfirmCommand);
                handleClose();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  basket: selectItemsBasket,
});
const connector = connect(mapStateToProps);
export default connector(CCartModal);
