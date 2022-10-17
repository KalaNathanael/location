import { FC } from "react";
import heart from "@/assets/images/coeur_ci.png";

import "./ItemsList.styles.scss";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";

const PItemList: FC = () => {
  const navigate = useNavigate();
  const falseElt = {
    id: "humu",
    name: "Élément",
    imageUrl: heart,
  };

  return (
    <div className="p-items-list">
      <h2>Liste des éléments louables</h2>
      <p>
        Tips : Sélectionnez un type d'objet et choisissez dans la liste
        d'éléments générés, les éléments et leurs quantités qui vous
        intéressent.
      </p>
      <div className="list">
        {Array(11)
          .fill(0)
          .map((elt, idx) => (
            <div
              className="item-card"
              id={falseElt.id + idx}
              onClick={() => {
                navigate(`${routePaths.locationList}/${falseElt.id + idx}`);
              }}
            >
              <span className="item-image">
                <img src={falseElt.imageUrl} alt="representative" />
              </span>
              <span className="item-name">
                {falseElt.name + " " + (idx + 1)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PItemList;
