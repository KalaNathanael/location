import { FC, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import { routePaths } from "@/config";
import Button from "@/components/UICs/Button/Button.uic";
import { selectItemsEventDetails } from "@/store/reducers/items/items.selector";
import { store } from "@/store";

import heart from "@/assets/images/coeur_ci.png";
import "./ItemsList.styles.scss";
import { TItem } from "@/types";
import {
  clearBasket,
  setSelectedItem,
} from "@/store/reducers/items/items.reducer";

type PItemListProps = ConnectedProps<typeof connector>;
const PItemList: FC<PItemListProps> = ({ eventDetails }) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const falseList: TItem[] = Array(11)
    .fill(0)
    .map((elt, idx) => {
      return {
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
      molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
      numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
      optio, eaque rerum! Provident similique accusantium nemo autem.`,
        id: "item-" + (idx + 1),
        image_url: heart,
        label: "Element " + (idx + 1),
      };
    });

  useEffect(() => {
    if (eventDetails.eventName === "") {
      navigate(routePaths.locationDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReturnPage = () => {
    Swal.fire({
      icon: "warning",
      title: "Changement de date ?",
      text: "En retournant à l'écran de choix de la date de l'évènement, vous perdrez tous vos choix. Êtes vous sûr de vouloir procéder ?",
      confirmButtonColor: "var(--ui-primary)",
      confirmButtonText: "Valider",
      cancelButtonColor: "#ccc",
      cancelButtonText: "Annuler",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(routePaths.locationDate);
        dispatch(clearBasket());
      }
    });
  };

  const onListItemClick = (elt: TItem) => {
    navigate(`${routePaths.locationList}/${elt.id}`);
    dispatch(setSelectedItem(elt));
  };

  return (
    <div className="p-items-list">
      <Button
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => onReturnPage()}
      />
      <h2>Liste des éléments louables</h2>
      <p>
        Tips : Sélectionnez un type d'objet et choisissez dans la liste
        d'éléments générés, les éléments et leurs quantités qui vous
        intéressent.
      </p>
      <div className="list">
        {falseList.map((elt) => (
          <div
            key={elt.id}
            className="item-card"
            onClick={() => onListItemClick(elt)}
          >
            <span className="item-image">
              <img src={elt.image_url} alt="representative" />
            </span>
            <span className="item-name">{elt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  eventDetails: selectItemsEventDetails,
});
const connector = connect(mapStateToProps);

export default connector(PItemList);
