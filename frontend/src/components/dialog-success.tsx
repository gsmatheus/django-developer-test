import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  open: boolean;
  onClose: () => void;

  title: string;
  description: string;
  buttonText: string;
  route: string;
}

export function DialogSuccess({
  open,
  onClose,
  title,
  description,
  buttonText,
  route,
}: DialogProps) {
  const navigation = useNavigate();

  function handleConfirm() {
    onClose();
    navigation(route);
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onClose={handleConfirm}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
