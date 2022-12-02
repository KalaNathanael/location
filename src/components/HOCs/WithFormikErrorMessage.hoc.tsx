import { FormikErrors, FormikTouched, FormikValues, getIn } from "formik";

type TFormikProps = {
  errors: FormikErrors<FormikValues>;
  touched: FormikTouched<FormikValues>;
  name: string | string[];
};
const WithFormikErrorMessage: (
  WrappedComponent: any
) => React.FC<TFormikProps> =
  (WrappedComponent) =>
  ({ errors, touched, name, ...otherProps }) => {
    const error = getIn(errors, name);
    const touch = getIn(touched, name);

    return touch && error && typeof error === "string" ? (
      <WrappedComponent message={error} {...otherProps} />
    ) : null;
  };

export default WithFormikErrorMessage;
