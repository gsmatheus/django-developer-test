import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { InputType } from "@/@types/input.type";
import { GenerateFormFields } from "@/components/generate-form-fields";

interface DriverFormProps {
  inputs: InputType[];
  openDialogSuccess: () => void;
}

export function DriverForm({ inputs, openDialogSuccess }: DriverFormProps) {
  const { toast } = useToast();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object(
    inputs.reduce((acc, input) => {
      return {
        ...acc,
        [input.name]:
          input.type === "number"
            ? z.coerce
                .number()
                .min(
                  1,
                  input.messageError ||
                    "Campo obrigatório, preencha com um número!"
                )
                .positive(
                  input.messageError ||
                    "Campo obrigatório, preencha com um número!"
                )
            : z
                .string()
                .nonempty(
                  input.messageError ||
                    "Campo obrigatório, preencha com um texto!"
                ),
      };
    }, {})
  );

  type FormSchemaDto = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaDto>({
    resolver: zodResolver(formSchema),
    defaultValues: inputs.reduce((acc, input) => {
      return {
        ...acc,
        [input.name]: "",
      };
    }, {}),
  });
  async function onSubmit(data: FormSchemaDto) {
    setLoading(true);
    const response = await api.post("/driver/create", data);

    if (response.status === 201) {
      form.reset();
      openDialogSuccess();
    } else {
      toast({
        title: "Erro ao criar motorista!",
        description: response.data.error,
        variant: "destructive",
      });
    }

    setLoading(false);
  }

  function onCancel() {
    form.reset();
    navigation("/drivers");
  }

  return (
    <Form {...form}>
      <form
        className="h-full flex-col space-y-1 md:flex"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <GenerateFormFields inputs={inputs} form={form} />

        <div className="flex justify-between space-x-2 pt-4">
          <Button variant="ghost" disabled={loading} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
