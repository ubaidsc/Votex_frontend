import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Poll } from "@/types";
import { pollService } from "@/services/pollService";
import { DataTable } from "@/components/ui/DataTable";
import { formatDate, isAfterNow } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const pollSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  options: Yup.array()
    .of(Yup.string().required("Option is required"))
    .min(2, "At least two options are required")
    .required("Options are required"),
  deadline: Yup.date()
    .min(new Date(), "Deadline must be in the future")
    .required("Deadline is required"),
});

export default function ManagePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const data = await pollService.getAllPolls();
      setPolls(data.polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreatePoll = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const pollData = {
        ...values,
        deadline: values.deadline.toISOString(),
        options: values.options, // Send options as an array of strings
      };

      await pollService.createPoll(pollData);
      toast.success("Poll created successfully");
      resetForm();
      setIsCreateDialogOpen(false);
      fetchPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const handleUpdatePoll = async (values: any) => {
    if (!selectedPoll) return;

    try {
      const pollData = {
        ...values,
        deadline: values.deadline.toISOString(),
        options: values.options, // Send options as an array of strings
      };

      await pollService.updatePoll(selectedPoll.id, pollData);
      toast.success("Poll updated successfully");
      setSelectedPoll(null);
      setIsEditDialogOpen(false);
      fetchPolls();
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  };

  const handleDeletePoll = async (id: string) => {
    try {
      await pollService.deletePoll(id);
      toast.success("Poll deleted successfully");
      fetchPolls();
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const columns = [
    { header: "Title", accessorKey: "title" },
    {
      header: "Options",
      accessorKey: (row: Poll) => `${row.options.length} options`,
      cell: (row: Poll) => (
        <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
          {row.options.length} options
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: Poll) => {
        const statusMap = {
          draft: {
            class:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            label: "Draft",
          },
          active: {
            class:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            label: "Active",
          },
          closed: {
            class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            label: "Closed",
          },
        };

        const status = statusMap[row.status];

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Deadline",
      accessorKey: (row: Poll) => formatDate(row.deadline),
      cell: (row: Poll) => {
        const isActive = isAfterNow(row.deadline);
        return (
          <span
            className={
              isActive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {formatDate(row.deadline)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: (row: Poll) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPoll(row);
              setIsEditDialogOpen(true);
            }}
            disabled={row.status === "closed"}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to={`/organizer/results/${row.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Results</span>
            </Link>
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
                  This will permanently delete the poll and all associated
                  votes. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeletePoll(row.id)}
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
          <h1 className="text-2xl font-bold tracking-tight">Manage Polls</h1>
          <p className="text-muted-foreground">
            Create, update, and manage polls for voters.
          </p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={polls}
        isLoading={isLoading}
        keyField="id"
        noDataMessage="No polls found. Create your first poll to get started."
      />

      {/* Create Poll Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              title: "",
              description: "",
              options: ["", ""],
              deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
            }}
            validationSchema={pollSchema}
            onSubmit={handleCreatePoll}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Presidential Election 2025"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-destructive"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Vote for your preferred candidate"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-sm text-destructive"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Options</label>
                  <FieldArray name="options">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.options.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`options.${index}`}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder={`Option ${index + 1}`}
                            />
                            {values.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <ErrorMessage
                          name="options"
                          component="div"
                          className="text-sm text-destructive"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push("")}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="space-y-2">
                  <label htmlFor="deadline" className="text-sm font-medium">
                    Deadline
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {values.deadline ? (
                          format(values.deadline, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={values.deadline}
                        onSelect={(date) => setFieldValue("deadline", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="text-sm text-destructive"
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <LoadingSpinner size="small" className="mr-2" />
                    )}
                    Create Poll
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Poll Dialog */}
      {selectedPoll && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Poll</DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{
                title: selectedPoll.title,
                description: selectedPoll.description,
                options: selectedPoll.options.map((o) => o.text),
                deadline: new Date(selectedPoll.deadline),
                status: selectedPoll.status,
              }}
              validationSchema={pollSchema}
              onSubmit={handleUpdatePoll}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Field
                      id="title"
                      name="title"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Presidential Election 2025"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Vote for your preferred candidate"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    <FieldArray name="options">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Field
                                name={`options.${index}`}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder={`Option ${index + 1}`}
                              />
                              {values.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <ErrorMessage
                            name="options"
                            component="div"
                            className="text-sm text-destructive"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => push("")}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm font-medium">
                      Deadline
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {values.deadline ? (
                            format(values.deadline, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={values.deadline}
                          onSelect={(date) => setFieldValue("deadline", date)}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage
                      name="deadline"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
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
      )}
    </div>
  );
}
