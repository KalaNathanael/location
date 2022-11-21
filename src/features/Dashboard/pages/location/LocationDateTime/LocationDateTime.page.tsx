import { FC, useEffect, useState } from "react";
import { Formik, FormikHelpers, getIn } from "formik";
import * as Yup from "yup";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";

import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react";
import { DateRangePicker } from "rsuite";
import Button from "@/components/UICs/Button/Button.uic";

import { store } from "@/store";
import {
  clearBasket,
  clearEventDetails,
  setEventDetails,
} from "@/store/reducers/items/items.reducer";
import {
  selectItemsClientsDatas,
  selectItemsClientsLoading,
  selectItemsEventDetails,
} from "@/store/reducers/items/items.selector";

import { sortAutoCompleteList } from "@/utils";
import { routePaths } from "@/config";

import { TClient } from "@/types/client";
import { IAutoCompleteList } from "@/interfaces";

import "./LocationDateTime.styles.scss";
import { getClientsListAction } from "@/store/reducers/items/items.action";
import CCreateClient from "@/features/Dashboard/components/Conainers/CreateClient/CreateClient.conatainer";

const { beforeToday } = DateRangePicker;

export type TLocationDateTimeValues = {
  dateTime: {
    start: Date | null;
    end: Date | null;
  };
  client: IAutoCompleteList | null;
  // eventName: string;
};

type PLocationDateTimeProps = ConnectedProps<typeof connector>;
const PLocationDateTime: FC<PLocationDateTimeProps> = ({
  eventDetails,
  clientList,
  clientListLoading,
}) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const currentDate = new Date();

  const validationSchema: any = Yup.object({
    dateTime: Yup.object().shape({
      start: Yup.date(),
      end: Yup.date(),
    }),
    // eventName: Yup.string().required(
    //   "Veuillez préciser le nom de l'évènement."
    // ),
    client: Yup.object().shape({
      id: Yup.string().required("Le client est requis."),
    }),
  });
  const [clientInputValue, setClientInputValue] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [defaultClient, setDefaultClient] = useState<IAutoCompleteList | null>(
    null
  );

  useEffect(() => {
    dispatch(clearEventDetails());
    dispatch(clearBasket());
    dispatch(getClientsListAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertClientsToAutoCompleteList = (list: TClient[]) => {
    return clientList.map((client) => ({
      id: client.id,
      label: client.nom_prenom,
    }));
  };

  const handleNewClient = (newClient: TClient) => {
    let toSet: IAutoCompleteList = {
      id: newClient.id,
      label: newClient.nom_prenom,
    };
    setDefaultClient(toSet);
  };

  const handleSubmit = (
    values: TLocationDateTimeValues,
    { resetForm, setSubmitting }: FormikHelpers<TLocationDateTimeValues>
  ) => {
    console.log({ values });
    const selectedClient: TClient = clientList.find(
      (elt) => elt.id === values.client.id
    );
    dispatch(setEventDetails({ ...values, client: selectedClient }));
    navigate(routePaths.locationCategories);
  };

  return (
    <div className="p-location-datetime">
      <Button
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => {
          navigate(routePaths.location);
        }}
      />

      <span className="header-icon">
        <Icon icon="healthicons:stock-out" fontSize={100} />{" "}
      </span>
      <h3>
        Nouvel évènement pour une location ? Commençons par présiciser la date
        et l'heure.{" "}
      </h3>

      <Formik
        initialValues={{
          dateTime: {
            end:
              typeof eventDetails.dateTime.end === "string"
                ? new Date(eventDetails.dateTime.end)
                : eventDetails.dateTime.end,
            start:
              typeof eventDetails.dateTime.start === "string"
                ? new Date(eventDetails.dateTime.start)
                : eventDetails.dateTime.start,
          },
          // eventName: eventDetails.eventName,
          client: defaultClient,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {(formik) => {
          // let eventName = {
          //   error: getIn(formik.errors, "eventName"),
          //   touched: getIn(formik.touched, "eventName"),
          // };
          let client = {
            error: getIn(formik.errors, "client"),
            touched: getIn(formik.touched, "client"),
          };

          return (
            <form
              className="f-loction-date"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              {/* <div className="form-group">
                <TextField
                  id="event-name-id"
                  name="eventName"
                  label="Nom de l'évènement"
                  variant="outlined"
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.eventName}
                  error={!!eventName.error && !!eventName.touched}
                  helperText={!!eventName.touched ? eventName.error : ""}
                />
              </div> */}
              <div className="form-group">
                <label className="client-label">Client</label>
                <div className="no-client">
                  <span>Le client n'existe pas encore ?</span>{" "}
                  <em
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Créez le ici.
                  </em>
                </div>
                <Autocomplete
                  size="small"
                  value={formik.values.client}
                  id="client-auto-complete"
                  onChange={(
                    event: any,
                    newValue: IAutoCompleteList | null
                  ) => {
                    formik.setFieldValue("client", newValue);
                  }}
                  inputValue={clientInputValue}
                  onInputChange={(event, newInputValue) => {
                    setClientInputValue(newInputValue);
                  }}
                  options={sortAutoCompleteList(
                    convertClientsToAutoCompleteList(clientList)
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  loading={clientListLoading === "pending"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!client.error && client.touched}
                      label="Sélectionner le client"
                      helperText={client.touched ? client.error : ""}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label className="date-label">Date de location</label>
                <DateRangePicker
                  id="date-time-field"
                  name="dateTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  defaultCalendarValue={[
                    currentDate,
                    new Date(new Date().setMonth(currentDate.getMonth() + 1)),
                  ]}
                  disabledDate={beforeToday()}
                  value={[
                    formik.values.dateTime.start,
                    formik.values.dateTime.end,
                  ]}
                  onChange={(value, e) => {
                    formik.setFieldValue("dateTime.start", value?.[0]);
                    formik.setFieldValue("dateTime.end", value?.[1]);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="button-group">
                <div className="submit-button">
                  <Button
                    type="submit"
                    isLoading={false}
                    label="Valider"
                    disabled={!formik.isValid || false}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
      <CCreateClient
        handleClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
        handleNewClient={handleNewClient}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  eventDetails: selectItemsEventDetails,
  clientList: selectItemsClientsDatas,
  clientListLoading: selectItemsClientsLoading,
});
const connector = connect(mapStateToProps);

export default connector(PLocationDateTime);
