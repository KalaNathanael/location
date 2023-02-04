import "./Article.form.styles.scss";
import { FC, useState } from "react";
import { FormikHelpers, getIn, useFormik } from "formik";
import * as Yup from "yup";

import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

import { TArticleFormValues } from "../../Containers/CreateArticle/CreateArticle.container";
import ButtonAdd from "@/components/UICs/Button/ButtonAdd/ButtonAdd.uic";
import FormInputFile from "@/components/UICs/Forms/FormInputFile/FormInputFile.uic";
import Button from "@/components/UICs/Button/Button.uic";
import WithFormikErrorMessage from "@/components/HOCs/WithFormikErrorMessage.hoc";
import FormErrorMessage from "@/components/UICs/Forms/FormErrorMessage/FormErrorMessage.iuc";

import { FILE_SIZE, SUPPORTED_FORMATS } from "@/config";

const ErrorMessage = WithFormikErrorMessage(FormErrorMessage);

type FArticleProps = {
  initialValues: TArticleFormValues;
  handleSubmit: (
    values: TArticleFormValues,
    formikHelpers: FormikHelpers<TArticleFormValues>
  ) => Promise<void>;
  handleClose: () => void;
  operation: "Create" | "Update";
};
const FArticle: FC<FArticleProps> = ({
  handleClose,
  handleSubmit,
  initialValues,
  operation,
}) => {
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
    label: Yup.string()
      .max(255, "Taille maximale atteinte")
      .required("Le nom est requis"),
    image: fileValidation(),
    available_qte: Yup.number()
      .required("La quantité disponible est requise")
      .test({
        name: "dispo",
        message: `La valeur disponible ne peut pas être supérieure à la valeur totale.`,
        test: function (value) {
          const { total_qte } = this.parent;
          if (value > total_qte) {
            return false;
          } else {
            return true;
          }
        },
      }),
    total_qte: Yup.number().required("La quantité totale est requise"),
    price: Yup.number()
      .min(5, "La valeur est trop peu réaliste.")
      .required("Le prix de la livraison est est requis."),
    set: Yup.number()
      .min(1, "La valeur minimale est de 1")
      .test({
        name: "set_to_deliver",
        message: `Le nombre de lot d'article ne peut pas être supérieure à la valeur totale.`,
        test: function (value) {
          const { total_qte } = this.parent;
          if (value > total_qte) {
            return false;
          } else {
            return true;
          }
        },
      })
      .required("Le nombre de lot d'article à la livraison est requis."),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const fieldStatus: { [key: string]: { error: string; touched: boolean } } = {
    label: {
      error: getIn(formik.errors, "label"),
      touched: getIn(formik.touched, "label"),
    },
    image: {
      error: getIn(formik.errors, "image"),
      touched: getIn(formik.touched, "image"),
    },
    available_qte: {
      error: getIn(formik.errors, "available_qte"),
      touched: getIn(formik.touched, "available_qte"),
    },
    price: {
      error: getIn(formik.errors, "price"),
      touched: getIn(formik.touched, "price"),
    },
    set: {
      error: getIn(formik.errors, "set"),
      touched: getIn(formik.touched, "set"),
    },
    total_qte: {
      error: getIn(formik.errors, "total_qte"),
      touched: getIn(formik.touched, "total_qte"),
    },
  };

  const addDocumentOnUpdate = () => {
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
            name={"image"}
            label="Importer une image"
            filename={formik.values["image"]}
            onChange={(value) => formik.setFieldValue("image", value)}
            value={formik.values["image"]}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="image"
          />
        </>
      );
    }
  };

  return (
    <form
      className="f-article"
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-group">{addDocumentOnUpdate()}</div>
      <div className="form-group">
        <FormControl
          size="small"
          variant="outlined"
          // error={!!name.error && name.touched}
        >
          <InputLabel htmlFor="id-field">Nom</InputLabel>
          <OutlinedInput
            id="label-field"
            type="text"
            label="Nom"
            name="label"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!fieldStatus.label.error && fieldStatus.label.touched}
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="label"
          />
        </FormControl>
      </div>
      <div className="form-group">
        <FormControl
          size="small"
          variant="outlined"
          // error={!!name.error && name.touched}
        >
          <InputLabel htmlFor="id-field">Prix de location (fcfa)</InputLabel>
          <OutlinedInput
            id="price-field"
            type="number"
            label="Prix de location (fcfa)"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            error={!!fieldStatus.price.error && fieldStatus.price.touched}
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="price"
          />
        </FormControl>
      </div>
      <div className="form-group">
        <FormControl
          size="small"
          variant="outlined"
          // error={!!name.error && name.touched}
        >
          <InputLabel htmlFor="id-field">Quantité totale</InputLabel>
          <OutlinedInput
            id="price-field"
            type="number"
            label="Quantité totale"
            name="total_qte"
            value={formik.values.total_qte}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            error={
              !!fieldStatus.total_qte.error && fieldStatus.total_qte.touched
            }
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="total_qte"
          />
        </FormControl>
      </div>
      <div className="form-group">
        <FormControl
          size="small"
          variant="outlined"
          // error={!!name.error && name.touched}
        >
          <InputLabel htmlFor="id-field">Quantité disponible</InputLabel>
          <OutlinedInput
            id="price-field"
            type="number"
            label="Quantité disponible"
            name="available_qte"
            value={formik.values.available_qte}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            error={
              !!fieldStatus.available_qte.error &&
              fieldStatus.available_qte.touched
            }
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="available_qte"
          />
        </FormControl>
      </div>
      <div className="form-group">
        <FormControl
          size="small"
          variant="outlined"
          // error={!!name.error && name.touched}
        >
          <InputLabel htmlFor="id-field">Articles par lot de vente</InputLabel>
          <OutlinedInput
            id="price-field"
            type="number"
            label="Articles par lot de vente"
            name="set"
            value={formik.values.set}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            error={!!fieldStatus.set.error && fieldStatus.set.touched}
          />
          <ErrorMessage
            errors={formik.errors}
            touched={formik.touched}
            name="set"
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
            label={`${operation === "Create" ? "Créer" : "Modifier"} l'article`}
            disabled={!formik.isValid}
          />
        </div>
      </div>
    </form>
  );
};

export default FArticle;
