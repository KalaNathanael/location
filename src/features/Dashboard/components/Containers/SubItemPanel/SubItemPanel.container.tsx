import { FC, useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";

import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Tooltip from "@mui/material/Tooltip";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@/components/UICs/Button/Button.uic";

import { TArticle } from "@/types";
import { store } from "@/store";
import {
  selectItemsBasket,
  selectItemsSelectedCat,
} from "@/store/reducers/items/items.selector";
import {
  addSubItemsInBasket,
  TBasket,
} from "@/store/reducers/items/items.reducer";

import heart from "@/assets/images/coeur_ci.png";

import "./SubItemPanel.styles.scss";

type CSubItemPanelProps = ConnectedProps<typeof connector> & {
  expanded: boolean;
  onPanelChange:
    | ((event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void)
    | undefined;
  subItem: TArticle;
};
const CSubItemPanel: FC<CSubItemPanelProps> = ({
  basket,
  selectedCat,
  expanded,
  subItem,
  onPanelChange,
}) => {
  const dispatch = store.dispatch;
  const [value, setValue] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<number>(0);

  useEffect(() => {
    let alter = basket as TBasket;
    if (alter[selectedCat?.id]) {
      let inBasket = alter[selectedCat.id].selectedSubItems.find(
        (elt) => elt.subItemId === subItem.id
      );
      if (inBasket) {
        setSelectedValue(inBasket.selectedQuantity);
      } else {
        setSelectedValue(0);
      }
    } else {
      setSelectedValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket]);

  const onMinus = () => {
    if (value - subItem.set >= 0) {
      setValue((value) => value - subItem.set);
    }
  };

  const onAdd = () => {
    if (value + subItem.set <= subItem.available_qte) {
      setValue((value) => value + subItem.set);
    }
  };

  const addToBasket = () => {
    dispatch(addSubItemsInBasket({ qte: value, subItem: subItem }));
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={onPanelChange}
      className="c-subitem-panel"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={subItem.id + "-content"}
        id={subItem.id + "-header"}
        className="panel-header"
      >
        <h6>{subItem.label}</h6>
        <div className="badges">
          <Tooltip
            sx={{ fontSize: "18px" }}
            title="Quantité totale"
            placement="top"
          >
            <span className="badge-metric blue">{subItem.total_qte}</span>
          </Tooltip>
          <Tooltip
            sx={{ fontSize: "18px" }}
            title="Quantité disponible"
            placement="top"
          >
            <span className="badge-metric green">{subItem.available_qte}</span>
          </Tooltip>
          <Tooltip
            sx={{ fontSize: "18px" }}
            title="Quantité selectionnée"
            placement="top"
          >
            <span className="badge-metric primary">{selectedValue}</span>
          </Tooltip>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="panel-content">
          <div className="left-part">
            <img src={subItem.image_url} alt={"Sous-catégorie"} />
          </div>
          <div className="right-part">
            <div className="up-form">
              <span>
                Location par set de : <em>{subItem.set}</em>
              </span>
              <p>Sélectionnez la quantité souhaitée</p>
              <div>
                <IconButton
                  aria-label="minus"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    onMinus();
                  }}
                >
                  <RemoveCircleIcon fontSize="inherit" />
                </IconButton>
                <input
                  type="number"
                  max={subItem.available_qte}
                  min={0}
                  value={value}
                  onChange={(e) => {
                    console.log({ e });
                    let newValue: number = Number(e.target.value);
                    if (newValue > subItem.available_qte) {
                      setValue(subItem.available_qte);
                    } else {
                      setValue(newValue);
                    }
                  }}
                  readOnly={subItem.set > 1}
                />
                <IconButton
                  aria-label="add"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    onAdd();
                  }}
                >
                  <AddCircleIcon fontSize="inherit" />
                </IconButton>
              </div>
            </div>
            <Button
              label="Ajouter au panier"
              className="submit-button"
              onClick={() => {
                addToBasket();
              }}
            />
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const mapStateToProps = createStructuredSelector({
  basket: selectItemsBasket,
  selectedCat: selectItemsSelectedCat,
});
const connector = connect(mapStateToProps);

export default connector(CSubItemPanel);
