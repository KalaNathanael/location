import { useState, FC, SyntheticEvent, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/UICs/Button/Button.uic";
import CSubItemPanel from "../../components/Conainers/SubItemPanel/SubItemPanel.container";

import { TSubItem } from "@/types";
import { routePaths } from "@/config";

import { selectItemsSelectedItems } from "@/store/reducers/items/items.selector";

import "./SubItem.styles.scss";

type PSubItemProps = ConnectedProps<typeof connector>;
const PSubItem: FC<PSubItemProps> = ({ selectedItem }) => {
  const navigate = useNavigate();
  const falseSubItems: TSubItem[] = Array(5)
    .fill(0)
    .map((elt, idx) => {
      return {
        id: "sub-" + (idx + 1),
        available_qte: 3 * (idx + 1),
        total_qte: 4 * (idx + 1),
        label: "Sous-catégorie " + (idx + 1),
        price: (5 - idx) * 500,
      };
    });
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (!selectedItem) {
      navigate(routePaths.locationList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeAccordions =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="p-sub-item">
      <Button
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => {
          navigate(routePaths.locationList);
        }}
      />
      <h3> {selectedItem?.label} </h3>
      <p>{selectedItem?.description}</p>
      <div className="sub-list">
        {falseSubItems.map((elt) => (
          <CSubItemPanel
            expanded={expanded === elt.id}
            onPanelChange={handleChangeAccordions(elt.id)}
            subItem={elt}
            key={elt.id}
          />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  selectedItem: selectItemsSelectedItems,
});
const connector = connect(mapStateToProps);
export default connector(PSubItem);
