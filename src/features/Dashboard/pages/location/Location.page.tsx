import "./Location.styles.scss";

import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MuiButton from "@mui/material/Button";

import Button from "@/components/UICs/Button/Button.uic";
import { TableViewer } from "@/components/UICs/Tables/table-viewer/TableViewer";
import KPICardUIC from "../../components/elements/KPICard/KPICard.uic";

import {
  APIcancelDevis,
  APIdeliverDevis,
  APIfetchCommands,
  APIfetchDevis,
  APIvalidateDevis,
} from "../../api/command.api";

import { TCommand } from "@/types/command";
import { commandStatus, devisStatus, routePaths } from "@/config";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { useAppDispatch } from "@/store";
import { setSelectedCommand } from "@/store/reducers/items/items.reducer";

const PLocation: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
                  color="info"
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
            {statusCommande.label === "À livrer" &&
              status_devis.label !== "À récupérer" && (
                <>
                  <MuiButton
                    aria-label="visualize"
                    color="warning"
                    onClick={() => {
                      deliverDevis(code);
                    }}
                    variant="outlined"
                  >
                    Confirmer livraison
                  </MuiButton>
                </>
              )}
            {status_devis.label === "À récupérer" && (
              <>
                <MuiButton
                  aria-label="visualize"
                  color="success"
                  onClick={() => {
                    let currentCommand = datas.find(
                      (elt) => elt.codeCommande === code
                    );
                    dispatch(setSelectedCommand(currentCommand));
                    navigate(routePaths.locationCollect);
                  }}
                  // disabled={true}
                  variant="outlined"
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
            id: command.id,
            client: command.clients,
            codeCommande: command.code_commande,
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
            //TODO: Demander au père Alexis de me retourner les fichiers sous le bon format
            commandArticles: [
              {
                id: 53,
                img_path:
                  "http://164.132.51.93:7200/static/files/sous_categories/20230203/test_09143289519903022023.jpeg",
                libelle: "BURNA",
                price: 5000,
                qte_livree: 10,
                qte_damaged: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
                qte_retour: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
              },
              {
                id: 3,
                img_path:
                  "http://164.132.51.93:7200/static/files/sous_categories/20221109/assiètte_-_service_européen_11473325817409112022.jpeg",
                libelle: "SET 3 PIECES RONDE A FLEURS",
                price: 100,
                qte_livree: 9,
                qte_damaged: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
                qte_retour: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
              },
              {
                id: 6,
                img_path:
                  "http://164.132.51.93:7200/static/files/sous_categories/20221109/assiètte_-_service_européen_11473325817409112022.jpeg",
                libelle: "SET 3 PIECES CARRE BORD DORE",
                price: 100,
                qte_livree: 9,
                qte_damaged: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
                qte_retour: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
              },
              {
                id: 45,
                img_path:
                  "http://164.132.51.93:7200/static/files/sous_categories/20221109/serviette_de_table_11500724453509112022.jpeg",
                libelle: "VERT D'EAU",
                price: 100,
                qte_livree: 3,
                qte_damaged: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
                qte_retour: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
              },
              {
                id: 43,
                img_path:
                  "http://164.132.51.93:7200/static/files/sous_categories/20221109/serviette_de_table_11500724453509112022.jpeg",
                libelle: "SAUMON",
                price: 100,
                qte_livree: 5,
                qte_damaged: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
                qte_retour: 0, //TODO: Quand les vraies données seront envoyées, initialiser à zéro si le paramètre n'est pas retourné
              },
            ],
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
                //TODO: voir ce qu'il y a à faire de "commandArticles"
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
          ToastError.fire({ title: res.message });
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
          ToastError.fire({ title: reason.response.data.message, timer: 6000 });
        } else {
          ToastError.fire();
        }
      })
      .finally(() => {
        setLoadingDatas(false);
      });
  }

  async function deliverDevis(code: string) {
    Swal.fire({
      title: "Confirmer la livraison",
      text: `Voulez vous confirmer la livraison ${code} ?`,
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Confirmer",
      confirmButtonColor: "var(--ui-primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoadingDatas(true);
        APIdeliverDevis(code)
          .then((res) => {
            if (res.error) {
              ToastError.fire({ title: res.message });
            } else {
              getDatas();
              ToastSuccess.fire({ title: "La livraison a été enregistrée." });
            }
          })
          .catch((reason) => {
            if (reason.response.status === 400) {
              ToastError.fire({
                title: reason.response.data.message,
                timer: 6000,
              });
            } else {
              ToastError.fire();
            }
          })
          .finally(() => {
            setLoadingDatas(false);
          });
      }
    });
  }

  return (
    <div className="page p-location">
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
            datas.filter((elt) => elt.statusDevis.label === "À récupérer")
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
