import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogSuccess } from "@/components/dialog-success";
import { useState } from "react";
import { VehicleForm } from "../components/vehicle-form";
import { InputType } from "@/@types/input.type";

const inputs: InputType[] = [
  {
    label: "Placa",
    name: "plate",
    placeholder: "ABC-1234",
    description: "Exemplo: ABC-1234",
    messageError: "Campo obrigatório, preencha com a placa do veículo!",
    type: "text",
  },
  {
    label: "Marca",
    name: "brand",
    placeholder: "Volkswagen",
    description: "Exemplo: Volkswagen",
    messageError: "Campo obrigatório, preencha com a marca do veículo!",
    type: "text",
  },
  {
    label: "Modelo",
    name: "model",
    placeholder: "Gol",
    description: "Exemplo: Gol",
    messageError: "Campo obrigatório, preencha com o modelo do veículo!",
    type: "text",
  },
  {
    label: "Troca de óleo (km)",
    name: "oil_change_km",
    placeholder: "100",
    description: "Preencha em km, exemplo: 100",
    messageError: "Campo obrigatório, preencha com a troca de óleo do veículo!",
    type: "number",
  },
];

export function NewVehiclePage() {
  const [dialogSuccess, setDialogSuccess] = useState(false);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DialogSuccess
        open={dialogSuccess}
        onClose={() => setDialogSuccess(false)}
        title="Veículo cadastrado com sucesso!"
        description="O veículo foi cadastrado com sucesso, você pode cadastrar outro veículo ou voltar para a lista de veículos."
        buttonText="Voltar para a lista de veículos"
        route="/vehicles"
      />
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Veículo</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para cadastrar um novo veículo!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleForm
            inputs={inputs}
            openDialogSuccess={() => setDialogSuccess(true)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
