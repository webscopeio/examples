"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { sendEmail } from "./actions";
import { toast } from "sonner";
import { Loader2Icon, RotateCwIcon } from "lucide-react";
import { useMutation } from "@/lib/utils";
import { FormFields, formSchema } from "./types";
import { Textarea } from "@/components/ui/textarea";

export const ContactForm: React.FC = () => {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const { isPending, isError, mutate } = useMutation({
    mutationFn: sendEmail,
    onSuccess: (_, { email }) => {
      form.reset();
      toast.success("Thank you", {
        description: `We will reply shortly to: ${email}!`,
      });
    },
    onError: (error) => {
      toast.error("Something went wrong!", {
        description: error.message,
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(mutate)} className="space-y-6 w-full">
        <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="sosa@webscope.io" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          data-loading={isPending}
          data-error={isError}
          variant={isError ? "destructive" : "default"}
          className="group"
        >
          <Loader2Icon className="mr-2 hidden size-4 animate-spin group-data-[loading=true]:block" />
          <RotateCwIcon className="mr-2 hidden size-4 group-data-[error=true]:block" />
          <span className="hidden group-data-[error=true]:block">Retry</span>
          <span className="hidden group-data-[error=false]:block">Submit</span>
        </Button>
      </form>
    </Form>
  );
};
