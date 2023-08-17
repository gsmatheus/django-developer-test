import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

import { Control } from "@/@types/control.type";
import { ActionsComponent } from "./actions-button";
import { Driver } from "@/@types/driver.type";
import { Vehicle } from "@/@types/vehicle.type";

moment.locale("pt-br");

interface ColumnsControlProps {
  fetchControls: (pageIndex: number, pageSize: number) => void;
}

export function columnsControl(
  props: ColumnsControlProps
): ColumnDef<Control>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id: number = row.getValue("id");

        return <span className="text-gray-500 text-center">#{id}</span>;
      },
    },
    {
      accessorKey: "driver",
      header: "Motorista",
      cell: ({ row }) => {
        const driver: Driver = row.getValue("driver");

        return (
          <>
            {driver.name}
            <span className="text-gray-500 text-xs font-normal ml-2">
              {driver.license_number}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "vehicle",
      header: "Veículo",
      cell: ({ row }) => {
        const vehicle: Vehicle = row.getValue("vehicle");

        return (
          <>
            {vehicle.plate}
            <span className="text-gray-500 text-xs font-normal ml-2">
              {vehicle.model}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "departure_date",
      header: "Data de saída",
      cell: ({ row }) => {
        const departure_date: string = row.getValue("departure_date");

        const formattedDate = moment(departure_date).format("DD/MM/YYYY");

        return formattedDate;
      },
    },
    {
      accessorKey: "departure_time",
      header: "Hora de saída",
    },
    {
      accessorKey: "destination",
      header: "Destino",
    },

    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <ActionsComponent row={row} fetchControls={props.fetchControls} />
      ),
    },
  ];
}
