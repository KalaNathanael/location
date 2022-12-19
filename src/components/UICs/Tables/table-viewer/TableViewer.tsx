import React from "react";
import "./TableViewer.styles.scss";
import LinearProgress from "@mui/material/LinearProgress";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

const CustomToolbar: React.FC<{
  setFilterButtonEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  setColumnButtonEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  setExportButtonEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
}> = ({ setFilterButtonEl, setColumnButtonEl, setExportButtonEl }) => (
  <GridToolbarContainer className="table-toolbar-container">
    <GridToolbarFilterButton
      className="toolbar-filter"
      ref={setFilterButtonEl}
    />
    <GridToolbarColumnsButton
      className="toolbar-column"
      ref={setColumnButtonEl}
    />
    <GridToolbarExport className="toolbar-export" ref={setExportButtonEl} />
  </GridToolbarContainer>
);

type TableViewerProps = {
  columns: GridColDef[] | [];
  rows: any[];
  rowPerPage?: number[];
  loading?: boolean;
  checkboxSelection?: boolean;
  rowHeight?: number;
};
export const TableViewer: React.FC<TableViewerProps> = ({
  columns,
  rows,
  rowPerPage = [7],
  loading = false,
  checkboxSelection = false,
  rowHeight = 50,
}) => {
  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [columnButtonEl, setColumnButtonEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [exportButtonEl, setExportButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  const [pageSize, setPageSize] = React.useState<number>(rowPerPage[0]);

  return (
    <div className="table-viewer-layout">
      <DataGrid
        columns={columns}
        initialState={{ columns: { columnVisibilityModel: { id: false } } }}
        rows={rows}
        rowHeight={rowHeight}
        rowsPerPageOptions={rowPerPage}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection={checkboxSelection}
        autoHeight={true}
        loading={loading}
        localeText={{
          noRowsLabel: "Aucun élément",
          toolbarFilters: "Filtre",
          toolbarFiltersLabel: "Filtre",
          toolbarColumns: "Colonnes",
          toolbarColumnsLabel: "Colonnes",
          toolbarExportCSV: "Exporter en CSV",
          toolbarExportPrint: "Imprimer",
          filterOperatorContains: "contient",
          filterOperatorEquals: "égale à",
          filterOperatorStartsWith: "commence par",
          filterOperatorEndsWith: "fini par",
          filterOperatorIsEmpty: "est vide",
          filterOperatorIsNotEmpty: "n'est pas vide",
          filterOperatorIsAnyOf: "appartient à",
          filterPanelColumns: "Colonne",
          filterPanelOperators: "Opération",
          filterPanelInputLabel: "Valeur",
          filterPanelInputPlaceholder: "valeur filtrée",
          columnsPanelHideAllButton: "Cacher tout",
          columnsPanelShowAllButton: "Afficher tout",
          columnsPanelTextFieldPlaceholder: "colonne ...",
          columnsPanelTextFieldLabel: "Recherche colonne",
          checkboxSelectionHeaderName: "Case(s) à cocher",
          noResultsOverlayLabel: "Aucun résultat.",
          footerRowSelected: (count: number) => `${count} lignes sélectionnées`,
          MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }) =>
              `${from} - ${to} sur ${count}`,
          },
        }}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LinearProgress,
        }}
        componentsProps={{
          panel: {
            anchorEl: filterButtonEl,
            columnButtonEl: columnButtonEl,
            exportButtonEl: exportButtonEl,
          },
          toolbar: {
            setFilterButtonEl,
            setColumnButtonEl,
            setExportButtonEl,
          },
        }}
      />
    </div>
  );
};
