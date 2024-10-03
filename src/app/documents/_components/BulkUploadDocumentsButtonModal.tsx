"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CompactPagination from "@/components/CompactPagination";
import { useState } from "react";

const BulkUploadDocumentsButtonModal = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [folder, setFolder] = useState("");

  const checkHandler = async () => {
    // send request to check the S3 bucket
    // if successful, set documents to the response
    // if failed, set error to true and set error message

    try {
      setLoading(true); // Set loading state to true

      const response = await fetch(
        `/api/v1/documents/bulk-upload/check?accessKey=${accessKey}&secretKey=${secretKey}&region=${region}&bucketName=${bucketName}&folder=${folder}`
      );
      const data = await response.json();
      // console.log(data);
      setDocuments(data.data);

      const pageCheck = parseInt(data.pagination.totalResultCount) / 40;
      if (pageCheck % 1 !== 0) {
        setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40 + 1);
      } else {
        setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40);
      }

      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading state to false in case of error
      setError(true);
      setErrorMessage((error as unknown as Error).message);
    }
  };

  const saveHandler = async () => {
    // save s3 details to database
    // create queue message to start bulk upload
    // if successful, show success message
    // if failed, set error to true and set error message
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Upload Documents</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Documents</DialogTitle>
        </DialogHeader>
        <div className="w-fit grid grid-cols-3 pt-4 gap-2">
          <div className="flex flex-col gap-y-2 col-span-3">
            <Label htmlFor="name" className="text-left">
              Document Group Name
            </Label>
            <Input
              id="name"
              value=""
              placeholder="Enter a Document Group Name for the uploaded Documents"
              className="max-w-96 w-96"
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
              className="max-w-96 w-96"
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
              className="max-w-96 w-96"
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
              className="max-w-96 w-96"
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
              className="max-w-96 w-96"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="name"
              className="text-left flex gap-x-1 items-center"
            >
              Folder <p className="text-xs text-slate-400">(optional)</p>
            </Label>
            <Input
              id="folder"
              value=""
              placeholder="Add the folder path in the S3 bucket"
              className="max-w-96 w-96"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-y-2 ">
          <button
            className="py-1 border border-black rounded hover:bg-black hover:text-white"
            onClick={checkHandler}
          >
            Check
          </button>
        </div>
        <div className="">
          {error && <div className="bg-red-300 p-2">{errorMessage}</div>}
          {documents.length > 0 ? (
            <div className="">Found {documents.length} number of documents</div>
          ) : (
            <div className="">No documents found</div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Number</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.number}>
                  <TableCell className="font-medium">
                    {document.number}
                  </TableCell>
                  <TableCell>{document.key}</TableCell>
                  <TableCell>{document.lastModified}</TableCell>
                  <TableCell className="text-right">{document.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="max-w-full">
            <CompactPagination
              numberOfPages={numberOfPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
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
