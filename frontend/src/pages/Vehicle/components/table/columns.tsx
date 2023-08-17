import { Vehicle } from "@/@types/vehicle.type";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsComponent } from "./actions-button";

export const columnsVehicle: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plate",
    header: "Placa",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "oil_change_km",
    header: "Km troca de óleo",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsComponent row={row} />,
  },
];
