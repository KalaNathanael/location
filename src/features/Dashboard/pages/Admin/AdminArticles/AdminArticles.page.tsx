import { FC, useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { Typography, Button as MuiButton } from "@mui/material";

import { Icon } from "@iconify/react";

import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import Button from "@/components/UICs/Button/Button.uic";

import { routePaths } from "@/config";

import { selectAdminSelectedSubCat } from "@/store/reducers/admin/admin.selector";
import { TArticle } from "@/types";
import { APIfetchArticles } from "@/features/Dashboard/api/article.api";
import { ToastError } from "@/utils/toast";

import "./AdminArticles.page.styles.scss";
import { formatPriceOnDisplay } from "@/utils";

type PAdminArticlesProps = ConnectedProps<typeof connector>;
const PAdminArticles: FC<PAdminArticlesProps> = ({ selectedSubCat }) => {
  const tableColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      disableColumnMenu: true,
    },
    {
      field: "label",
      headerName: "Nom",
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className="article-cell">
            <span className="img">
              <img src={params.row.image_url} alt={params.value} />
            </span>
            <span className="label">{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Prix (FCFA)",
      minWidth: 150,
      align: "center",
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {formatPriceOnDisplay(params.value)}
          </Typography>
        );
      },
    },
    {
      field: "total_qte",
      headerName: "Quantité totale",
      minWidth: 150,
      align: "center",
      disableColumnMenu: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "available_qte",
      headerName: "Quantité disponible",
      minWidth: 150,
      align: "center",
      disableColumnMenu: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Date de création",
      minWidth: 150,
      align: "center",
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value.toLocaleDateString()}
          </Typography>
        );
      },
    },
    {
      field: "updated_at",
      headerName: "Dernière modification",
      minWidth: 150,
      align: "center",
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value ? params.value.toLocaleDateString() : "-"}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 220,
      align: "center",
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className="actions">
            <MuiButton
              aria-label="modify"
              color="primary"
              onClick={() => {
                //actions de modification attendues
              }}
              variant="contained"
              sx={{ color: "white" }}
            >
              Modifier
            </MuiButton>
            <MuiButton
              aria-label="suppress"
              color="error"
              onClick={() => {
                // visualizeSheet(url);
              }}
              variant="contained"
              sx={{ color: "white" }}
              disabled={true}
            >
              Supprimer
            </MuiButton>
          </div>
        );
      },
    },
  ];
  const navigate = useNavigate();
  const { id_cat, id_subCat } = useParams();

  const [articles, setArticles] = useState<TArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedSubCat) navigate(routePaths.adminCategories);
    else {
      getArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_subCat]);

  async function getArticles() {
    setLoading(true);
    try {
      const response = await APIfetchArticles(id_subCat);

      if (response.error) {
        ToastError.fire({
          text: response.message,
          timer: 6000,
        });
      } else {
        let datas: any[] = response.data;
        let toSet: TArticle[] = datas.map((elt) => {
          return {
            id: elt.id,
            available_qte: elt.qte_disponible,
            label: elt.libelle,
            price: elt.prix_location,
            total_qte: elt.qte_total,
            image_url: elt.img_path,
            set: elt.qte_set,
            updated_at: elt.updated_at ? new Date(elt.created_at) : null,
            created_at: new Date(elt.created_at),
          };
        });
        setArticles(toSet);
      }
    } catch (err: any) {
      ToastError.fire();
    }
    setLoading(false);
  }

  return (
    <div className="p-admin-articles">
      <Button
        className="return-button"
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => {
          navigate(`${routePaths.adminCategories}/${id_cat}/subCat`);
        }}
      />

      <div className="admin-subCat-title">
        <span className="admin-subCat-title__image">
          <img src={selectedSubCat.image_url} alt={selectedSubCat.label} />
        </span>
        <div className="admin-subCat-title__left">
          <h3 className="cat-label">{selectedSubCat.label}</h3>
          <span className="cat-quantity">({articles.length}) article(s) </span>
        </div>
      </div>

      <Button
        className="new-button"
        label={"Nouvel article"}
        color="var(--ui-primary)"
        Icon={<Icon icon="material-symbols:add" fontSize={18} />}
        onClick={() => {
          //   setOperation("Create");
          //   setOpenModal(true);
          //   setSelectedItem(null);
        }}
      />

      <TableViewer
        rows={articles}
        columns={tableColumns}
        loading={loading}
        rowPerPage={[5, 10, 20]}
        rowHeight={100}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  selectedSubCat: selectAdminSelectedSubCat,
});
const connector = connect(mapStateToProps);

export default connector(PAdminArticles);
