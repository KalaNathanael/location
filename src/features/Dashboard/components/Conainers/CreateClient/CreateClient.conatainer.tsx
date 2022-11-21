import { FormikHelpers } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { createStructuredSelector } from "reselect";

import { Modal } from "@mui/material";
import FClient from "../../Forms/Client/Client.form";
import "./CreateClient.styles.scss";
import { store } from "@/store";
import { createClientAction } from "@/store/reducers/items/items.action";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { selectItemsClientsError } from "@/store/reducers/items/items.selector";
import { connect, ConnectedProps } from "react-redux";
import { TClient } from "@/types/client";

export type TClientValues = {
  type: "Entreprise" | "Personne";
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  tel: string;
};
const defaultValues: TClientValues = {
  type: "Personne",
  companyName: "",
  lastName: "",
  firstName: "",
  email: "",
  tel: "",
};

type CCreateClientProps = ConnectedProps<typeof connector> & {
  open: boolean;
  handleClose: () => void;
  handleNewClient: (value: TClient) => void;
};
const CCreateClient: FC<CCreateClientProps> = ({
  clientError,
  handleClose,
  handleNewClient,
  open,
}) => {
  const dispatch = store.dispatch;
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

  const handleSubmit = async (
    values: TClientValues,
    { resetForm, setSubmitting }: FormikHelpers<TClientValues>
  ) => {
    let nameToSend =
      values.type === "Entreprise"
        ? values.companyName
        : `${values.lastName} ${values.firstName}`;
    const res = await dispatch(
      createClientAction({
        completeName: nameToSend,
        email: values.email,
        number: values.tel,
      })
    );
    if (createClientAction.fulfilled.match(res)) {
      resetForm();
      handleNewClient(res.payload);
      ToastSuccess.fire({ text: "Le client a été créé avec succès" });
      handleClose();
    } else if (createClientAction.rejected.match(res)) {
      ToastError.fire({ text: clientError.message });
    }
    setSubmitting(false);
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") handleClose();
      }}
    >
      <div className="c-create-client">
        <h4 className="title">Création d'un client</h4>

        <div className="content">
          <FClient
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            initialValues={defaultValues}
            validationSchema={validationSchema}
          />
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  clientError: selectItemsClientsError,
});
const connector = connect(mapStateToProps);
export default connector(CCreateClient);
