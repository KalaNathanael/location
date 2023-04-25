import { useState, FC, SyntheticEvent, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/UICs/Button/Button.uic";
import CSubItemPanel from "../../../components/Containers/SubItemPanel/SubItemPanel.container";

import { TArticle } from "@/types";
import { routePaths } from "@/config";

import { store } from "@/store";
import {
  selectItemsSelectedCat,
  selectItemsSelectedSubCat,
} from "@/store/reducers/items/items.selector";
import {
  clearSelectedCat,
  clearSelectedSubCat,
} from "@/store/reducers/items/items.reducer";

import heart from "@/assets/images/coeur_ci.png";
import "./SubItem.styles.scss";
import { APIfetchArticles } from "@/features/Dashboard/api/article.api";
import { ToastError } from "@/utils/toast";
import { Box, Skeleton } from "@mui/material";

type PSubItemProps = ConnectedProps<typeof connector>;
const PSubItem: FC<PSubItemProps> = ({ selectedCat, selectedSubCat }) => {
  const navigate = useNavigate();
  const dispatch = store.dispatch;
  const { id_cat, id_subCat } = useParams();
  const falseSubItems: TArticle[] = Array(5)
    .fill(0)
    .map((elt, idx) => {
      return {
        id:
          (selectedCat ? selectedCat?.id : "") +
          (selectedSubCat ? selectedSubCat?.id : "") +
          "article-" +
          (idx + 1),
        available_qte: 3 * (idx + 1),
        total_qte: 4 * (idx + 1),
        label:
          (selectedCat ? selectedCat.id : "") +
          " " +
          (selectedSubCat ? selectedSubCat.id : "") +
          " " +
          "article " +
          (idx + 1),
        price: (5 - idx) * 500,
        image_url: heart,
        set: 1,
      };
    });

  const [expanded, setExpanded] = useState<string | false>(false);
  const [articles, setArticles] = useState<TArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedCat && !selectedSubCat) {
      navigate(routePaths.locationCategories);
    }
    if (id_subCat) {
      //API- récupérer la liste des articles de la sous-catégorie:  id = id_subCat
      getArticles();
    } else {
      //API- récupérer la liste des articles de la catégorie: id = id_cat
      setArticles(falseSubItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_cat, id_subCat]);

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
          };
        });
        setArticles(toSet);
      }
    } catch (err: any) {
      ToastError.fire();
    }
    setLoading(false);
  }

  const handleChangeAccordions =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="page p-sub-item">
      <Button
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => {
          if (id_subCat) {
            dispatch(clearSelectedSubCat());
            navigate(`${routePaths.locationCategories}/${id_cat}/subCat`);
          } else {
            dispatch(clearSelectedCat());
            navigate(routePaths.locationCategories);
          }
        }}
      />
      <h3>
        <img src={selectedSubCat?.image_url} alt="categorie-representative" />
        {id_subCat ? selectedSubCat?.label : selectedCat?.label}{" "}
      </h3>
      {/* <p>{selectedCat?.description}</p> */}
      <div className="sub-list">
        {!loading ? (
          articles.map((elt) => (
            <CSubItemPanel
              expanded={expanded === elt.id}
              onPanelChange={handleChangeAccordions(elt.id)}
              subItem={elt}
              key={elt.id}
            />
          ))
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "100%", marginBottom: "4px" }}>
              <Skeleton variant="rectangular" height={"52px"} />
            </Box>
            <Box sx={{ width: "100%", marginBottom: "4px" }}>
              <Skeleton variant="rectangular" height={"52px"} />
            </Box>
          </Box>
        )}
        {!loading && articles.length === 0 && (
          <span className="no-element">
            <Icon
              icon="mdi:clear-circle-outline"
              fontSize={18}
              color={"var(--ui-red-lighter)"}
            />{" "}
            Aucun Article
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  selectedCat: selectItemsSelectedCat,
  selectedSubCat: selectItemsSelectedSubCat,
});
const connector = connect(mapStateToProps);
export default connector(PSubItem);
