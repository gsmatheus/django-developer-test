import { Row } from "@tanstack/react-table";

import { Vehicle } from "@/@types/vehicle.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ActionsComponent({ row }: { row: Row<Vehicle> }) {
  const vehicle: Vehicle = row.original;
  const { toast } = useToast();

  const handleCopyId = () => {
    navigator.clipboard.writeText(vehicle.id.toString());

    toast({
      title: "ID copiado",
      description: "O ID do veículo foi copiado para a área de transferência",
      variant: "success",
    });
  };

  function inProgress() {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade em desenvolvimento",
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onClick={handleCopyId}>
            Copiar ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={inProgress}>
            Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={inProgress}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={inProgress}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
