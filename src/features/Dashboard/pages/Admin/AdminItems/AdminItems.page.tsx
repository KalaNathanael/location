import "./AdminItems.page.styles.scss";

import { FC, useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";
import { Box, Skeleton } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import AdminCatCardUIC from "@/features/Dashboard/components/elements/AdminCatCard.uic";
import CCreateCat from "@/features/Dashboard/components/Containers/CreateCat/CreateCat.container";
import Button from "@/components/UICs/Button/Button.uic";

import { store } from "@/store";
import {
  clearSelectedCat,
  setSelectedCat,
  setSelectedSubCat,
} from "@/store/reducers/admin/admin.reducer";
import { selectAdminSelectedCat } from "@/store/reducers/admin/admin.selector";
import { selectConnectedUser } from "@/store/reducers/app/app.selector";

import {
  APIdeleteCategories,
  APIdeleteSubCategories,
  APIfetchCategories,
  APIfetchSubCategories,
} from "@/features/Dashboard/api/category.api";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { routePaths } from "@/config";

import { TCat, TSubCat } from "@/types";

type PAdminItemsProps = ConnectedProps<typeof connector>;
const PAdminItems: FC<PAdminItemsProps> = ({ selectedCat, connectedUser }) => {
  const isUserAdmin: boolean = connectedUser?.profil.id === 2;

  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const { id_cat } = useParams();

  const [catList, setCatList] = useState<TCat[]>([]);
  const [subCatList, setSubCatList] = useState<TSubCat[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TCat | TSubCat | null>(null);
  const [operation, setOperation] = useState<"Create" | "Update">("Create");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_cat]);

  const getItems = () => {
    if (id_cat) {
      getSubCatList();
    } else {
      getCatList();
    }
  };

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

  async function deleteItem(elt: TCat | TSubCat) {
    const API = id_cat ? APIdeleteSubCategories : APIdeleteCategories;

    Swal.fire({
      title: `Suppression d'une ${id_cat ? "sous-catégorie" : "catégorie"}`,
      text: `Vous vous apprêtez à supprimer la ${
        id_cat ? "sous-catégorie" : "catégorie"
      } ${elt.label}, êtes-vous sûr de vouloir le faire ?`,
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer",
      confirmButtonColor: "var(--ui-primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log("daoidnaofia");
        API(elt.id)
          .then((response) => {
            ToastSuccess.fire({
              title:
                (id_cat ? "La sous-catégorie" : "La catégorie") +
                ` ${elt.label}` +
                " a été supprimée.",
            });

            if (id_cat) getSubCatList();
            else getCatList();
          })
          .catch((err) => {
            throw err;
          });
      }
    });
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

  const handleCloseModal = (refetch?: boolean) => {
    if (refetch) {
      //console.log("un an et demi");
      if (id_cat) getSubCatList();
      else getCatList();
    }
    setOpenModal(false);
  };

  const renderNewButton = () => {
    return (
      <Button
        className="new-button"
        label={id_cat ? "Nouvelle Sous-catégorie" : "Nouvelle Catégorie"}
        color="var(--ui-primary)"
        Icon={<Icon icon="material-symbols:add" fontSize={18} />}
        onClick={() => {
          setOperation("Create");
          setOpenModal(true);
          setSelectedItem(null);
        }}
      />
    );
  };

  const renderCategories = () => {
    return (
      <>
        <h2 className="subtitle">Liste des Catégories d'articles</h2>
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
                rights={{
                  delete: isUserAdmin,
                  update: isUserAdmin
                }}
                onDelete={() => {
                  deleteItem(elt);
                }}
                onModify={() => {
                  //console.log({ elt });
                  setSelectedItem(elt);
                  setOpenModal(true);
                  setOperation("Update");
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
                rights={{
                  delete: isUserAdmin,
                  update: isUserAdmin
                }}
                onDelete={() => {
                  deleteItem(elt);
                }}
                onModify={() => {
                  setSelectedItem(elt);
                  setOpenModal(true);
                  setOperation("Update");
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
    <div className="page p-admin-items">
      {/* <Button
        className="return-button"
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => onReturnPage()}
      /> */}
      <h2>
        <IconButton
          aria-label="back-drop"
          color="primary"
          size="medium"
          onClick={() => onReturnPage()}
          sx={{ width: "fit-content" }}
        >
          <Icon icon="akar-icons:arrow-left" fontSize={20} />
        </IconButton>
        <span className="icon">
          <Icon icon="fluent-emoji-high-contrast:fork-and-knife-with-plate" fontSize={30} />
        </span>{" "}
        Gestion des articles
      </h2>
      {!id_cat ? renderCategories() : renderSubCategories()}
      <CCreateCat
        handleClose={handleCloseModal}
        open={openModal}
        operation={operation}
        selectedItem={selectedItem}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  selectedCat: selectAdminSelectedCat,
  connectedUser: selectConnectedUser
});
const connector = connect(mapStateToProps);

export default connector(PAdminItems);
