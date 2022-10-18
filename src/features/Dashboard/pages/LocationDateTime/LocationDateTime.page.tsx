import { FC } from "react";
import { Formik, FormikHelpers, getIn } from "formik";
import * as Yup from "yup";

import { Icon } from "@iconify/react";

import TextField from "@mui/material/TextField";

import { DateRangePicker } from "rsuite";

import Button from "@/components/UICs/Button/Button.uic";

import "./LocationDateTime.styles.scss";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";
import { createStructuredSelector } from "reselect";
import { selectItemsEventDetails } from "@/store/reducers/items/items.selector";
import { connect, ConnectedProps } from "react-redux";
import { store } from "@/store";
import { setEventDetails } from "@/store/reducers/items/items.reducer";

const { beforeToday } = DateRangePicker;

export type TLocationDateTimeValues = {
  dateTime: {
    start: Date | null;
    end: Date | null;
  };
  eventName: string;
};

type PLocationDateTimeProps = ConnectedProps<typeof connector>;
const PLocationDateTime: FC<PLocationDateTimeProps> = ({ eventDetails }) => {
  const dispatch = store.dispatch;
  const navigate = useNavigate();
  const currentDate = new Date();

  const validationSchema: any = Yup.object({
    dateTime: Yup.object().shape({
      start: Yup.date(),
      end: Yup.date(),
    }),
    eventName: Yup.string().required(
      "Veuillez préciser le nom de l'évènement."
    ),
  });

  const handleSubmit = (
    values: TLocationDateTimeValues,
    { resetForm, setSubmitting }: FormikHelpers<TLocationDateTimeValues>
  ) => {
    console.log({ values });
    dispatch(setEventDetails(values));
    navigate(routePaths.locationList);
  };

  return (
    <div className="p-location-datetime">
      <span className="header-icon">
        <Icon icon="healthicons:stock-out" fontSize={100} />{" "}
      </span>
      <h3>
        Vous voulez louez du matériel pour votre évènement ? Réserver tout de
        suite en nous donnant la date et l'heure.{" "}
      </h3>

      <Formik
        initialValues={eventDetails}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {(formik) => {
          let eventName = {
            error: getIn(formik.errors, "eventName"),
            touched: getIn(formik.touched, "eventName"),
          };

          return (
            <form
              className="f-loction-date"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <div className="form-group">
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
              <div className="form-group">
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
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  eventDetails: selectItemsEventDetails,
});
const connector = connect(mapStateToProps);

export default connector(PLocationDateTime);
