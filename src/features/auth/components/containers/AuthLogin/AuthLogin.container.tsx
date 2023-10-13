import { FC, useState } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";

import LoginForm from "../../Forms/Login/Login.form";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";
import { APIauth } from "@/features/auth/api/auth.api";
import { ToastError } from "@/utils/toast";
import { TUser } from "@/types/user";
import { store } from "@/store";
import { setConnectedUser } from "@/store/reducers/app/app.reducer";

export type TAuthValues = {
  login: string;
  password: string;
};

const defaultValues: TAuthValues = {
  login: "",
  password: "",
};

// type AuthLoginContainerProps = ConnectedProps<typeof connector>;
const AuthLoginContainer: FC = () => {
  const dispatch = store.dispatch;
  let navigate = useNavigate();
  const validationSchema: any = Yup.object({
    login: Yup.string().required("Le login est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    values: TAuthValues,
    { resetForm, setSubmitting }: FormikHelpers<TAuthValues>
  ) => {
    //console.log({ values });
    setLoading(true);
    try {
      const response = await APIauth({
        login: values.login,
        password: values.password,
      });
      if (response.error) {
        ToastError.fire({
          text: response.message,
          timer: 6000,
        });
      } else {
        const { created_at, email, id, noms, prenoms, telephone, profil_id } =
          response.data;
        let toSet: TUser = {
          created_at: new Date(created_at),
          email,
          id: id,
          noms,
          prenoms,
          telephone,
          profil: {
            id: profil_id.id,
            libelle: profil_id.libelle,
          },
        };
        dispatch(setConnectedUser(toSet));
        navigate(routePaths.home);
      }
    } catch (reason: any) {
      if (reason.response.status === 400) {
        ToastError.fire({ text: reason.response.data.message, timer: 6000 });
      } else {
        ToastError.fire();
      }
    }
    setLoading(false);
  };

  return (
    <div className="c-auth-login">
      <LoginForm
        handleSubmit={handleSubmit}
        initialValues={defaultValues}
        validationSchema={validationSchema}
        errorFromAPI={false}
        loading={loading}
      />
    </div>
  );
};

// const mapStateToProps = createStructuredSelector({
//   dumb: selectDumbValue,
// });

// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<any, any, AnyAction>
// ) => ({});

// const connector = connect(mapStateToProps);
// export default connector(AuthLoginContainer);
export default AuthLoginContainer;
