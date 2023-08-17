import { useEffect, useState } from "react";
import moment from "moment";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/axios";
import { classNames } from "@/lib/helpers";
import { Control } from "@/@types/control.type";
import { Vehicle, VehicleKeys } from "@/@types/vehicle.type";
import { Driver, DriverKeys } from "@/@types/driver.type";

// set pt-br locale
moment.locale("pt-br");

interface Props {
  open: boolean;
  onClose: () => void;

  control_id: number;
  title: string;
  description: string;
}

type CheckKm = {
  km_left: number;
  total_km: number;
};

function Separator({ title }: { title: string }) {
  return (
    <div className="w-full bg-slate-50 rounded-md shadow-sm">
      <h1 className="text-center text-sm font-semibold text-slate-700">
        {title}
      </h1>
    </div>
  );
}

export function ControlViewSheet({
  open,
  onClose,
  control_id,
  title,
  description,
}: Props) {
  const [control, setControl] = useState<Control | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [checkKm, setCheckKm] = useState<CheckKm | null>(null);
  const [fetching, setFetching] = useState(false);

  async function fetchControl() {
    setFetching(true);
    const response = await api.get(`/control/${control_id}`);
    const data = await response.data;

    setControl(data.control);
    setVehicle(data.control.vehicle);
    setDriver(data.control.driver);

    await fetchCheckKm(data.control.vehicle.id);

    setFetching(false);
  }

  async function fetchCheckKm(vehicle_id: number) {
    const response = await api.get(`/control/${vehicle_id}/total_km`);
    const data = await response.data;

    setCheckKm(data);
  }

  useEffect(() => {
    if (open) {
      fetchControl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Sheet open={open}>
      <SheetContent
        className={classNames(
          "w-[380px] sm:w-[550px]",
          !fetching ? "overflow-x-scroll" : ""
        )}
        onClose={onClose}
      >
        <SheetHeader>
          <SheetTitle>
            {title}
            <span className="ml-2 text-sm font-semibold text-gray-600">
              #{control_id}
            </span>
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {!fetching && (
          <div className="grid gap-4 py-4">
            <Separator title="Motorista" />

            {driver &&
              Object.keys(driver || {}).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-600">
                    {DriverKeys[key as keyof typeof DriverKeys]}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 text-right">
                    {driver[key as keyof Driver]}
                  </p>
                </div>
              ))}

            <Separator title="Veículo" />

            {vehicle &&
              Object.keys(vehicle || {}).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-600">
                    {VehicleKeys[key as keyof typeof VehicleKeys]}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 text-right">
                    {vehicle[key as keyof Vehicle]}
                  </p>
                </div>
              ))}

            <Separator title="Detalhes do Consumo" />

            <table className="w-full text-sm font-semibold text-gray-600">
              <thead>
                <tr>
                  <th className="text-left">Data de saída</th>
                  <th className="text-right">Data de retorno</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {moment(control?.departure_date).format("DD/MM/YYYY")} às{" "}
                    {control?.departure_time}
                  </td>
                  <td className="text-right">
                    {moment(control?.return_date).format("DD/MM/YYYY")} às{" "}
                    {control?.return_time}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full text-sm font-semibold text-gray-600">
              <thead>
                <tr>
                  <th className="text-left">KM de saída</th>
                  <th className="text-right">KM de retorno</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{control?.departure_km.toLocaleString("pt-br")} km</td>
                  <td className="text-right">
                    {control?.return_km.toLocaleString("pt-br")} km
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-600">Destino</p>
              <p className="text-sm font-semibold text-gray-600 text-right">
                {control?.destination}
              </p>
            </div>

            <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
              <p className="text-sm font-bold text-green-600">
                Distância percorrida nesta viagem
              </p>
              <p className="text-sm font-semibold text-green-600 text-right">
                {control?.distance_traveled.toLocaleString("pt-br")} km
              </p>
            </div>

            {/* Alert */}
            {checkKm && (
              <div className="flex items-center justify-between bg-red-50 p-2 rounded-md">
                {checkKm.km_left < 0 ? (
                  <p className="text-sm font-bold text-red-600">
                    Troca de óleo vencida
                  </p>
                ) : (
                  <p className="text-sm font-bold text-red-600">
                    Troca de óleo em {checkKm.km_left.toLocaleString("pt-br")}{" "}
                    km
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {fetching && (
          <div className="flex justify-center h-full">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-sm font-semibold text-teal-500 animate-pulse">
                Buscando dados...
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
