import { FC, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import { routePaths } from "@/config";
import Button from "@/components/UICs/Button/Button.uic";
import {
  selectItemsEventDetails,
  selectItemsSelectedCat,
} from "@/store/reducers/items/items.selector";
import { store } from "@/store";

import heart from "@/assets/images/coeur_ci.png";
import "./ItemsList.styles.scss";
import { TCat, TSubCat } from "@/types";
import {
  clearBasket,
  clearSelectedCat,
  setSelectedCat,
  setSelectedSubCat,
} from "@/store/reducers/items/items.reducer";

type PItemListProps = ConnectedProps<typeof connector>;
const PItemList: FC<PItemListProps> = ({ eventDetails, selectedCat }) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const { id_cat } = useParams();

  const falseCats: TCat[] = Array(11)
    .fill(0)
    .map((elt, idx) => {
      return {
        //   description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
        // molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
        // numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
        // optio, eaque rerum! Provident similique accusantium nemo autem.`,
        id: "cat-" + (idx + 1),
        image_url: heart,
        label: "Catégorie " + (idx + 1),
        hasSubCat: idx % 2 === 1 ? true : false,
      };
    });
  const falseSubCats: TSubCat[] = Array(9)
    .fill(0)
    .map((elt, idx) => {
      return {
        //   description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
        // molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
        // numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
        // optio, eaque rerum! Provident similique accusantium nemo autem.`,
        id: "subCat-" + (idx + 1),
        image_url: heart,
        label: "Sous-catégorie " + (idx + 1),
      };
    });

  const [catList, setCatList] = useState<TCat[]>([]);
  const [subCatList, setSubCatList] = useState<TSubCat[]>([]);

  useEffect(() => {
    if (eventDetails.eventName === "") {
      navigate(routePaths.locationDate);
    }

    if (id_cat) {
      //récupérer la liste des sous-catégories par API
      //A faire ici

      //Instancier la liste des sous-catégories
      setSubCatList(falseSubCats);
    } else {
      //récupérer la liste des catégories par API

      //Instancier la liste des sous-catégories
      setCatList(falseCats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_cat]);

  const onReturnPage = () => {
    if (id_cat) {
      dispatch(clearSelectedCat());
      navigate(routePaths.locationCategories);
    } else {
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
    }
  };

  const onCatItemClick = (elt: TCat) => {
    dispatch(setSelectedCat(elt));
    if (elt.hasSubCat) {
      navigate(`${routePaths.locationCategories}/${elt.id}/subCat`);
    } else {
      navigate(`${routePaths.locationCategories}/${elt.id}`);
    }
  };
  const onSubCatItemClick = (elt: TSubCat) => {
    navigate(`${routePaths.locationCategories}/${elt.id}/subCat/${elt.id}`);
    dispatch(setSelectedSubCat(elt));
  };

  const renderCategories = () => {
    return (
      <>
        <h2>Liste des Catégories d'articles</h2>
        {/* <p>
          Tips : Sélectionnez un type d'objet et choisissez dans la liste
          d'éléments générés, les éléments et leurs quantités qui vous
          intéressent.
        </p> */}
        <div className="list">
          {catList.map((elt) => (
            <div
              key={elt.id}
              className="item-card"
              onClick={() => onCatItemClick(elt)}
            >
              <span className="item-image">
                <img src={elt.image_url} alt="representative" />
              </span>
              <span className="item-name">{elt.label}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderSubCategories = () => {
    return (
      <>
        <h3 className="subCat-title">
          <img src={selectedCat.image_url} alt="categorie-representative" />
          {selectedCat.label}
        </h3>
        <div className="list">
          {subCatList.map((elt) => (
            <div
              key={elt.id}
              className="item-card"
              onClick={() => onSubCatItemClick(elt)}
            >
              <span className="item-image">
                <img src={elt.image_url} alt="representative" />
              </span>
              <span className="item-name">{elt.label}</span>
            </div>
          ))}
        </div>
      </>
    );
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
      {!id_cat ? renderCategories() : renderSubCategories()}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  eventDetails: selectItemsEventDetails,
  selectedCat: selectItemsSelectedCat,
});
const connector = connect(mapStateToProps);

export default connector(PItemList);
