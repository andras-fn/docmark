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
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle>Bulk Upload Documents</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Document Group Name
            </Label>
            <Input
              id="name"
              value=""
              placeholder="Enter a Document Group Name for the uploaded Documents"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Access Key
            </Label>
            <Input
              id="access-key"
              value=""
              placeholder="Add an S3 Access Key"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Secret Key
            </Label>
            <Input
              id="secret-key"
              value=""
              placeholder="Add an S3 Secret Key"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Region
            </Label>
            <Input
              id="region"
              value=""
              placeholder="Add the region of the S3 bucket"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Bucket Name
            </Label>
            <Input
              id="bucket-name"
              value=""
              placeholder="Add the name of the S3 bucket"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Folder <p className="text-xs text-slate-300">(optional)</p>
            </Label>
            <Input
              id="folder"
              value=""
              placeholder="Add the folder path in the S3 bucket"
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
