import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BulkUploadDocumentsButtonModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Upload Documents</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Documents</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Document Group Name
            </Label>
            <Input
              id="name"
              value=""
              placeholder="Add a Document Group Name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Start Bulk Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default BulkUploadDocumentsButtonModal;
