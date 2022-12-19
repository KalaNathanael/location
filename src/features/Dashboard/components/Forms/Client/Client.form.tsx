import { FC } from "react";
import { Formik, FormikHelpers, getIn } from "formik";
import * as Yup from "yup";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import { TClientValues } from "../../Containers/CreateClient/CreateClient.conatainer";
import Button from "@/components/UICs/Button/Button.uic";

import "./Client.form.styles.scss";

type FClientProps = {
  initialValues: TClientValues;
  handleSubmit: (
    values: TClientValues,
    formikHelpers: FormikHelpers<TClientValues>
  ) => void | Promise<any>;
  handleClose: () => void;
};
const FClient: FC<FClientProps> = ({
  initialValues,
  handleClose,
  handleSubmit,
}) => {
  const validationSchema: any = Yup.object({
    email: Yup.string()
      .email("Veuillez rentrer un e-mail valide.")
      .required("L'email est requis"),
    tel: Yup.string().required("Le numéro de tel est requis"),
    type: Yup.string(),
    companyName: Yup.string().test({
      name: "companyRequired",
      message: `Le nom de la companie est requis`,
      test: function (value) {
        const { type } = this.parent;
        if (type === "Entreprise") {
          if (value === "" || value === undefined) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    }),
    lastName: Yup.string().test({
      name: "firstNameRequired",
      message: `Un nom est requis`,
      test: function (value) {
        const { type } = this.parent;
        if (type === "Personne") {
          if (value === "" || value === undefined) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    }),
    firstName: Yup.string().test({
      name: "lastNameRequired",
      message: `Un prénom est requis`,
      test: function (value) {
        const { type } = this.parent;
        if (type === "Personne") {
          if (value === "" || value === undefined) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    }),
  });

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
        const companyName = {
          error: getIn(formik.errors, "companyName"),
          touched: getIn(formik.touched, "companyName"),
        };
        const email = {
          error: getIn(formik.errors, "email"),
          touched: getIn(formik.touched, "email"),
        };
        const tel = {
          error: getIn(formik.errors, "tel"),
          touched: getIn(formik.touched, "tel"),
        };

        return (
          <form
            className="f-client"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-group">
              <FormControl sx={{ marginTop: "14px" }}>
                <FormLabel id="type-row-radio-buttons-group-label">
                  Type de client
                </FormLabel>
                <RadioGroup
                  name="type"
                  aria-labelledby="type-row-radio-buttons-group-label"
                  row
                  value={formik.values.type}
                  onChange={(e) => {
                    let newValue = (e.target as HTMLInputElement).value;
                    formik.setFieldValue("type", newValue);
                  }}
                >
                  <FormControlLabel
                    label="Personne"
                    value={"Personne"}
                    control={<Radio />}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        typography: {
                          fontSize: "14px",
                        },
                      },
                    }}
                  />
                  <FormControlLabel
                    label="Entreprise"
                    value={"Entreprise"}
                    control={<Radio />}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        typography: {
                          fontSize: "14px",
                        },
                      },
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </div>
            {formik.values.type === "Personne" && (
              <>
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
              </>
            )}
            {formik.values.type === "Entreprise" && (
              <>
                <div className="form-group">
                  <FormControl
                    size="small"
                    variant="outlined"
                    error={!!companyName.error && companyName.touched}
                  >
                    <InputLabel htmlFor="id-field">Raison sociale</InputLabel>
                    <OutlinedInput
                      id="companyName-field"
                      type="text"
                      label="Raison sociale"
                      name="companyName"
                      value={formik.values.companyName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!companyName.error && companyName.touched && (
                      <FormHelperText id="id-field-error">
                        {companyName.error}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              </>
            )}
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
                error={!!tel.error && tel.touched}
              >
                <InputLabel htmlFor="id-field">Numéro de téléphone</InputLabel>
                <OutlinedInput
                  id="tel-field"
                  type="text"
                  label="Numéro de téléphone"
                  name="tel"
                  value={formik.values.tel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!tel.error && tel.touched && (
                  <FormHelperText id="id-field-error">
                    {tel.error}
                  </FormHelperText>
                )}
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

export default FClient;
