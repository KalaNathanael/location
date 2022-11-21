import { FC, useState, useEffect } from "react";
import Button from "@/components/UICs/Button/Button.uic";
import { Icon } from "@iconify/react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";

import PreviewIcon from "@mui/icons-material/Preview";
import CancelIcon from "@mui/icons-material/Cancel";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { commandStatus, devisStatus, routePaths } from "@/config";
import { useNavigate } from "react-router-dom";

import "./Location.styles.scss";
import KPICardUIC from "../../components/elements/KPICard/KPICard.uic";
import { TCommand } from "@/types/command";
import { APIfetchCommands } from "../../api/command.api";
import { ToastError } from "@/utils/toast";

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
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        let status_devis = params.row.statusDevis;
        let statusCommande = params.row.statusCommande;

        return (
          <div className="actions">
            <Tooltip title="Consulter le devis" placement="top">
              <IconButton
                aria-label="visualize"
                color="primary"
                onClick={() => {
                  // visualizeSheet(url);
                }}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            {status_devis.label === "À régler" && (
              <>
                <Tooltip title="Valider le devis" placement="top">
                  <IconButton
                    aria-label="visualize"
                    color="success"
                    onClick={() => {
                      // visualizeSheet(url);
                    }}
                  >
                    <PriceCheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Annuler la commande" placement="top">
                  <IconButton
                    aria-label="reject"
                    color="error"
                    onClick={() => {
                      // alertOnRejectingSheet(sheetId, connectedUser?.id!);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {statusCommande.label === "À livrer" && (
              <>
                <Tooltip title="Confirmer la livraison" placement="top">
                  <IconButton
                    aria-label="visualize"
                    color="success"
                    onClick={() => {
                      // visualizeSheet(url);
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {statusCommande.label === "À récupérer" && (
              <>
                <Tooltip title="Confirmer la récupération" placement="top">
                  <IconButton
                    aria-label="visualize"
                    color="success"
                    onClick={() => {
                      // visualizeSheet(url);
                    }}
                  >
                    <DoneAllIcon />
                  </IconButton>
                </Tooltip>
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

  return (
    <div className="p-location">
      <div className="location-kpi">
        <KPICardUIC
          color="red"
          icon="mdi:auto-pay"
          title="En attente de paiement"
          value={0}
        />
        <KPICardUIC
          color="yellow"
          icon="carbon:delivery"
          title="À livrer"
          value={0}
        />
        <KPICardUIC
          color="yellow"
          icon="mdi:timer-sand"
          title="À récupérer"
          value={0}
        />
        <KPICardUIC
          color="green"
          icon="ep:finished"
          title="Terminé"
          value={0}
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
          rowPerPage={10}
          loading={loadingDatas}
        />
      </div>
    </div>
  );
};

export default PLocation;
