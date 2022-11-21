import { FC } from "react";
import Button from "@/components/UICs/Button/Button.uic";
import { Icon } from "@iconify/react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import { IconButton, Tooltip, Typography } from "@mui/material";

import PreviewIcon from "@mui/icons-material/Preview";
import CreateIcon from "@mui/icons-material/Create";
import CancelIcon from "@mui/icons-material/Cancel";

import { routePaths } from "@/config";
import { useNavigate } from "react-router-dom";

import "./Location.styles.scss";
import KPICardUIC from "../../components/elements/KPICard/KPICard.uic";

const PLocation: FC = () => {
  const navigate = useNavigate();
  const tableColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        let label = params.row.id;

        return (
          <Typography fontWeight="500" fontSize={12}>
            {label}
          </Typography>
        );
      },
    },
    {
      field: "eventName",
      headerName: "Évènement",
      minWidth: 150,
      disableColumnMenu: true,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 150,
      disableColumnMenu: true,
    },
    {
      field: "statut",
      headerName: "Statut",
      minWidth: 150,
      disableColumnMenu: true,
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className="actions">
            <Tooltip title="Voir le détail" placement="top">
              <IconButton
                aria-label="visualize"
                color="secondary"
                onClick={() => {
                  // visualizeSheet(url);
                }}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifier" placement="top">
              <IconButton
                aria-label="validate"
                color="success"
                onClick={() => {
                  // alertOnValidatingSheet(sheetId, connectedUser?.id!);
                }}
              >
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Annuler" placement="top">
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
          </div>
        );
      },
    },
  ];

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
          rows={[]}
          rowPerPage={10}
          loading={false}
        />
      </div>
    </div>
  );
};

export default PLocation;
