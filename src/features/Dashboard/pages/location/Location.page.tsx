import { FC, useState, useEffect } from "react";
import Button from "@/components/UICs/Button/Button.uic";
import { Icon } from "@iconify/react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { Button as MuiButton } from "@mui/material";

import { commandStatus, devisStatus, routePaths } from "@/config";
import { useNavigate } from "react-router-dom";

import "./Location.styles.scss";
import KPICardUIC from "../../components/elements/KPICard/KPICard.uic";
import { TCommand } from "@/types/command";
import {
  APIcancelDevis,
  APIfetchCommands,
  APIfetchDevis,
  APIvalidateDevis,
} from "../../api/command.api";
import { ToastError, ToastSuccess } from "@/utils/toast";

const PLocation: FC = () => {
  const navigate = useNavigate();
  const tableColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      disableColumnMenu: true,
    },
    {
      field: "codeCommande",
      headerName: "Code",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "client",
      headerName: "Évènement",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value.nom_prenom}
          </Typography>
        );
      },
    },
    {
      field: "dateDebut,dateFin",
      headerName: "Date évènement",
      minWidth: 280,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        let dateDebut = params.row.dateDebut as Date;
        let dateFin = params.row.dateFin as Date;

        return (
          <Typography fontWeight="500" fontSize={12}>
            {dateDebut.toLocaleString()} - {dateFin.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Date d'enregistrement",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        let date = params.value as Date;

        return (
          <Typography fontWeight="500" fontSize={12}>
            {date.toLocaleDateString()}
          </Typography>
        );
      },
    },
    {
      field: "statusDevis",
      headerName: "Statut du Devis",
      minWidth: 150,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        let value = params.value;

        return (
          <Chip
            label={value.label}
            sx={{ backgroundColor: value.color, color: "white" }}
          />
        );
      },
    },
    {
      field: "statusCommande",
      headerName: "Statut de la Commande",
      minWidth: 150,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        let value = params.value;

        return (
          <Chip
            label={value.label}
            sx={{ backgroundColor: value.color, color: "white" }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 402,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        let code = params.row.codeCommande;
        let status_devis = params.row.statusDevis;
        let statusCommande = params.row.statusCommande;

        return (
          <div className="actions">
            <MuiButton
              aria-label="visualize"
              color="primary"
              onClick={() => {
                getDevis(code);
              }}
              variant="outlined"
            >
              Voir Devis
            </MuiButton>
            {status_devis.label === "À régler" && (
              <>
                <MuiButton
                  aria-label="visualize"
                  color="success"
                  onClick={() => {
                    validateDevis(code);
                  }}
                  variant="outlined"
                >
                  Valider devis
                </MuiButton>
                <MuiButton
                  aria-label="reject"
                  color="error"
                  onClick={() => {
                    cancelDevis(code);
                  }}
                  variant="outlined"
                >
                  Annuler commande
                </MuiButton>
              </>
            )}
            {statusCommande.label === "À livrer" && (
              <>
                <MuiButton
                  aria-label="visualize"
                  color="success"
                  onClick={() => {
                    // visualizeSheet(url);
                  }}
                  variant="outlined"
                  disabled={true}
                >
                  Confirmer livraison
                </MuiButton>
              </>
            )}
            {statusCommande.label === "À récupérer" && (
              <>
                <MuiButton
                  aria-label="visualize"
                  color="success"
                  onClick={() => {
                    // visualizeSheet(url);
                  }}
                  disabled={true}
                >
                  Terminer commande
                </MuiButton>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const [loadingDatas, setLoadingDatas] = useState<boolean>(false);
  const [datas, setDatas] = useState<TCommand[]>([]);

  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = async () => {
    setLoadingDatas(true);
    try {
      const response = await APIfetchCommands();
      if (response.error) {
        ToastError.fire({ text: response.message, timer: 10000 });
      } else {
        const data: any[] = response.data;
        let toSend: TCommand[] = data.map((command) => {
          return {
            id: command.commande_id,
            codeCommande: command.code_commande,
            client: command.client,
            created_at: new Date(command.created_at),
            dateDebut: new Date(command.date_debut),
            dateFin: new Date(command.date_fin),
            montantDevis: command.montant_devis,
            statusCommande: commandStatus[command.status_commande]
              ? commandStatus[command.status_commande]
              : commandStatus["En attente"],
            statusDevis: devisStatus[command.status_devis]
              ? devisStatus[command.status_devis]
              : devisStatus["A régler"],
          };
        });

        console.log({ toSend });
        setDatas(toSend);
      }
    } catch (e: any) {
      ToastError.fire({ timer: 10000 });
    }
    setLoadingDatas(false);
  };

  async function getDevis(code: string) {
    setLoadingDatas(true);
    await APIfetchDevis(code)
      .then((res) => {
        if (res.error) {
          ToastError.fire();
        } else {
          const href = URL.createObjectURL(res);
          const link = document.createElement("a");

          console.log("Humu humu humu");
          link.href = href;
          link.setAttribute("download", `devis_${code}.pdf`);
          link.click();
          URL.revokeObjectURL(href);
        }
      })
      .catch((reason) => {
        ToastError.fire();
      })
      .finally(() => {
        setLoadingDatas(false);
      });
  }

  async function validateDevis(code: string) {
    setLoadingDatas(true);
    await APIvalidateDevis(code)
      .then((res) => {
        if (res.error) {
          ToastError.fire({ text: res.message });
        } else {
          let data = res.data;
          let updatedList: TCommand[] = datas.map((elt) => {
            if (elt.id === data.commande_id) {
              return {
                id: data.commande_id,
                codeCommande: data.code_commande,
                client: data.client,
                created_at: new Date(data.created_at),
                dateDebut: new Date(data.date_debut),
                dateFin: new Date(data.date_fin),
                montantDevis: data.montant_devis,
                statusCommande: commandStatus[data.status_commande]
                  ? commandStatus[data.status_commande]
                  : commandStatus["En attente"],
                statusDevis: devisStatus[data.status_devis]
                  ? devisStatus[data.status_devis]
                  : devisStatus["A régler"],
              };
            } else {
              return elt;
            }
          });
          setDatas(updatedList);
          ToastSuccess.fire();
        }
      })
      .catch((reason) => {
        if (reason.response.status === 400) {
          ToastError.fire({ text: reason.response.data.message, timer: 6000 });
        } else {
          ToastError.fire();
        }
      })
      .finally(() => {
        setLoadingDatas(false);
      });
  }

  async function cancelDevis(code: string) {
    setLoadingDatas(true);
    await APIcancelDevis(code)
      .then((res) => {
        if (res.error) {
          ToastError.fire({ text: res.message });
        } else {
          let filteredDatas = datas.filter(
            (data) => data.codeCommande !== code
          );
          setDatas(filteredDatas);
          ToastSuccess.fire();
        }
      })
      .catch((reason) => {
        if (reason.response.status === 400) {
          ToastError.fire({ text: reason.response.data.message, timer: 6000 });
        } else {
          ToastError.fire();
        }
      })
      .finally(() => {
        setLoadingDatas(false);
      });
  }

  return (
    <div className="p-location">
      <div className="location-kpi">
        <KPICardUIC
          color="red"
          icon="mdi:auto-pay"
          title="En attente de paiement"
          value={
            datas.filter((elt) => elt.statusCommande.label === "En attente")
              .length
          }
        />
        <KPICardUIC
          color="orange"
          icon="carbon:delivery"
          title="À livrer"
          value={
            datas.filter((elt) => elt.statusCommande.label === "À livrer")
              .length
          }
        />
        <KPICardUIC
          color="yellow"
          icon="mdi:timer-sand"
          title="À récupérer"
          value={
            datas.filter((elt) => elt.statusCommande.label === "À récupérer")
              .length
          }
        />
        <KPICardUIC
          color="green"
          icon="ep:finished"
          title="Terminé"
          value={
            datas.filter((elt) => elt.statusCommande.label === "Terminé").length
          }
        />
      </div>
      <div className="new-location">
        <Button
          type="button"
          label="Nouvelle location"
          Icon={<Icon icon="healthicons:stock-out" fontSize={20} />}
          onClick={() => {
            navigate(routePaths.locationDate);
          }}
        />
      </div>
      <div className="location-list">
        <TableViewer
          columns={tableColumns}
          rows={datas}
          rowPerPage={[10, 20, 50]}
          loading={loadingDatas}
        />
      </div>
    </div>
  );
};

export default PLocation;
