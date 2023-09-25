import "./CreateCat.container.styles.scss";

import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { FormikHelpers } from "formik";

import { Modal } from "@mui/material";

import FCategory from "../../Forms/Category/Category.form";

import { selectConnectedUser } from "@/store/reducers/app/app.selector";
import {
  APIaddCategories,
  APIaddSubCategories,
  APImodifyCategories,
  APImodifySubCategories,
} from "@/features/Dashboard/api/category.api";

import { TCat, TSubCat } from "@/types";
import { ToastError, ToastSuccess } from "@/utils/toast";

export type TCatFormValues = {
  name: string;
  file?: File | null;
};

const defaultValues: TCatFormValues = {
  name: "",
  file: null,
};

type CCreateCatProps = ConnectedProps<typeof connector> & {
  open: boolean;
  handleClose: (refetch?: boolean) => void;
  operation: "Create" | "Update";
  selectedItem: TCat | TSubCat | null;
};
const CCreateCat: FC<CCreateCatProps> = ({
  handleClose,
  connectedUser,
  open,
  operation,
  selectedItem,
}) => {
  const { id_cat } = useParams();
  const [initialValues, setInitialValues] =
    useState<TCatFormValues>(defaultValues);

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
        name: selectedItem.label,
        file: file,
      });
    }
  };

  const handleSubmit = async (
    values: TCatFormValues,
    { resetForm, setSubmitting }: FormikHelpers<TCatFormValues>
  ) => {
    try {
      if (operation === "Create") {
        await createItem(values);
      } else {
        await modifyItem(values);
      }
    } catch (e) {
      ToastError.fire();
    } finally {
      setSubmitting(false);
    }
  };

  async function createItem(values: TCatFormValues) {
    const API = id_cat ? APIaddSubCategories : APIaddCategories;
    try {
      const response = await API(
        String(connectedUser.id),
        values.name,
        values.file!,
        id_cat
      );
      if (response.error) {
        ToastError.fire({ title: response.message });
      } else {
        ToastSuccess.fire();

        handleClose(true);
      }
    } catch (e) {
      throw e;
    }
  }
  async function modifyItem(values: TCatFormValues) {
    const API = id_cat ? APImodifySubCategories : APImodifyCategories;
    try {
      const response = await API({
        categoryId: id_cat ? id_cat : (selectedItem.id as string),
        file: values.file,
        libelle: values.name,
        subCatId: id_cat !== "" ? selectedItem.id : undefined,
        userId: String(connectedUser.id),
      });
      if (response.error) {
        ToastError.fire({ title: response.message });
      } else {
        ToastSuccess.fire();
        handleClose(true);
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
      <div className="c-create-category">
        <h4 className="title">
          {operation === "Create" ? "Création" : "Modification"} d'une{" "}
          {id_cat ? "sous-catégorie" : "catégorie"}
        </h4>

        <div className="content">
          <FCategory
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
export default connector(CCreateCat);
