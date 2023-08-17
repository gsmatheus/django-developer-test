import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Control } from "@/@types/control.type";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ControlViewSheet } from "@/components/sheets/control-view.sheet";
import { DeleteDialog } from "@/components/delete-dialog";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface ActionsComponentProps {
  row: Row<Control>;
  fetchControls: (pageIndex: number, pageSize: number) => void;
}

export function ActionsComponent({
  row,
  fetchControls,
}: ActionsComponentProps) {
  const control: Control = row.original;
  const [open, setOpen] = useState(false);
  const [openViewControlSheet, setOpenViewControlSheet] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleClose() {
    setOpen(false);
  }

  function handleCloseViewControlSheet() {
    setOpenViewControlSheet(false);
  }

  async function onDelete() {
    const response = await api.delete(`/control/${control.id}/delete`);

    if (response.status === 200) {
      setOpen(false);
      // Update table

      toast({
        title: "Controle excluído com sucesso",
        variant: "success",
      });

      fetchControls(1, 5);
    } else {
      setOpen(false);

      toast({
        title: "Erro ao excluir controle",
        description: response.data.error,
        variant: "destructive",
      });
    }
  }

  function handleCopyId() {
    navigator.clipboard.writeText(control.id.toString());

    toast({
      title: "ID copiado",
      variant: "success",
      description: "O ID do controle foi copiado para a área de transferência",
    });
  }

  return (
    <>
      <DeleteDialog
        open={open}
        onClose={handleClose}
        title="Excluir controle"
        description="Tem certeza que deseja excluir este controle?"
        onDelete={onDelete}
      />

      <ControlViewSheet
        open={openViewControlSheet}
        onClose={handleCloseViewControlSheet}
        control_id={control.id}
        title="Detalhes do controle"
        description="Confira os detalhes do controle selecionado:"
      />

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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenViewControlSheet(true)}
          >
            Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigate(`/control/${control.id}/edit`);
            }}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
