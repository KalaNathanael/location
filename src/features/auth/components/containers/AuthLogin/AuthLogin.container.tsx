import { FC } from "react";
import { FormikHelpers, FormikValues } from "formik";
import { connect, ConnectedProps } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { createStructuredSelector } from "reselect";
import * as Yup from "yup";

import LoginForm from "../../Forms/Login/Login.form";
import { selectDumbValue } from "@/store/reducers/dumb/dumb.selector";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";

export type TAuthValues = {
  login: string;
  password: string;
};

const defaultValues: TAuthValues = {
  login: "",
  password: "",
};

type AuthLoginContainerProps = ConnectedProps<typeof connector>;
const AuthLoginContainer: FC<AuthLoginContainerProps> = ({ dumb }) => {
  let navigate = useNavigate();
  const validationSchema: any = Yup.object({
    login: Yup.string().required("Le login est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
  });

  const handleSubmit = (
    values: FormikValues,
    { resetForm, setSubmitting }: FormikHelpers<FormikValues>
  ) => {
    console.log({ values });
    navigate(routePaths.home);
  };

  return (
    <div className="c-auth-login">
      <LoginForm
        handleSubmit={handleSubmit}
        initialValues={defaultValues}
        validationSchema={validationSchema}
        errorFromAPI={false}
        loading={false}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  dumb: selectDumbValue,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
) => ({});

const connector = connect(mapStateToProps);
export default connector(AuthLoginContainer);
// export default AuthLoginContainer;
