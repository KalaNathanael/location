import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, FormikHelpers, getIn } from "formik";

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
} from "@mui/material";

import { APIfetchProfils } from "@/features/Dashboard/api/admin";
import { IAutoCompleteList } from "@/interfaces";
import Button from "@/components/UICs/Button/Button.uic";
import { ToastError } from "@/utils/toast";

import "./User.form.styles.scss";

type FUserProps = {
  initialValues: any;
  handleSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  handleClose: () => void;
};
const FUser: FC<FUserProps> = ({
  handleClose,
  handleSubmit,
  initialValues,
}) => {
  const validationSchema: any = Yup.object({
    lastName: Yup.string().required("Le nom au moins est requis"),
    firstName: Yup.string().required("Un prénom au moins est requis"),
    email: Yup.string()
      .email("Veuillez rentrer une email valide")
      .required("L'email est requis"),
    telephone: Yup.string()
      .matches(
        /\+*\s*\d+/g,
        "Seul des chiffres et le symbole '+' sont attendus"
      )
      .min(10, "Veuillez rentrer un numéro valide")
      .required("Le numéro de tel est requis"),
    profil: Yup.number().nullable(true).required("Le profil est requis"),
  });

  const [profilsDatas, setProfilsDatas] = useState<IAutoCompleteList[]>([]);
  const [loadingProfils, setLoadingProfils] = useState<boolean>(false);

  useEffect(() => {
    getProfils();
  }, []);

  const getProfils = async () => {
    setLoadingProfils(true);
    APIfetchProfils()
      .then((res) => {
        if (res.error) {
          ToastError.fire({ text: res.message, timer: 6000 });
        } else {
          const data: any[] = res.data;
          const toSet: IAutoCompleteList[] = data.map((elt) => {
            return {
              id: elt.id,
              label: elt.libelle,
            };
          });
          setProfilsDatas(toSet);
        }
      })
      .catch((err) => {
        ToastError.fire();
      })
      .finally(() => {
        setLoadingProfils(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formik) => {
        const lastName = {
          error: getIn(formik.errors, "lastName"),
          touched: getIn(formik.touched, "lastName"),
        };
        const firstName = {
          error: getIn(formik.errors, "firstName"),
          touched: getIn(formik.touched, "firstName"),
        };
        const email = {
          error: getIn(formik.errors, "email"),
          touched: getIn(formik.touched, "email"),
        };
        const telephone = {
          error: getIn(formik.errors, "telephone"),
          touched: getIn(formik.touched, "telephone"),
        };
        let profil = {
          error: getIn(formik.errors, "profil"),
          touched: getIn(formik.touched, "profil"),
        };

        return (
          <form
            className="f-user"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-group">
              <FormControl
                size="small"
                variant="outlined"
                error={!!lastName.error && lastName.touched}
              >
                <InputLabel htmlFor="id-field">Nom(s)</InputLabel>
                <OutlinedInput
                  id="lastName-field"
                  type="text"
                  label="Nom(s)"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!lastName.error && lastName.touched && (
                  <FormHelperText id="id-field-error">
                    {lastName.error}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-group">
              <FormControl
                size="small"
                variant="outlined"
                error={!!firstName.error && firstName.touched}
              >
                <InputLabel htmlFor="id-field">Prénom(s)</InputLabel>
                <OutlinedInput
                  id="firstName-field"
                  type="text"
                  label="Prénom(s)"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!firstName.error && firstName.touched && (
                  <FormHelperText id="id-field-error">
                    {firstName.error}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-group">
              <FormControl
                size="small"
                variant="outlined"
                error={!!email.error && email.touched}
              >
                <InputLabel htmlFor="id-field">Email</InputLabel>
                <OutlinedInput
                  id="email-field"
                  type="email"
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!email.error && email.touched && (
                  <FormHelperText id="id-field-error">
                    {email.error}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-group">
              <FormControl
                size="small"
                variant="outlined"
                error={!!telephone.error && telephone.touched}
              >
                <InputLabel htmlFor="id-field">Numéro de téléphone</InputLabel>
                <OutlinedInput
                  id="telephone-field"
                  type="text"
                  label="Numéro de téléphone"
                  name="telephone"
                  value={formik.values.telephone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!telephone.error && telephone.touched && (
                  <FormHelperText id="id-field-error">
                    {telephone.error}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-group">
              <label
                className={`profil-label ${
                  !!profil.error && profil.touched ? " error" : ""
                }`}
                htmlFor="profil-field"
              >
                Profil
              </label>
              {!loadingProfils ? (
                <>
                  {" "}
                  <Select
                    id="profil-field"
                    name="profil"
                    value={formik.values.profil ? formik.values.profil : ""}
                    onChange={(e) => {
                      formik.setFieldValue("profil", e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    size="small"
                    error={!!profil.error && profil.touched}
                  >
                    {profilsDatas.map((elt) => (
                      <MenuItem key={"profil" + elt.id} value={elt.id}>
                        {elt.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {!!profil.error && profil.touched && (
                    <FormHelperText id="id-field-error">
                      {profil.error}
                    </FormHelperText>
                  )}
                </>
              ) : (
                <Box sx={{ width: "100%", marginBottom: "4px" }}>
                  <Skeleton variant="rounded" height={"36px"} />
                </Box>
              )}
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
                  label="Créer"
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

export default FUser;
