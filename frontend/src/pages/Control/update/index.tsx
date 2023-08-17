import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import moment from "moment";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Driver } from "@/@types/driver.type";
import { Vehicle } from "@/@types/vehicle.type";
import { api } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { DialogSuccess } from "@/components/dialog-success";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const controlFormSchema = z.object({
  driver_id: z
    .string()
    .nonempty("Por favor, selecione um motorista para o controle de viagem"),
  vehicle_id: z
    .string()
    .nonempty("Por favor, selecione um veículo para o controle de viagem"),
  departure_date: z.date(),
  departure_time: z
    .string()
    .nonempty("Por favor, informe a hora de saída do veículo"),
  return_date: z.date(),
  return_time: z
    .string()
    .nonempty("Por favor, informe a hora de retorno do veículo"),
  departure_km: z
    .string()
    .nonempty("Por favor, informe a quilometragem de saída do veículo"),
  return_km: z
    .string()
    .nonempty("Por favor, informe a quilometragem de retorno do veículo"),
  destination: z
    .string()
    .nonempty("Por favor, informe o destino da viagem do veículo"),
});

type ControlFormValues = z.infer<typeof controlFormSchema>;

type CheckKm = {
  km_left: number;
  total_km: number;
};

export function UpdateControlPage() {
  const { id } = useParams<{ id: string }>();

  const { toast } = useToast();
  const navigate = useNavigate();
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [oilChange, setOilChange] = useState(false);

  const form = useForm<ControlFormValues>({
    resolver: zodResolver(controlFormSchema),
    defaultValues: {
      driver_id: "",
      vehicle_id: "",
      departure_date: new Date(),
      departure_time: "",
      return_date: new Date(),
      return_time: "",
      departure_km: "",
      return_km: "",
      destination: "",
    },
  });

  async function onSubmit(data: ControlFormValues) {
    // Verifica se a km de retorno é menor que a de saída
    if (Number(data.return_km) < Number(data.departure_km)) {
      toast({
        title: "Erro",
        description:
          "A quilometragem de retorno não pode ser menor que a de saída",
        variant: "destructive",
      });
      return;
    }

    // Verifica se a data de retorno é menor que a de saída
    if (data.return_date < data.departure_date) {
      toast({
        title: "Erro",
        description: "A data de retorno não pode ser menor que a de saída",
        variant: "destructive",
      });
      return;
    }

    setSendingData(true);
    const response = await api.put(`/control/${id}/update`, {
      driver: data.driver_id,
      vehicle: data.vehicle_id,
      departure_date: moment(data.departure_date).format("YYYY-MM-DD"),
      departure_time: data.departure_time,
      return_date: moment(data.return_date).format("YYYY-MM-DD"),
      return_time: data.return_time,
      departure_km: data.departure_km,
      return_km: data.return_km,
      destination: data.destination,
    });

    if (response.status === 200) {
      setDialogSuccess(true);
    } else {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o controle de viagem",
        variant: "destructive",
      });
    }
    setSendingData(false);
  }

  async function fetchDriversAndVehicles() {
    setLoading(true);
    const response_driver = await api.get("/driver/all");
    const response_vehicle = await api.get("/vehicle/all");

    setDrivers(response_driver.data.results);
    setVehicles(response_vehicle.data.results);
    await findControl();
    setLoading(false);
  }

  async function findControl() {
    const response = await api.get(`/control/${id}`);
    const data = await response.data;

    form.setValue("driver_id", String(data.control.driver.id));
    form.setValue("vehicle_id", String(data.control.vehicle.id));
    form.setValue("departure_date", new Date(data.control.departure_date));
    form.setValue("departure_time", data.control.departure_time);
    form.setValue("return_date", new Date(data.control.return_date));
    form.setValue("return_time", data.control.return_time);
    form.setValue("departure_km", String(data.control.departure_km));
    form.setValue("return_km", String(data.control.return_km));
    form.setValue("destination", data.control.destination);
  }

  async function fetchCheckKm(vehicle_id: number) {
    const response = await api.get(`/control/${vehicle_id}/total_km`);
    const data: CheckKm = await response.data;

    if (data.km_left < 100) {
      setOilChange(true);
    } else {
      setOilChange(false);
    }
  }

  useEffect(() => {
    fetchDriversAndVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.watch("vehicle_id")) {
      fetchCheckKm(Number(form.watch("vehicle_id")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("vehicle_id")]);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DialogSuccess
        open={dialogSuccess}
        onClose={() => setDialogSuccess(false)}
        title="Controle de viagem registrado com sucesso!"
        description="O controle de viagem foi registrado com sucesso, você pode visualizá-lo na página de controles de viagem."
        buttonText="Visualizar controles de viagem"
        route="/"
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Atualizar controle de viagem{" "}
            <span className="text-gray-400 text-xs">#{id}</span>
          </CardTitle>
          <CardDescription>
            Atualize o controle de viagem com as informações abaixo
          </CardDescription>
        </CardHeader>
        {!loading && (
          <CardContent>
            {oilChange && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  O veículo selecionado está proximo de atingir a quilometragem
                  de troca de óleo, por favor, verifique a quilometragem de
                  saída e retorno.
                  <span className="text-red-500 cursor-pointer underline text-xs">
                    <br /> O veículo possui menos de 100km para atingir a
                    quilometragem.
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                className="h-full flex-col space-y-3 md:flex"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Driver and vehicle */}
                <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                  {/* Motorista */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="driver_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motorista</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {drivers.map((driver) => (
                                <SelectItem
                                  key={driver.id}
                                  value={driver.id.toString()}
                                >
                                  {driver.name} -{" "}
                                  <span className="text-gray-400 text-xs">
                                    {driver.license_number}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecione um motorista
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Veículo */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veículo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem
                                  key={vehicle.id}
                                  value={vehicle.id.toString()}
                                >
                                  {vehicle.model} -{" "}
                                  <span className="text-gray-400 text-xs">
                                    {vehicle.plate}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecione um veículo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Departure date and time */}
                <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                  {/* Data de saída */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="departure_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-[0.6rem]">
                          <FormLabel htmlFor={field.name}>
                            Data de saída
                          </FormLabel>

                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale: ptBR,
                                    })
                                  ) : (
                                    <span>Selecione uma data de saída</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={ptBR}
                                // disabled={(date) =>
                                //   date > new Date() ||
                                //   date < new Date("1900-01-01")
                                // }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormDescription>
                            Informe a data de saída
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Hora de saída */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="departure_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de saída</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="departure_time"
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Informe a hora de saída
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Return date and time */}
                <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                  {/* Data de retorno */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="return_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-[0.6rem]">
                          <FormLabel htmlFor={field.name}>
                            Data de retorno
                          </FormLabel>

                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale: ptBR,
                                    })
                                  ) : (
                                    <span>Selecione uma data de retorno</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={ptBR}
                                // disabled={(date) =>
                                //   date > new Date() ||
                                //   date < new Date("1900-01-01")
                                // }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormDescription>
                            Informe a data de retorno
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Hora de saída */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="return_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de retorno</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            Informe a hora de retorno
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Departure and return km and destination */}
                <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                  {/* Quilometragem de saída */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="departure_km"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quilometragem de saída</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Informe a quilometragem de saída
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quilometragem de retorno */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="return_km"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quilometragem de retorno</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Informe a quilometragem de retorno
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Destino */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destino</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Informe o destino da viagem
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    variant="ghost"
                    disabled={sendingData}
                    onClick={() => navigate("/")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={sendingData}>
                    {sendingData ? "Enviando..." : "Atualizar"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        )}

        {loading && (
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <span>Carregando...</span>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
