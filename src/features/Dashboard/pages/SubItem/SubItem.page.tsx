import { TSubItem } from "@/types";
import { useState, FC, SyntheticEvent } from "react";
import CSubItemPanel from "../../components/Conainers/SubItemPanel/SubItemPanel.container";

import "./SubItem.styles.scss";

const PSubItem: FC = () => {
  const falseSubItems: TSubItem[] = Array(5)
    .fill(0)
    .map((elt, idx) => {
      return {
        id: "sub-" + (idx + 1),
        available_qte: 3 * (idx + 1),
        total_qte: 4 * (idx + 1),
        label: "Sous-catégorie " + (idx + 1),
      };
    });
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeAccordions =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="p-sub-item">
      <h3> Catégorie sélectionnée </h3>
      <p>
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
        mollitia, molestiae quas vel sint commodi repudiandae consequuntur
        voluptatum laborum numquam blanditiis harum quisquam eius sed odit
        fugiat iusto fuga praesentium optio, eaque rerum! Provident similique
        accusantium nemo autem.{" "}
      </p>
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

export default PSubItem;
