import { Driver } from "@/@types/driver.type";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsComponent } from "./actions-button";

export const columnsDriver: ColumnDef<Driver>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "license_number",
    header: "CNH",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsComponent row={row} />,
  },
];
