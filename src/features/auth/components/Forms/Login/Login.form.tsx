import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Formik, FormikHelpers, FormikValues, getIn } from "formik";
import { FC, useEffect, useState } from "react";

import "./Login.styles.scss";
import Button from "@/components/UICs/Button/Button.uic";

interface LoginFormProps {
  validationSchema: any;
  initialValues: FormikValues;
  handleSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => void | Promise<any>;
  errorFromAPI: boolean;
  loading: boolean;
}
const LoginForm: FC<LoginFormProps> = ({
  validationSchema,
  initialValues,
  errorFromAPI,
  loading,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    setApiError(errorFromAPI);
  }, [errorFromAPI]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formik) => {
        const loginError = getIn(formik.errors, "login") || apiError;
        const passwordError = getIn(formik.errors, "password") || apiError;
        return (
          <form
            className="f-login"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-group">
              <FormControl variant="outlined" error={!!loginError}>
                <InputLabel htmlFor="login-field">Login</InputLabel>
                <OutlinedInput
                  id="login-field"
                  type="email"
                  label="Login"
                  name="login"
                  value={formik.values.login}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="refresh login field"
                        onClick={() => {
                          formik.setFieldValue("login", "");
                        }}
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                          e.preventDefault()
                        }
                        edge="end"
                      >
                        <CancelOutlinedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  onClick={() => setApiError(false)}
                  disabled={loading}
                />
                {!!loginError && (
                  <FormHelperText id="login-field-error">
                    {loginError}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="form-group">
              {/* <TextField
                id="password-field"
                label="Mot de passe"
                variant="outlined"
                error={!!passwordError}
                helperText={passwordError}
              /> */}
              <FormControl
                variant="outlined"
                error={!!passwordError}
                disabled={loading}
              >
                <InputLabel htmlFor="login-field">Mot de passe</InputLabel>
                <OutlinedInput
                  id="password-field"
                  type={showPassword ? "text" : "password"}
                  label="Mot de passe"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="show password"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                          e.preventDefault()
                        }
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onClick={() => setApiError(false)}
                />
                {!!passwordError && (
                  <FormHelperText id="login-password-error">
                    {passwordError}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="button-group">
              <div className="submit-button">
                <Button
                  type="submit"
                  isLoading={loading}
                  label="Connexion"
                  disabled={!formik.isValid || loading}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
