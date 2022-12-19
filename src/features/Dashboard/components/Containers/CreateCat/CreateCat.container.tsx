import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Modal } from "@mui/material";

import { TCat, TSubCat } from "@/types";
import { FormikHelpers } from "formik";

import "./CreateCat.container.styles.scss";
import FCategory from "../../Forms/Category/Category.form";

export type TCatFormValues = {
  name: string;
  file?: File | null;
};

const defaultValues: TCatFormValues = {
  name: "",
  file: null,
};

type CCreateCatProps = {
  open: boolean;
  handleClose: (refetch?: boolean) => void;
  operation: "Create" | "Update";
  selectedItem: TCat | TSubCat | null;
};
const CCreateCat: FC<CCreateCatProps> = ({
  handleClose,
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

  const handleSubmit = (
    values: TCatFormValues,
    { resetForm, setSubmitting }: FormikHelpers<TCatFormValues>
  ) => {
    console.log("Submission des catégories");
  };

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

export default CCreateCat;
