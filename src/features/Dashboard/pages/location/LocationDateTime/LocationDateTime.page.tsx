import "./LocationDateTime.styles.scss";

import { FC, useEffect, useState } from "react";
import { Formik, FormikHelpers, getIn } from "formik";
import * as Yup from "yup";
import { connect, ConnectedProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Autocomplete from "@mui/material//Autocomplete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Icon } from "@iconify/react";

import Button from "@/components/UICs/Button/Button.uic";
import CCreateClient from "@/features/Dashboard/components/Containers/CreateClient/CreateClient.conatainer";

import { store } from "@/store";
import { getClientsListAction } from "@/store/reducers/items/items.action";
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
    const selectedClient: TClient = clientList.find(
      (elt) => elt.id === values.client.id
    );
    dispatch(setEventDetails({ ...values, client: selectedClient }));
    navigate(routePaths.locationCategories);
  };

  return (
    <div className="page p-location-datetime">
      <IconButton
        aria-label="back-drop"
        color="primary"
        size="medium"
        onClick={() => navigate(routePaths.location)}
        sx={{ width: "fit-content" }}
      >
        <Icon icon="akar-icons:arrow-left" fontSize={20} />
      </IconButton>

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

          let dateStart = formik.values.dateTime.start
            ? dayjs(formik.values.dateTime.start)
            : null;
          let dateEnd = formik.values.dateTime.end
            ? dayjs(formik.values.dateTime.end)
            : null;

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
                <label className="label">Client</label>
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
                <label className="label">Dates et heures de location</label>
                <div className="date-group">
                  <div className="date-debut">
                    <label>Début</label>
                    <span className="date">
                      <DatePicker
                        label="Date"
                        value={dateStart}
                        onChange={(newValue) => {
                          if (newValue) {
                            if (!formik.values.dateTime.start) {
                              let toSet = new Date(newValue.valueOf());
                              formik.setFieldValue("dateTime.start", toSet);
                            } else {
                              let oldDate = formik.values.dateTime.start;
                              let toSet = newValue
                                .second(oldDate.getSeconds())
                                .minute(oldDate.getMinutes())
                                .hour(oldDate.getHours());
                              formik.setFieldValue(
                                "dateTime.start",
                                new Date(toSet.valueOf())
                              );
                            }
                          } else {
                            formik.setFieldValue("dateTime.start", null);
                          }
                        }}
                        minDate={dayjs()}
                        maxDate={
                          formik.values.dateTime.end
                            ? dayjs(formik.values.dateTime.end)
                            : null
                        }
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </span>
                    <span className="hour">
                      <TimePicker
                        value={dateStart}
                        label="Heure"
                        onChange={(newValue) => {
                          if (newValue.valueOf()) {
                            if (!formik.values.dateTime.start) {
                              let toSet = new Date(newValue.valueOf());
                              formik.setFieldValue("dateTime.start", toSet);
                            } else {
                              let oldDate = formik.values.dateTime.start;
                              let toSet = newValue
                                .date(oldDate.getDate())
                                .month(oldDate.getMonth())
                                .year(oldDate.getFullYear());
                              formik.setFieldValue(
                                "dateTime.start",
                                new Date(toSet.valueOf())
                              );
                            }
                          } else {
                            if (!formik.values.dateTime.start) {
                              formik.setFieldValue("dateTime.start", null);
                            } else {
                              let oldDate = dayjs(formik.values.dateTime.start);
                              let toSet = oldDate.hour(0).minute(0).second(0);
                              formik.setFieldValue(
                                "dateTime.start",
                                new Date(toSet.valueOf())
                              );
                            }
                          }
                        }}
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </span>
                  </div>
                  <div className="date-fin">
                    <label>Fin</label>
                    <span className="date">
                      <DatePicker
                        label="Date"
                        value={dateEnd}
                        onChange={(newValue) => {
                          if (newValue) {
                            if (!formik.values.dateTime.end) {
                              let toSet = new Date(newValue.valueOf());
                              formik.setFieldValue("dateTime.end", toSet);
                            } else {
                              let oldDate = formik.values.dateTime.end;
                              let toSet = newValue
                                .second(oldDate.getSeconds())
                                .minute(oldDate.getMinutes())
                                .hour(oldDate.getHours());
                              formik.setFieldValue(
                                "dateTime.end",
                                new Date(toSet.valueOf())
                              );
                            }
                          } else {
                            formik.setFieldValue("dateTime.end", null);
                          }
                        }}
                        minDate={
                          formik.values.dateTime.start
                            ? dayjs(formik.values.dateTime.start)
                            : dayjs()
                        }
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </span>
                    <span className="hour">
                      <TimePicker
                        value={dateEnd}
                        label="Heure"
                        onChange={(newValue) => {
                          if (newValue.valueOf()) {
                            if (!formik.values.dateTime.end) {
                              let toSet = new Date(newValue.valueOf());
                              formik.setFieldValue("dateTime.end", toSet);
                            } else {
                              let oldDate = formik.values.dateTime.end;
                              let toSet = newValue
                                .date(oldDate.getDate())
                                .month(oldDate.getMonth())
                                .year(oldDate.getFullYear());
                              formik.setFieldValue(
                                "dateTime.end",
                                new Date(toSet.valueOf())
                              );
                            }
                          } else {
                            if (!formik.values.dateTime.end) {
                              formik.setFieldValue("dateTime.end", null);
                            } else {
                              let oldDate = dayjs(formik.values.dateTime.end);
                              let toSet = oldDate.hour(0).minute(0).second(0);
                              formik.setFieldValue(
                                "dateTime.end",
                                new Date(toSet.valueOf())
                              );
                            }
                          }
                        }}
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </span>
                  </div>
                </div>
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
