import { FC, useState, useLayoutEffect } from "react";
import { FormikHelpers } from "formik";
import { createStructuredSelector } from "reselect";

import { Modal } from "@mui/material";

import FUser from "../../Forms/User/User.form";

import "./CreateUser.container.styles.scss";
import { store } from "@/store";
import { createUserAction } from "@/store/reducers/admin/admin.action";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { selectAdminUsersError } from "@/store/reducers/admin/admin.selector";
import { connect, ConnectedProps } from "react-redux";
import { TUser } from "@/types/user";

export type TUserValues = {
  lastName: string;
  firstName: string;
  email: string;
  telephone: string;
  profil: number | null;
};
const defaultValues: TUserValues = {
  lastName: "",
  firstName: "",
  email: "",
  telephone: "",
  profil: null,
};

type CCreateUserProps = ConnectedProps<typeof connector> & {
  open: boolean;
  handleClose: () => void;
  selectedUser: TUser | null;
};
const CCreateUser: FC<CCreateUserProps> = ({
  handleClose,
  open,
  userError,
  selectedUser,
}) => {
  const dispatch = store.dispatch;

  const [initialValues, setInitialValues] =
    useState<TUserValues>(defaultValues);

  useLayoutEffect(() => {
    if (selectedUser) {
      setInitialValues({
        email: selectedUser.email,
        firstName: selectedUser.prenoms,
        lastName: selectedUser.noms,
        profil: selectedUser.profil.id,
        telephone: selectedUser.telephone,
      });
    }
  }, [selectedUser]);

  const handleSubmit = async (
    values: TUserValues,
    { resetForm, setSubmitting }: FormikHelpers<TUserValues>
  ) => {
    if (!selectedUser) {
      const res = await dispatch(createUserAction(values));
      if (createUserAction.fulfilled.match(res)) {
        resetForm();
        ToastSuccess.fire({ text: "L'utilisateur a été créé avec succès." });
        handleClose();
      } else if (createUserAction.rejected.match(res)) {
        ToastError.fire({ text: userError.message });
      }
      setSubmitting(false);
    } else {
      //lorsque la modification sera disponible
    }
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") handleClose();
      }}
    >
      <div className="c-create-user">
        <h4 className="title">Création d'un utilisateur</h4>

        <div className="content">
          <FUser
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            initialValues={initialValues}
          />
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  userError: selectAdminUsersError,
});
const connector = connect(mapStateToProps);
export default connector(CCreateUser);
