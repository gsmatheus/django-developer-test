import { InputType } from "@/@types/input.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { DriverForm } from "../components/driver-form";
import { DialogSuccess } from "@/components/dialog-success";

const inputs: InputType[] = [
  {
    label: "Nome",
    name: "name",
    placeholder: "Nome",
    description: "Digite o nome completo",
    messageError: "Campo obrigatório, digite o nome completo!",
    type: "text",
  },
  {
    label: "Telefone",
    name: "phone",
    placeholder: "Telefone",
    description: "Digite o telefone",
    messageError: "Campo obrigatório, digite o telefone!",
    type: "text",
  },
  {
    label: "CNH",
    name: "license_number",
    placeholder: "CNH",
    description: "Digite o número da CNH",
    messageError: "Campo obrigatório, digite o número da CNH!",
    type: "text",
  },
];

export function NewDriverPage() {
  const [dialogSuccess, setDialogSuccess] = useState(false);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DialogSuccess
        open={dialogSuccess}
        onClose={() => setDialogSuccess(false)}
        title="Motorista cadastrado com sucesso!"
        description="O motorista foi cadastrado com sucesso, volte para a lista de motoristas para visualizar o novo motorista cadastrado."
        buttonText="Voltar para a lista de motoristas"
        route="/drivers"
      />

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar novo motorista</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para cadastrar um novo motorista
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DriverForm
            inputs={inputs}
            openDialogSuccess={() => setDialogSuccess(true)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
