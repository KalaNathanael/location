import "./ItemsList.styles.scss";

import { FC, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";

import { ToastError } from "@/utils/toast";

import {
  APIfetchCategories,
  APIfetchSubCategories,
} from "@/features/Dashboard/api/category.api";

import { TCat, TSubCat } from "@/types";
import { routePaths } from "@/config";

import {
  clearBasket,
  clearSelectedCat,
  setSelectedCat,
  setSelectedSubCat,
} from "@/store/reducers/items/items.reducer";
import {
  selectItemsEventDetails,
  selectItemsSelectedCat,
} from "@/store/reducers/items/items.selector";
import { store } from "@/store";

type PItemListProps = ConnectedProps<typeof connector>;
const PItemList: FC<PItemListProps> = ({ eventDetails, selectedCat }) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const { id_cat } = useParams();

  const [catList, setCatList] = useState<TCat[]>([]);
  const [subCatList, setSubCatList] = useState<TSubCat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (eventDetails.client === null) {
      navigate(routePaths.locationDate);
    }

    if (id_cat) {
      getSubCatList();
    } else {
      getCatList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_cat]);

  async function getCatList() {
    setLoading(true);
    try {
      const response = await APIfetchCategories();

      if (response.error) {
        ToastError.fire({
          text: response.message,
          timer: 6000,
        });
      } else {
        let datas: any[] = response.data;
        let toSet: TCat[] = datas.map((elt) => {
          return {
            id: elt.id,
            image_url: elt.img_path,
            label: elt.libelle,
            hasSubCat: true,
          };
        });
        setCatList(toSet);
      }
    } catch (err: any) {
      ToastError.fire();
    }
    setLoading(false);
  }

  async function getSubCatList() {
    setLoading(true);
    try {
      const response = await APIfetchSubCategories();

      if (response.error) {
        ToastError.fire({
          text: response.message,
          timer: 6000,
        });
      } else {
        let datas: any[] = response.data;
        let parentCat = datas.find((elt) => `${elt.id}` === id_cat);
        let toSet: TSubCat[] = parentCat?.sous_categorie.map((elt) => {
          return {
            id: elt.id,
            label: elt.libelle,
            image_url: elt.img_path,
          };
        });
        setSubCatList(toSet);
      }
    } catch (err: any) {
      ToastError.fire();
    }
    setLoading(false);
  }

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
    navigate(`${routePaths.locationCategories}/${id_cat}/subCat/${elt.id}`);
    dispatch(setSelectedSubCat(elt));
  };

  const renderCategories = () => {
    return (
      <>
        <h2>
          <IconButton
            aria-label="back-drop"
            color="primary"
            size="medium"
            onClick={onReturnPage}
            sx={{ width: "fit-content" }}
          >
            <Icon icon="akar-icons:arrow-left" fontSize={20} />
          </IconButton>
          Liste des Catégories d'articles
        </h2>
        {/* <p>
          Tips : Sélectionnez un type d'objet et choisissez dans la liste
          d'éléments générés, les éléments et leurs quantités qui vous
          intéressent.
        </p> */}
        <div className="list">
          {!loading ? (
            catList.map((elt) => (
              <div
                key={elt.id}
                className="item-card"
                onClick={() => onCatItemClick(elt)}
              >
                <span className="item-image">
                  <img src={elt.image_url} alt={elt.label} />
                </span>
                <span className="item-name">{elt.label}</span>
              </div>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
            </Box>
          )}
          {!loading && catList.length === 0 && (
            <span className="no-element">Aucune Catégorie</span>
          )}
        </div>
      </>
    );
  };

  const renderSubCategories = () => {
    return (
      <>
        <h3 className="subCat-title">
          <IconButton
            aria-label="back-drop"
            color="primary"
            size="medium"
            onClick={onReturnPage}
            sx={{ width: "fit-content" }}
          >
            <Icon icon="akar-icons:arrow-left" fontSize={20} />
          </IconButton>
          <img src={selectedCat.image_url} alt={selectedCat.label} />
          {selectedCat.label}
        </h3>
        <div className="list">
          {!loading ? (
            subCatList.map((elt) => (
              <div
                key={elt.id}
                className="item-card"
                onClick={() => onSubCatItemClick(elt)}
              >
                <span className="item-image">
                  <img src={elt.image_url} alt={elt.label} />
                </span>
                <span className="item-name">{elt.label}</span>
              </div>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box sx={{ width: "32%" }}>
                <Skeleton variant="rounded" height={100} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
            </Box>
          )}
          {!loading && subCatList.length === 0 && (
            <span className="no-element">Aucune Sous-catégorie</span>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="page p-items-list">
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
