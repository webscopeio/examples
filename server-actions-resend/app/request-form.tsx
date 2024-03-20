"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, RotateCwIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { sendContactFormEmail } from "./actions";
import {
  UsernameRequest,
  type UsernameRequestForm,
  usernameRequestForm,
} from "./types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation } from "@/lib/utils";

export const RequestForm: React.FC<{
  requests: UsernameRequest[];
  setRequests: (payload: UsernameRequest[]) => void;
}> = ({ requests, setRequests }) => {
  const form = useForm<UsernameRequestForm>({
    resolver: zodResolver(usernameRequestForm),
    defaultValues: {
      username: "",
    },
  });

  const [optimisticRequests, addOptimisticRequest] = React.useOptimistic<
    UsernameRequest[],
    { username: string }
  >(requests, (currentState, optimisticValue) => [
    ...currentState,
    {
      ...optimisticValue,
      status: "Pending",
    },
  ]);

  const { isPending, isError, mutate } = useMutation({
    mutationFn: sendContactFormEmail,
    onSuccess: (data) => {
      if (data) {
        // form.reset();
        setRequests([
          ...requests,
          {
            ...data,
            status: "Requested",
          },
        ]);
        toast.success(
          `You have successfully submitted a claim for: @${data.username}`
        );
      }
    },
    onError: (error, variables) => {
      setRequests([
        ...requests,
        {
          username: variables.username,
          status: "Error",
        },
      ]);
      toast.error(error.message);
    },
  });

  const [isPendingTransition, startTransition] = React.useTransition();

  const [isPendingOptimistic, startOptimisticTransition] =
    React.useTransition();

  function handleSubmitWithTransition(values: UsernameRequestForm) {
    setRequests([
      ...requests,
      {
        ...values,
        status: "Pending",
      },
    ]);
    startTransition(async () => {
      toast.promise(sendContactFormEmail(values), {
        loading: `Submitting a claim for @${values.username}`,
        success: (data) => {
          // form.reset();
          setRequests([
            ...requests,
            {
              ...data,
              status: "Requested",
            },
          ]);
          return `You have successfully submitted a claim for: @${data.username}`;
        },
        error: (error) => {
          setRequests([
            ...requests,
            {
              username: values.username,
              status: "Error",
            },
          ]);
          return error instanceof Error ? error.message : "Unknown error";
        },
      });
    });
  }

  function handleSubmitWithOptimistic(values: UsernameRequestForm) {
    startOptimisticTransition(async () => {
      addOptimisticRequest(values);
      toast.promise(sendContactFormEmail(values), {
        loading: `Submitting a claim for @${values.username}`,
        success: (data) => {
          // form.reset();
          setRequests([
            ...requests,
            {
              ...data,
              status: "Requested",
            },
          ]);
          return `You have successfully submitted a claim for: @${data.username}`;
        },
        error: (error) => {
          setRequests([
            ...requests,
            {
              username: values.username,
              status: "Error",
            },
          ]);
          return error instanceof Error ? error.message : "Unknown error";
        },
      });
    });
  }

  return (
    <div className="space-y-9">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Claim username
        </h1>
        <Form {...form}>
          <form
            action={() => {
              form.handleSubmit((values) => {
                setRequests([
                  ...requests,
                  {
                    ...values,
                    status: "Pending",
                  },
                ]);
                mutate(values);
              })();
            }}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="iamhectorsosa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={isPending}
                data-loading={isPending}
                data-error={isError}
                variant={isError ? "destructive" : "default"}
                className="group"
              >
                <Loader2Icon className="mr-2 hidden size-4 animate-spin group-data-[loading=true]:block" />
                <RotateCwIcon className="mr-2 hidden size-4 group-data-[error=true]:block" />
                <span className="hidden group-data-[error=true]:block">
                  Retry
                </span>
                <span className="hidden group-data-[error=false]:block">
                  Submit
                </span>
              </Button>
              <Button
                type="button"
                onClick={(e) =>
                  form.handleSubmit((values) => {
                    handleSubmitWithTransition(values);
                  })(e)
                }
                disabled={isPendingTransition}
                data-loading={isPendingTransition}
                className="group"
                variant="secondary"
              >
                <Loader2Icon className="mr-2 hidden size-4 animate-spin group-data-[loading=true]:block" />
                Use Transition
              </Button>
              <Button
                type="button"
                onClick={(e) =>
                  form.handleSubmit((values) => {
                    handleSubmitWithOptimistic(values);
                  })(e)
                }
                disabled={isPendingOptimistic}
                data-loading={isPendingOptimistic}
                className="group"
                variant="ghost"
              >
                <Loader2Icon className="mr-2 hidden size-4 animate-spin group-data-[loading=true]:block" />
                Use Optismistic
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Historical requests
        </h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticRequests.map((request, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  @{request.username}
                </TableCell>
                <TableCell>{request.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
