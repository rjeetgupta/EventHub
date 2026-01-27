import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
  
  interface AssignAdminModalProps {
    open: boolean;
    onClose: () => void;
  }
  
  export default function AssignAdminModal({
    open,
    onClose,
  }: AssignAdminModalProps) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Admin</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            {/* Select User */}
            <div>
              <Label>User</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Select Role */}
            <div>
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEPARTMENT_ADMIN">
                    Department Admin
                  </SelectItem>
                  <SelectItem value="GROUP_ADMIN">
                    Group Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
  
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  