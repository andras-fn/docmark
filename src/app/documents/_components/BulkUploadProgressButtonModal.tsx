"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BulkUploadProgressButtonModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  interface BulkUploadData {
    documentGroupName: string;
    bucket: string;
    folder: string;
    createdAt: string;
    numberOfFiles: number;
    status: string;
  }

  const [bulkUploadData, setBulkUploadData] = useState<BulkUploadData[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch bulk upload data
    // set bulk upload data to the response
    // if failed, set error to true and set error message

    const fetchBulkUploadData = async () => {
      try {
        setLoading(true); // Set loading state to true

        const response = await fetch("/api/v1/documents/bulk-upload/progress", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBulkUploadData(data.data);
        } else {
          setError(true);
          setErrorMessage("Failed to fetch bulk upload data");
        }
      } catch (error: any) {
        setError(true);
        setErrorMessage(error.toString());
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchBulkUploadData();
  }, [modalOpen]);
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Upload Progress</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[60%] overflow-y-auto"
        aria-describedby={"This is a modal for viewing bulk upload progress"}
      >
        <DialogHeader>
          <DialogTitle>Bulk Upload Progress</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {/*  this is for the bulkupload data job so it should include the group name, number of docs affected etc (we should save that in the first place as well) */}
              <TableHead className="w-64">Document Group Name</TableHead>
              <TableHead>Bucket</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Started</TableHead>
              <TableHead className="text-right">Number of Documents</TableHead>
              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bulkUploadData.map((data, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {data.documentGroupName}
                </TableCell>
                <TableCell>{data.bucket}</TableCell>
                <TableCell>{data.folder}</TableCell>
                <TableCell>{data.createdAt}</TableCell>
                <TableCell className="text-right">
                  {data.numberOfFiles}
                </TableCell>
                <TableCell className="text-right">{data.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
export default BulkUploadProgressButtonModal;
