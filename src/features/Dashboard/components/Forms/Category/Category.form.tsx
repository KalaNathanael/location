import { FC, useState } from "react";
import { Formik, FormikHelpers, FormikProps, getIn } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

import { InputLabel, OutlinedInput, FormControl } from "@mui/material";

import ButtonAdd from "@/components/UICs/Button/ButtonAdd/ButtonAdd.uic";
import FormInputFile from "@/components/UICs/Forms/FormInputFile/FormInputFile.uic";
import FormErrorMessage from "@/components/UICs/Forms/FormErrorMessage/FormErrorMessage.iuc";
import Button from "@/components/UICs/Button/Button.uic";
import WithFormikErrorMessage from "@/components/HOCs/WithFormikErrorMessage.hoc";

import { TCatFormValues } from "../../Containers/CreateCat/CreateCat.container";
import { FILE_SIZE, SUPPORTED_FORMATS } from "@/config";

import "./Category.styles.scss";

const ErrorMessage = WithFormikErrorMessage(FormErrorMessage);

type FCategoryProps = {
  initialValues: TCatFormValues;
  handleSubmit: (
    values: TCatFormValues,
    formikHelpers: FormikHelpers<TCatFormValues>
  ) => Promise<void>;
  handleClose: () => void;
  operation: "Create" | "Update";
};
const FCategory: FC<FCategoryProps> = ({
  handleClose,
  handleSubmit,
  initialValues,
  operation,
}) => {
  const { id_cat } = useParams();

  const [addDocOnUpdate, setAddDocOnUpdate] = useState<boolean>(false);

  const fileValidation = () => {
    if (operation === "Update" && !addDocOnUpdate) {
      return Yup.mixed().notRequired();
    } else {
      return Yup.mixed()
        .required("Veuillez importer un fichier.")
        .test(
          "fileFormat",
          "Format non supporté",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        )
        .test("fileSize", "Votre fichier est trop volumineux", (value) =>
          value ? value.size <= FILE_SIZE : true
        );
    }
  };

  const validationSchema: any = Yup.object({
    name: Yup.string()
      .max(255, "Taille maximale atteinte")
      .required("Le nom est requis"),
    file: fileValidation(),
  });

  const addDocumentOnUpdate = (formik: FormikProps<TCatFormValues>) => {
    if (operation === "Update" && !addDocOnUpdate) {
      return (
        <ButtonAdd
          label="Enregistrer une autre image"
          onClick={() => setAddDocOnUpdate(true)}
        />
      );
    } else {
      return (
        <>
          <FormInputFile
            name={"file"}
            label="Importer une image"
            filename={formik.values["file"]}
            onChange={(value) => formik.setFieldValue("file", value)}
            value={formik.values["file"]}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="file"
          />
        </>
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formik) => {
        const name = {
          error: getIn(formik.errors, "name"),
          touched: getIn(formik.touched, "name"),
        };

        return (
          <form
            className="f-category"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-group">{addDocumentOnUpdate(formik)}</div>
            <div className="form-group">
              <FormControl
                size="small"
                variant="outlined"
                error={!!name.error && name.touched}
              >
                <InputLabel htmlFor="id-field">Nom(s)</InputLabel>
                <OutlinedInput
                  id="lastName-field"
                  type="text"
                  label="Nom(s)"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ErrorMessage
                  errors={formik.errors}
                  touched={formik.touched}
                  name="name"
                />
              </FormControl>
            </div>
            <div className="button-group">
              <div className="cancel-button">
                <Button
                  type="button"
                  label="Annuler"
                  onClick={() => {
                    handleClose();
                  }}
                  color="rgba(0, 0, 0, 0.6)"
                />
              </div>
              <div className="submit-button">
                <Button
                  type="submit"
                  isLoading={formik.isSubmitting}
                  color="var(--ui-primary)"
                  label={`${operation === "Create" ? "Créer" : "Modifier"} la ${
                    id_cat ? "sous-catégorie" : "catégorie"
                  }`}
                  disabled={!formik.isValid}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default FCategory;
