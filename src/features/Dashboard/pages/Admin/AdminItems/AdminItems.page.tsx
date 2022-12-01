import { FC, useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Icon } from "@iconify/react";
import { Box, Skeleton, Button as MUIButton } from "@mui/material";

import Button from "@/components/UICs/Button/Button.uic";

import { store } from "@/store";
import {
  clearSelectedCat,
  setSelectedCat,
  setSelectedSubCat,
} from "@/store/reducers/admin/admin.reducer";
import { selectAdminSelectedCat } from "@/store/reducers/admin/admin.selector";

import {
  APIfetchCategories,
  APIfetchSubCategories,
} from "@/features/Dashboard/api/category.api";
import { ToastError } from "@/utils/toast";
import { routePaths } from "@/config";

import { TCat, TSubCat } from "@/types";

import "./AdminItems.page.styles.scss";
import AdminCatCardUIC from "@/features/Dashboard/components/elements/AdminCatCard.uic";

type PAdminItemsProps = ConnectedProps<typeof connector>;
const PAdminItems: FC<PAdminItemsProps> = ({ selectedCat }) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const { id_cat } = useParams();

  const [catList, setCatList] = useState<TCat[]>([]);
  const [subCatList, setSubCatList] = useState<TSubCat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
      navigate(routePaths.adminCategories);
    } else {
      navigate(routePaths.admin);
    }
  };

  const onCatItemClick = (elt: TCat) => {
    dispatch(setSelectedCat(elt));
    if (elt.hasSubCat) {
      navigate(`${routePaths.adminCategories}/${elt.id}/subCat`);
    } else {
      navigate(`${routePaths.adminCategories}/${elt.id}`);
    }
  };
  const onSubCatItemClick = (elt: TSubCat) => {
    navigate(`${routePaths.adminCategories}/${id_cat}/subCat/${elt.id}`);
    dispatch(setSelectedSubCat(elt));
  };

  const renderNewButton = () => {
    return (
      <Button
        className="new-button"
        label={id_cat ? "Nouvelle Sous-catégorie" : "Nouvelle Catégorie"}
        color="var(--ui-primary)"
        Icon={<Icon icon="material-symbols:add" fontSize={18} />}
        onClick={() => {
          /*le formulaire à ouvrir*/
        }}
      />
    );
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
        {renderNewButton()}
        <div className="list">
          {!loading ? (
            catList.map((elt) => (
              <AdminCatCardUIC
                key={elt.id}
                item={elt}
                onDelete={() => {
                  /*Action de suppression attendue*/
                }}
                onModify={() => {
                  /*Action de modification attendue*/
                }}
                onView={() => {
                  onCatItemClick(elt);
                }}
              />
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
        <div className="admin-subCat-title">
          <span className="admin-subCat-title__image">
            <img src={selectedCat.image_url} alt={selectedCat.label} />
          </span>
          <div className="admin-subCat-title__left">
            <h3 className="cat-label">{selectedCat.label}</h3>
            <span className="cat-quantity">
              ({subCatList.length}) sous-catégorie(s){" "}
            </span>
          </div>
        </div>

        {renderNewButton()}
        <div className="list">
          {!loading ? (
            subCatList.map((elt) => (
              <AdminCatCardUIC
                key={elt.id}
                item={elt}
                onDelete={() => {
                  /*Action de suppression attendue*/
                }}
                onModify={() => {
                  /*Action de modification attendue*/
                }}
                onView={() => {
                  onSubCatItemClick(elt);
                }}
              />
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
    <div className="p-admin-items">
      <Button
        className="return-button"
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
  selectedCat: selectAdminSelectedCat,
});
const connector = connect(mapStateToProps);

export default connector(PAdminItems);
