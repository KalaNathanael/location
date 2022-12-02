import { FC, useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { Icon } from "@iconify/react";

import { Button as MuiButton, Typography } from "@mui/material";

import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import { ToastError } from "@/utils/toast";

import "./AdminUsers.styles.scss";
import Button from "@/components/UICs/Button/Button.uic";
import CCreateUser from "@/features/Dashboard/components/Containers/CreateUser/CreateUser.container";
import {
  selectAdminUsers,
  selectAdminUsersError,
  selectAdminUsersLoading,
} from "@/store/reducers/admin/admin.selector";
import { connect, ConnectedProps } from "react-redux";
import { store } from "@/store";
import { fetchUsersAction } from "@/store/reducers/admin/admin.action";
import { TUser } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/config";

type PAdminUsersProps = ConnectedProps<typeof connector>;
const PAdminUsers: FC<PAdminUsersProps> = ({
  users,
  usersError,
  usersLoading,
}) => {
  const tableColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      disableColumnMenu: true,
    },
    {
      field: "noms",
      headerName: "Noms & Prénoms",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const firstName = params.row.prenoms;
        const lastName = params.row.noms;
        return (
          <Typography fontWeight="500" fontSize={12}>
            {lastName} {firstName}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
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
      field: "profil",
      headerName: "Profil",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value.libelle}
          </Typography>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Date de création",
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography fontWeight="500" fontSize={12}>
            {params.value.toLocaleDateString()}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 220,
      align: "center",
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className="actions">
            <MuiButton
              aria-label="modify"
              color="primary"
              onClick={() => {
                let find = users.find((elt) => elt.id === params.row.id);
                setSelectedUser(find);
                setOpenModal(true);
              }}
              variant="contained"
              sx={{ color: "white" }}
            >
              Modifier
            </MuiButton>
            <MuiButton
              aria-label="suppress"
              color="error"
              onClick={() => {
                // visualizeSheet(url);
              }}
              variant="contained"
              sx={{ color: "white" }}
              disabled={true}
            >
              Supprimer
            </MuiButton>
          </div>
        );
      },
    },
  ];
  const dispatch = store.dispatch;
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  useEffect(() => {
    dispatch(fetchUsersAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (usersLoading === "failed") {
      ToastError.fire({ text: usersError.message, timer: 8000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersError]);

  return (
    <div className="p-admin-users">
      <Button
        label="Retour"
        inverted={true}
        color="var(--ui-primary)"
        Icon={<Icon icon="akar-icons:arrow-left" fontSize={18} />}
        onClick={() => navigate(routePaths.admin)}
      />
      <h2>
        <span>
          <Icon icon="clarity:administrator-line" fontSize={30} />
        </span>{" "}
        Gestion des utilisateurs
      </h2>

      <div className="new-user">
        <Button
          type="button"
          label="Créer un Utilisateur"
          Icon={<Icon icon="mdi:user-add-outline" fontSize={20} />}
          onClick={() => {
            setOpenModal(true);
            setSelectedUser(null);
          }}
        />
      </div>

      <TableViewer
        rows={users}
        columns={tableColumns}
        loading={usersLoading === "pending"}
        rowPerPage={[5, 10]}
      />
      <CCreateUser
        handleClose={() => {
          setOpenModal(false);
        }}
        selectedUser={selectedUser}
        open={openModal}
      />
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  users: selectAdminUsers,
  usersLoading: selectAdminUsersLoading,
  usersError: selectAdminUsersError,
});
const connector = connect(mapStateToProps);
export default connector(PAdminUsers);
