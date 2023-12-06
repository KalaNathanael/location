import "./CollectModal.container.styles.scss";

import { FC, useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import Swal from "sweetalert2";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import Button from "@/components/UICs/Button/Button.uic";

import FCollectArticle from "../../Forms/CollectArticle/CollectArticle.form";

import { APIcollectItems } from "@/features/Dashboard/api/command.api";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { TTypeArticle } from "@/types";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";

export type TCollectFormValues = Pick<
  TTypeArticle,
  "qte_retour" | "qte_damaged"
>;
interface CSetCollectProps {
  commandCode: string;
  devisDetails: TTypeArticle[];
}
const CSetCollect: FC<CSetCollectProps> = ({ devisDetails, commandCode }) => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const [failed, setFailed] = useState<{ [k: number]: boolean }>({});
  const [datasForm, setDatasForm] = useState([...devisDetails]);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enableSubmit) {
      let toSet = true;
      datasForm.forEach((data, idx) => {
        if (!completed[idx]) {
          toSet = false;
        }
      });
      setEnableSubmit(toSet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const totalSteps = () => {
    return datasForm.length;
  };
  const completedSteps = () => {
    return Object.keys(completed).length;
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const isLastIncompletedStep = () => {
    let toReturn = true;
    for (let i = activeStep + 1; i < datasForm.length; i++) {
      if (!completed[i]) {
        toReturn = false;
        break;
      }
    }
    return toReturn;
  };
  const nextUnCompletedStep = () => {
    let toReturn = 0;
    for (let i = activeStep + 1; i < datasForm.length; i++) {
      if (!completed[i]) {
        toReturn = i;
        break;
      }
    }
    return toReturn;
  };
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const toFirstIncompleted = () => {
    let toSet = 0;
    for (let i = 0; i < datasForm.length; i++) {
      if (!completed[i]) {
        toSet = i;
        break;
      }
    }
    setActiveStep(toSet);
  };

  const handleNext = () => {
    const newActiveStep =
      (isLastStep() || isLastIncompletedStep()) && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          datasForm.findIndex((step, i) => !(i in completed))
        : nextUnCompletedStep();
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkipTo = (index: number) => {
    setActiveStep(index);
  };

  const validateCollection = () => {
    let toReturn = true;

    let newFailed = failed;
    datasForm.forEach((elt, idx) => {
      if (!completed[idx]) {
        newFailed[idx] = true;
        if (toReturn) toReturn = false;
      }
    });
    setFailed(newFailed);

    let failedSteps = "";
    Object.keys(failed).forEach((ids, idx) => {
      if (failed[Number(ids)])
        failedSteps +=
          `${Number(ids) + 1}` +
          (idx !== Object.keys(failed).length - 1 ? "," : "") +
          " ";
    });

    if (!toReturn)
      Swal.fire({
        title: "Recensement incomplet",
        icon: "error",
        text: `Les étapes ${failedSteps} n'ont pas été complétées.`,
        confirmButtonColor: `var(--ui-primary)`,
        confirmButtonText: "Fermer",
      });

    toFirstIncompleted();
    setEnableSubmit(toReturn);

    return toReturn;
  };

  const onSubFormSubmit = (
    values: TCollectFormValues,
    { resetForm, setSubmitting }: FormikHelpers<TCollectFormValues>
  ) => {
    setSubmitting(true);
    setDatasForm((previousData) =>
      previousData.map((data, idx) => {
        if (idx === activeStep) {
          return {
            ...data,
            qte_damaged: values.qte_damaged,
            qte_retour: values.qte_retour,
          };
        } else {
          return data;
        }
      })
    );

    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    const newFailed = failed;
    newFailed[activeStep] = false;
    setFailed(newFailed);

    handleNext();
    setSubmitting(false);
  };

  const handleSubmit = () => {
    const isCollectionValid = validateCollection();
    if (isCollectionValid) {
      setLoading(true);
      APIcollectItems(commandCode, datasForm)
        .then((res) => {
          if (res.error) {
            ToastError.fire({ text: res.message });
          } else {
            ToastSuccess.fire({ text: "La commande est terminée. Veuillez consulter les stocks pour s'assurer de l'inventaire.", timer: 10000});
            navigate(routePaths.location);
          }
        })
        .catch((reason) => {
          if (reason.response.status === 400) {
            ToastError.fire({
              text: reason.response.data.message,
              timer: 6000,
            });
          } else {
            ToastError.fire();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="c-collect-modal">
      <h3>
        <em>Commande : </em>
        {commandCode}
      </h3>

      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {datasForm.map((data, index) => (
          <Step key={data.id} className="mui-step" completed={completed[index]}>
            <StepLabel
              className="cursor-pointer"
              error={failed[index]}
              optional={
                index === datasForm.length - 1 ? <em>Dernière étape</em> : null
              }
              onClick={() => {
                if (activeStep !== index) handleSkipTo(index);
              }}
            >
              {data.libelle}
            </StepLabel>
            <StepContent>
              {/* TODO: C'est ici qu'on attend le sous-formulaire */}
              <img
                className="article-img"
                src={data.img_path}
                alt={data.libelle}
              />

              <FCollectArticle
                deliveredArticles={datasForm[activeStep].qte_livree}
                handleBack={handleBack}
                handleSubmit={onSubFormSubmit}
                initialValues={{
                  qte_retour: datasForm[activeStep].qte_retour,
                  qte_damaged: datasForm[activeStep].qte_damaged,
                }}
                isLastStep={isLastStep}
              />
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <Button
        type="button"
        label="Enregistrer"
        onClick={handleSubmit}
        disabled={!enableSubmit}
        isLoading={loading}
      />
    </div>
  );
};

export default CSetCollect;
