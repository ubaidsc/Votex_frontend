import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Voter } from "@/types";
import { voterService } from "@/services/voterService";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const voterSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  cnic: Yup.string()
    .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format: 12345-1234567-1")
    .required("CNIC is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ManageVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState<
    string | null
  >(null);

  const fetchVoters = async () => {
    try {
      setIsLoading(true);
      const data = await voterService.getAllVoters();
      setVoters(data.voters);
    } catch (error) {
      console.error("Error fetching voters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleCreateVoter = async (
    values: Omit<Voter, "id" | "isActive">,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      await voterService.createVoter(values);
      toast.success("Voter created successfully");
      resetForm();
      fetchVoters();
    } catch (error) {
      console.error("Error creating voter:", error);
    }
  };

  const handleUpdateVoter = async (values: Partial<Voter>) => {
    if (!selectedVoter) return;

    try {
      await voterService.updateVoter(selectedVoter.id, values);
      toast.success("Voter updated successfully");
      setSelectedVoter(null);
      fetchVoters();
    } catch (error) {
      console.error("Error updating voter:", error);
    }
  };

  const handleDeleteVoter = async (id: string) => {
    try {
      await voterService.deleteVoter(id);
      toast.success("Voter deleted successfully");
      fetchVoters();
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      setIsResetPasswordLoading(id);
      await voterService.resetVoterPassword(id);
      toast.success("Password reset successfully and sent to voter");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsResetPasswordLoading(null);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "CNIC", accessorKey: "cnic" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Status",
      accessorKey: (row: Voter) => (row.isActive ? "Active" : "Inactive"),
      cell: (row: Voter) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: (row: Voter) => (
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVoter(row)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Voter</DialogTitle>
              </DialogHeader>
              <Formik
                initialValues={{
                  name: row.name,
                  email: row.email,
                  isActive: row.isActive,
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Name is required"),
                  email: Yup.string()
                    .email("Invalid email")
                    .required("Email is required"),
                })}
                onSubmit={handleUpdateVoter}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-sm text-destructive"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-destructive"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Field
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium">
                        Active
                      </label>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                          <LoadingSpinner size="small" className="mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            disabled={isResetPasswordLoading === row.id}
            onClick={() => handleResetPassword(row.id)}
          >
            {isResetPasswordLoading === row.id ? (
              <LoadingSpinner size="small" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="sr-only">Reset Password</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the voter. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteVoter(row.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Voters</h1>
          <p className="text-muted-foreground">
            Create, update, and manage voter accounts.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Voter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Voter</DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{ name: "", cnic: "", email: "" }}
              validationSchema={voterSchema}
              onSubmit={handleCreateVoter}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="John Doe"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cnic" className="text-sm font-medium">
                      CNIC
                    </label>
                    <Field
                      id="cnic"
                      name="cnic"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="12345-1234567-1"
                    />
                    <ErrorMessage
                      name="cnic"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="john@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <LoadingSpinner size="small" className="mr-2" />
                      )}
                      Add Voter
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={voters}
        isLoading={isLoading}
        keyField="id"
        noDataMessage="No voters found. Add your first voter to get started."
      />
    </div>
  );
}
