import "./CreateArticle.container.styles.scss";
import { FC, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams } from "react-router-dom";
import { FormikHelpers } from "formik";

import { Modal } from "@mui/material";

import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import { TArticle } from "@/types";
import FArticle from "../../Forms/Article/Article.form";
import { ToastError, ToastSuccess } from "@/utils/toast";
import {
  APIcreateArticle,
  APImodifyArticle,
} from "@/features/Dashboard/api/article.api";

export type TArticleFormValues = Omit<
  TArticle,
  "id" | "image_url" | "created_at" | "updated_at"
> & {
  image?: File | null;
};

const defaultValues: TArticleFormValues = {
  available_qte: 0,
  label: "",
  price: 0,
  set: 0,
  total_qte: 0,
  image: null,
};

type CCreateArticleProps = ConnectedProps<typeof connector> & {
  open: boolean;
  handleClose: () => void;
  operation: "Create" | "Update";
  selectedItem: TArticle | null;
  fetchArticles: () => Promise<void>;
};
const CCreateArticle: FC<CCreateArticleProps> = ({
  connectedUser,
  open,
  operation,
  selectedItem,
  handleClose,
  fetchArticles,
}) => {
  const { id_subCat, id_cat } = useParams();
  const [initialValues, setInitialValues] =
    useState<TArticleFormValues>(defaultValues);

  useEffect(() => {
    if (operation === "Create") {
      setInitialValues(defaultValues);
    } else {
      handleInitialValuesOnUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, selectedItem]);

  const handleInitialValuesOnUpdate = async () => {
    if (selectedItem) {
      let blob = await fetch(selectedItem.image_url).then((r) => r.blob());
      let file = new File([blob], selectedItem.label);
      setInitialValues({
        ...selectedItem,
        image: file,
      });
    }
  };

  const handleSubmit = async (
    values: TArticleFormValues,
    { resetForm, setSubmitting }: FormikHelpers<TArticleFormValues>
  ) => {
    setSubmitting(true);
    try {
      if (operation === "Create") {
        await createArticle(values);
      } else {
        await modifyArticle(values);
      }
      handleClose();
    } catch (e) {
      ToastError.fire();
    } finally {
      setSubmitting(false);
    }
  };

  async function createArticle(values: TArticleFormValues) {
    try {
      const response = await APIcreateArticle(
        values,
        id_cat,
        id_subCat,
        connectedUser.id
      );
      if (response?.error) {
        ToastError.fire({ title: response.message });
        throw response.error;
      } else {
        fetchArticles();
        ToastSuccess.fire({
          title: "L'article a été créé avec succès.",
        });
      }
    } catch (e) {
      throw e;
    }
  }
  async function modifyArticle(values: TArticleFormValues) {
    try {
      const response = await APImodifyArticle(
        values,
        id_cat,
        id_subCat,
        connectedUser.id,
        selectedItem.id
      );
      if (response?.error) {
        ToastError.fire({ title: response.message });
        throw response.error;
      } else {
        fetchArticles();
        ToastSuccess.fire({
          title: "L'article a été modifié avec succès.",
        });
      }
    } catch (e) {
      throw e;
    }
  }

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") handleClose();
      }}
    >
      <div className="c-create-article">
        <h4 className="title">
          {operation === "Create" ? "Création" : "Modification"} d'un article
        </h4>

        <div className="content">
          <FArticle
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            operation={operation}
          />
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  connectedUser: selectConnectedUser,
});
const connector = connect(mapStateToProps);
export default connector(CCreateArticle);
