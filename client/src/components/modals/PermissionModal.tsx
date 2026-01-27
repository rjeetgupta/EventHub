import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Label } from "@/components/ui/label";
  
  interface PermissionModalProps {
    open: boolean;
    onClose: () => void;
  }
  
  const permissions = [
    "CREATE_EVENT",
    "UPDATE_EVENT",
    "PUBLISH_EVENT",
    "DECLARE_WINNERS",
  ];
  
  export default function PermissionModal({
    open,
    onClose,
  }: PermissionModalProps) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-3"
              >
                <Checkbox id={permission} />
                <Label htmlFor={permission}>
                  {permission.replace("_", " ")}
                </Label>
              </div>
            ))}
          </div>
  
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  