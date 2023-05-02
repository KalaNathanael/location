import "./CollectArticle.form.styles.scss";

import { FC } from "react";
import { FormikHelpers, getIn, useFormik } from "formik";
import * as Yup from "yup";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import WithFormikErrorMessage from "@/components/HOCs/WithFormikErrorMessage.hoc";
import FormErrorMessage from "@/components/UICs/Forms/FormErrorMessage/FormErrorMessage.iuc";

import { TCollectFormValues } from "../../Containers/CollectModal/CollectModal.container";

const ErrorMessage = WithFormikErrorMessage(FormErrorMessage);

type FCollectArticleProps = {
  deliveredArticles: number;
  initialValues: TCollectFormValues;
  isLastStep: () => boolean;
  handleSubmit: (
    values: TCollectFormValues,
    formikHelpers: FormikHelpers<TCollectFormValues>
  ) => Promise<void> | void;
  handleBack: () => void;
};
const FCollectArticle: FC<FCollectArticleProps> = ({
  handleSubmit,
  handleBack,
  isLastStep,
  initialValues,
  deliveredArticles,
}) => {
  const validationSchema: any = Yup.object({
    qte_retour: Yup.number()
      .max(
        deliveredArticles,
        "La quantité retournée ne peut pas dépasser la quantité louée"
      )
      .min(0, "Pas de valeurs négatives")
      .required("Cette information est importante"),
    qte_damaged: Yup.number()
      .min(0, "Pas de valeurs négatives")
      .required("Cette information est importante")
      .test({
        name: "limite_dommagée",
        message:
          "La quantité endommagée ne peut pas dépasser la quantité retournée",
        test: function (value) {
          const { qte_retour } = this.parent;
          if (value > qte_retour) {
            return false;
          } else {
            return true;
          }
        },
      }),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const fieldStatus: { [key: string]: { error: string; touched: boolean } } = {
    qte_retour: {
      error: getIn(formik.errors, "qte_retour"),
      touched: getIn(formik.touched, "qte_retour"),
    },
    qte_damaged: {
      error: getIn(formik.errors, "qte_damaged"),
      touched: getIn(formik.touched, "qte_damaged"),
    },
  };

  return (
    <form
      className="f-collect-article"
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-data">
        <span className="label">Nombre d’articles loués :</span>
        <strong>{deliveredArticles}</strong>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="retrieve">Nombre d’articles retournés :</label>
          <FormControl
            size="small"
            variant="outlined"
            // error={!!name.error && name.touched}
          >
            {/* <InputLabel htmlFor="retrieve">
            Nombre d’articles retournés :{" "}
          </InputLabel> */}
            <OutlinedInput
              id="retrieve"
              type="number"
              // label="Nombre d’articles retournés : "
              name="qte_retour"
              value={formik.values.qte_retour}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              error={
                !!fieldStatus.qte_retour.error && fieldStatus.qte_retour.touched
              }
            />
          </FormControl>
        </div>
        <ErrorMessage
          errors={formik.errors}
          touched={formik.touched}
          name="qte_retour"
        />
      </div>

      <div className="form-group">
        <div>
          <label htmlFor="damaged">Nombre d’articles endommagés :</label>
          <FormControl
            size="small"
            variant="outlined"
            // error={!!name.error && name.touched}
          >
            {/* <InputLabel htmlFor="damaged">
            Nombre d’articles endommagés :{" "}
          </InputLabel> */}
            <OutlinedInput
              id="damaged"
              type="number"
              // label="Nombre d’articles endommagés : "
              name="qte_damaged"
              value={formik.values.qte_damaged}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              error={
                !!fieldStatus.qte_damaged.error &&
                fieldStatus.qte_damaged.touched
              }
            />
          </FormControl>
        </div>
        <ErrorMessage
          errors={formik.errors}
          touched={formik.touched}
          name="qte_damaged"
        />
      </div>

      <div className="button-group">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ color: "white" }}
          disabled={!formik.isValid}
        >
          {"Enregistrer"}
        </Button>
        <Button
          variant="text"
          color="primary"
          disabled={isLastStep()}
          onClick={handleBack}
        >
          Précédent
        </Button>
      </div>
    </form>
  );
};

export default FCollectArticle;
