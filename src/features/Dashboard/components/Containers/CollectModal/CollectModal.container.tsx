import { FC } from "react";

import { Modal } from "@mui/material";

import { TTypeArticle } from "@/types";

interface CCollectModalProps {
  open: boolean;
  devisDetail: { article: TTypeArticle }[];
}
const CCollectModal: FC<CCollectModalProps> = ({ devisDetail, open }) => {
  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        // if (reason !== "backdropClick") handleClose();
      }}
    >
      <div className="c-collect-modal">
        <h4 className="title">Vérification des articles</h4>
      </div>
    </Modal>
  );
};

export default CCollectModal;
