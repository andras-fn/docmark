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
  interface Document {
    Key: string;
    LastModified: string;
    ETag: string;
    Size: number;
    StorageClass: string;
  }

  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [name, setName] = useState("");

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

      console.log(
        `/api/v1/documents/bulk-upload/check?accessKey=${accessKey}&secretKey=${secretKey}&region=${region}&bucketName=${bucketName}&folder=${folder}`
      );

      const response = await fetch(
        `/api/v1/documents/bulk-upload/check?accessKey=${accessKey}&secretKey=${secretKey}&region=${region}&bucketName=${bucketName}&folder=${folder}`
      );
      const data = await response.json();

      // check for errors
      if (response.status !== 200) {
        throw new Error(JSON.stringify(data.issues));
      }
      setDocuments(data.data);
      setError(false);
      setErrorMessage("");

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

    try {
      setSaveLoading(true); // Set loading state to true

      const response = await fetch("/api/v1/documents/bulk-upload/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          accessKey,
          secretKey,
          region,
          bucketName,
          folder,
          numberOfFiles: documents.length,
        }),
      });

      const data = await response.json();

      // check for errors
      if (response.status !== 201) {
        throw new Error(JSON.stringify(data.issues));
      }

      // show success message
      console.log("Bulk upload started", data);
      setSaveLoading(false); // Set loading state to false after data is fetched
      setError(false);
      setErrorMessage("");
      setSuccess(true);
      setSuccessMessage("Bulk upload created successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      setSaveLoading(false); // Set loading state to false in case of error
      setError(true);
      setErrorMessage((error as unknown as Error).message);
    }
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
        {success && (
          <div className="min-w-full w-fit bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded ">
            {successMessage}
          </div>
        )}
        <div className="w-fit grid grid-cols-3 pt-4 gap-2">
          <div className="flex flex-col gap-y-2 col-span-3">
            <Label htmlFor="name" className="text-left">
              Document Group Name
            </Label>
            <Input
              id="name"
              value={name}
              placeholder="Enter a Document Group Name for the uploaded Documents"
              className="max-w-96 w-96"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Access Key
            </Label>
            <Input
              id="access-key"
              value={accessKey}
              placeholder="Add an S3 Access Key"
              className="max-w-96 w-96"
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Secret Key
            </Label>
            <Input
              id="secret-key"
              value={secretKey}
              placeholder="Add an S3 Secret Key"
              className="max-w-96 w-96"
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Region
            </Label>
            <Input
              id="region"
              value={region}
              placeholder="Add the region of the S3 bucket"
              className="max-w-96 w-96"
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name" className="text-left">
              Bucket Name
            </Label>
            <Input
              id="bucket-name"
              value={bucketName}
              placeholder="Add the name of the S3 bucket"
              className="max-w-96 w-96"
              onChange={(e) => setBucketName(e.target.value)}
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
              value={folder}
              placeholder="Add the folder path in the S3 bucket"
              className="max-w-96 w-96"
              onChange={(e) => setFolder(e.target.value)}
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
              {documents.map((document, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{document.Key}</TableCell>
                  <TableCell>{document.LastModified}</TableCell>
                  <TableCell className="text-right">{document.Size}</TableCell>
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
          <Button type="submit" onClick={saveHandler}>
            Start Bulk Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default BulkUploadDocumentsButtonModal;
