import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Driver } from "@/@types/driver.type";

export function ActionsComponent({ row }: { row: Row<Driver> }) {
  const driver: Driver = row.original;
  const { toast } = useToast();

  const handleCopyId = () => {
    navigator.clipboard.writeText(driver.id.toString());

    toast({
      title: "ID copiado",
      description: "O ID do motorista foi copiado para a área de transferência",  
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
