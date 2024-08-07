"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Wrapper = ({ intialS3Connections }) => {
  const [s3Connections, setS3Connections] = useState([]);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [port, setPort] = useState("");
  const [useSSL, setUseSSL] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    setS3Connections(intialS3Connections);
  }, [intialS3Connections]);

  const openAddS3Connection = () => {
    setName("");
    setEndpoint("");
    setPort("");
    setUseSSL(false);
    setAccessKey("");
    setSecretKey("");
    setOpen(true);
  };
  const addS3Connection = async () => {
    console.log("Add S3 Connection");
    try {
      const request = await fetch("/api/config/s3-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          endpoint,
          port,
          useSSL,
          accessKey,
          secretKey,
        }),
      });
      const response = await request.json();
      console.log(response);
      if (response.id) {
        setS3Connections([
          ...s3Connections,
          {
            id: response.id,
            name,
          },
        ]);
        setOpen(false);
        setName("");
        setEndpoint("");
        setPort("");
        setUseSSL(false);
        setAccessKey("");
        setSecretKey("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editS3Connection = async (e, id) => {
    // clear state
    // setName("");
    // setEndpoint("");
    // setPort("");
    // setUseSSL(false);
    // setAccessKey("");
    // setSecretKey("");

    try {
      const request = await fetch(`/api/config/s3-connections/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      console.log(response);
      if (response.data[0].id) {
        setName(response.data[0].name);
        setEndpoint(response.data[0].endpoint);
        setPort(response.data[0].port);
        setUseSSL(parseInt(response.data[0].useSSL) === 1 ? true : false);
        setAccessKey("●●●●●●●●●●●●●●●");
        setSecretKey("●●●●●●●●●●●●●●●");
        setEditOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveEditS3Connection = async (e, id) => {
    console.log("Edit S3 Connection");

    try {
      const request = await fetch(`/api/config/s3-connections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          endpoint,
          port,
          useSSL,
          accessKey,
          secretKey,
        }),
      });
      const response = await request.json();
      console.log(response);
      if (response.id) {
        const s3ConnectionsCopy = [...s3Connections];
        // filter current s3 connections by id, update the one that matches the id
        const updatedS3Connection = s3Connections.find(
          (item) => item.id === response.id
        );

        const index = s3Connections.indexOf(updatedS3Connection);
        s3ConnectionsCopy[index] = {
          id: response.id,
          name,
        };

        setS3Connections([...s3ConnectionsCopy]);
        setOpen(false);
        setName("");
        setEndpoint("");
        setPort("");
        setUseSSL(false);
        setAccessKey("");
        setSecretKey("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchChangeHandler = (e) => {
    console.log(e.target.value);

    if (e.target.value === "") {
      setS3Connections(intialS3Connections);
    } else {
      const filteredS3Connections = intialS3Connections.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );

      setS3Connections(filteredS3Connections);
    }
  };

  return (
    <div className="p-2">
      <div className="border border-slate-500 rounded flex flex-col divide-y divide-slate-500">
        <div className="flex justify-between text-black p-2">
          <div className="flex w-1/2 items-center border border-black divide-x divide-black">
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
            <input
              type="text"
              className="w-full p-2"
              placeholder="Search for an S3 connection here..."
              onChange={(e) => searchChangeHandler(e)}
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="p-2 border border-black"
                onClick={openAddS3Connection}
              >
                Add S3 Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add S3 Connection Details</DialogTitle>
                <DialogDescription>Add a new S3 connection.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  placeholder="Enter a name for the connection..."
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-4 py-4 text-black">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Endpoint
                  </Label>
                  <Input
                    id="endpoint"
                    value={endpoint}
                    placeholder="https://s3.amazonaws.com"
                    className="col-span-3"
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Port
                  </Label>
                  <Input
                    id="port"
                    value={port}
                    placeholder="443"
                    className="col-span-3"
                    onChange={(e) => setPort(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Use SSL
                  </Label>
                  <div className="place-self-start px-2">
                    <Input
                      id="useSSL"
                      type="checkbox"
                      checked={useSSL}
                      className="h-6"
                      onChange={(e) => setUseSSL(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Access Key
                  </Label>
                  <Input
                    id="accessKey"
                    value={accessKey}
                    placeholder="Access Key"
                    className="col-span-3"
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Secret Key
                  </Label>
                  <Input
                    id="secretKey"
                    value={secretKey}
                    placeholder="Secret Key"
                    className="col-span-3"
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addS3Connection}>Save S3 Connection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className=" divide-y">
          {s3Connections.map((item) => (
            <div
              key={item.id}
              className="flex justify-between p-2 items-center text-black"
            >
              <p className="pl-2 text-black">{item.name}</p>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="p-2 border border-black"
                    onClick={(e) => editS3Connection(e, item.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit S3 Connection Details</DialogTitle>
                    <DialogDescription>
                      Edit an existing S3 connection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      placeholder="Enter a name for the connection..."
                      className="col-span-3"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 py-4 text-black">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Endpoint
                      </Label>
                      <Input
                        id="endpoint"
                        value={endpoint}
                        placeholder="https://s3.amazonaws.com"
                        className="col-span-3"
                        onChange={(e) => setEndpoint(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Port
                      </Label>
                      <Input
                        id="port"
                        value={port}
                        placeholder="443"
                        className="col-span-3"
                        onChange={(e) => setPort(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Use SSL
                      </Label>
                      <div className="place-self-start px-2">
                        <Input
                          id="useSSL"
                          type="checkbox"
                          checked={useSSL}
                          className="h-6"
                          onChange={(e) => setUseSSL(e.target.checked)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Access Key
                      </Label>
                      <Input
                        id="accessKey"
                        value={accessKey}
                        placeholder="Access Key"
                        className="col-span-3"
                        onChange={(e) => setAccessKey(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Secret Key
                      </Label>
                      <Input
                        id="secretKey"
                        value={secretKey}
                        placeholder="Secret Key"
                        className="col-span-3"
                        onChange={(e) => setSecretKey(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={(e) => saveEditS3Connection(item.id)}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Wrapper;
