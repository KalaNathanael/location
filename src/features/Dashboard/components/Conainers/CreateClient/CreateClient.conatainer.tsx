import { FormikHelpers } from "formik";
import { FC } from "react";
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
