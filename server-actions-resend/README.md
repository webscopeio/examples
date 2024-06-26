# Using React's Server Actions and Resend for Emails

React's new source code directives provide instructions to bundlers compatible with React Server Components. The `'use server'` directive marks server-side functions that can be called from client-side code. React calls these functions **Server Actions**.

Today we will explore how to leverage Server Actions to send emails using [Next](https://nextjs.org/) (The React Framework for the Web) and [Resend](https://resend.com/) (The email API for developers).

## Why is this a good use case?

To send emails, your UI would typically have to trigger a POST request to an API endpoint. This would require setting up logic from both sides to send, manage states, process your request and provide an approriate response.

React's new `'use server'` directive makes this entire process easier if you need to setup email delivery fast. No API endpoints needed, you just _call a Server Action and you are done_.

## Getting started

In the context of a Next application, chances are that, you are or should be working with the following dependencies:

- [shadcn/ui](https://ui.shadcn.com/) Form Component which in turn includes dependencies such as [Zod](https://zod.dev/) for schema validation and static type inference and [React Hook Form](https://react-hook-form.com/) for the forms themselves
- [TanStack Query](https://tanstack.com/query/latest) for asynchronous state management
- [Resend](https://resend.com/) for sending the emails with [React Email](https://react.email/) or a component library such as [MailingUI](https://mailingui.com) for email templates.

## Is it safe to use Server Actions for this?

Behind the scenes, Server Actions use the POST method, and only this HTTP method is allowed to invoke them. This prevents most CSRF vulnerabilities in modern browsers. Server Actions in Next also compare request headers. If these don't match, the request will be aborted. In other words, Server Actions can only be invoked on the same host as the page that hosts it.

![Server Actions Network Request](assets/01-server-actions-network-request.png "Server Actions Network Request")

A deeper read can be referenced in Sebastian Markbåge's [How to Think About Security in Next.js](https://nextjs.org/blog/security-nextjs-server-components-actions)

## Putting everything together

Let's build a simple UI that will allow users to claim a username.

### Schema Validation

Personally I like starting with my type definitions. Keeping everything incredibly simple, let's set up a schema:

```ts
import { z } from "zod";

export const usernameRequestForm = z.object({
  username: z.string().min(3),
});

export type UsernameRequestForm = z.infer<typeof usernameRequestForm>;
```

### Building our UI

Let's set up your Form component using your resolver and type definition from your schema. To show an example of optimistic updates we will also display a list of requests below the form.

```tsx
export const RequestForm: React.FC = () => {
  const form = useForm<UsernameRequestForm>({
    resolver: zodResolver(usernameRequestForm),
    defaultValues: {
      username: "",
    },
  });
  // ...
```

At form submission React Hook Form uses the schema defined to validate the form values. Using its `handleSubmit` method you are able to provide an `onValid` and/or `onInvalid` callbacks using the parsed values.

Typically you would define an `onSubmit` function and provide in the form's `onSubmit` attribute. However, you can invoke the `handleSubmit` method outside of the `onSubmit` attribute. Here are some examples:

#### Using `onSubmit` attribute

This is how [ui.shadcn.com/docs/components/form](https://ui.shadcn.com/docs/components/form) is used.

```tsx
<form onSubmit={form.handleSubmit(onSubmit)} />
```

#### Using `action` attribute

If you are using `react-hook-form`, this doesn't mean that you cannot make use of the `action` attribute.

```tsx
<form action={async () => await form.handleSubmit(onSubmit)()} />
```

#### Using a button's `onClick` handler

Or if you have different triggers in your form (i.e., a draft and save action), you can also use a button.

```tsx
<Button type="button" onClick={() => form.handleSubmit(onSubmit)()} />
```

We will be using a combination of these to showcase differents ways of using this structure with Server Actions.

### Server Actions

To call a Server Action in a Client Component, create a new file and add the `"use server"` directive at the top of it. All functions within the file will be marked as Server Actions that can be reused in both Client and Server Components.

To follow our example, we will send the user a confirmation via email after the request has been processed:

```ts
"use server";

import EmailTemplate from "@/emails/email-template";
import { Resend } from "resend";
import type { UsernameRequestForm } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

function getCurrentUser() {
  return "sosa@webscope.io";
}

export async function claimUsername(form: UsernameRequestForm) {
  const userEmail = getCurrentUser();
  const { error } = await resend.emails.send({
    from: "From webscope.io <info@webscope.io>",
    to: [userEmail],
    subject: "Thank you for your message!",
    text: "We will reach out to you shortly",
    react: EmailTemplate(form),
  });

  if (error) {
    throw error;
  }

  return form;
}
```

Resend's SDK returns a `data` and `error` response in `CreateEmailResponse`. However, in this example we only make use of the error since the data only contains the email ID.

**Important note on error handling**: Just like in Server Components when using Server Actions, if an error is thrown during production, Next will strip any sensitive information and provide a generic error message and digest for log reference. This is a security precaution to avoid leaking any sensitive information included in the error to the client. You can read more about it in: [Handling Server Errors](https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-server-errors)

For the purposes of this article, we will continue working in development with unobscured error messages from Server Actions. If you do need to get specific error information from your errors, create and return an error object to the client.

### Handling States

Since Server Actions are just functions, it is up to us to handle states in our UI to provide an appropriate feedback to our user. These are roughly the states the UI needs:

- A `isPending` state while the Server Action is being processed.
- A `isError` state if the Server Action responds with an error.

![Displaying a Loading State](assets/02-loading-state.png "Displaying a Loading State")

Good to have are the following side-effects:

- A `onSuccess` callback once the Server Action is successful.
- A `onError` callback if the Server actions response with an error for next steps.


![Displaying a Error State](assets/03-error-state.png "Displaying a Error State")

Doesn't this sound like a perfect case for [TanStack Query](https://tanstack.com/query/latest)? Read their docs in [Mutations Guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) for more information.

Following our example, this is how that would look like:

```tsx
const { isPending, isError, mutate } = useMutation({
  mutationFn: sendEmail,
  onSuccess: (_, variables) => {
    toast.success("Email sent!", {
      description: `Thanks for reaching out, ${variables.name}!`,
    });
  },
  onError: (error) => {
    toast.error("Something went wrong!", {
      description: error.message,
    });
  },
});
```

This gives us everything we need to process our request and handle our UI states.

We can also make use of an async mutation to provide immediate feedback using a promise `toast`:

```tsx
const { isPending, isError, mutateAsync } = useMutation({
  mutationFn: claimUsername,
});

function handleSubmit(values: UsernameRequestForm) {
  toast.promise(mutateAsync(values), {
    loading: `Submitting a claim for @${values.username}`,
    success: (data) => {
      form.reset();
      return `You have successfully submitted a claim for: @${data.username}`;
    },
    error: (error) => {
      return error instanceof Error ? error.message : "Unknown error";
    },
  });
}
```

### What if you are not using TanStack Query

This would be a mistake. However, you are able to make use of `useTransition` and `useOptimistic` hooks to trigger a Server Action and handle the different UI states. Here is what you need to keep an eye for:

* `useOptimistic` returns a tuple with a state and action. These actions can only be called within form's actions attributes or wrapped inside of a transition function.
* `useTransition` returns a tuple with a boolean and a **non-blocking** UI transition function. Even if being used inside a form's submit attribute, a transition provides a state for all the actions and not the handler (as `useFormStatus` would) which is not the same.

Let's make use of both of these hooks and call the Server Action directly without using TanStack Query Mutations.

```tsx
function handleSubmit(values: UsernameRequestForm) {
  startTransition(() => {
    addOptimisticRequest(values);
    toast.promise(claimUsername(values), {
      loading: `Submitting a claim for @${values.username}`,
      success: (data) => {
        form.reset();
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
```

Check out all the complete code snippets and the demo in [github.com/webscopeio/examples/tree/main/server-actions-resend](https://github.com/webscopeio/examples/tree/main/server-actions-resend)

## Will you give Server Actions a try?

React's Server Actions fundamentally streamline the implementation of email functionalities in web applications, making it a highly efficient and reliable solution. This guided example not only demonstrates the process from schema validation to state management but also emphasizes the ease of integration with essential web development tools, illustrating a holistic approach to modern web application development.

- **Simplified Process**: The introduction of Server Actions eradicates the necessity for back-and-forth logic between client and server to manage email sending, state processing, and response handling. By directly calling a Server Action, developers can swiftly set up email delivery mechanisms.

- **Reliable Security**: The security measures built into Server Actions, such as the exclusive use of the POST method and header verification to prevent CSRF vulnerabilities, offer a reliable security framework. This ensures that Server Actions are securely invoked only from the same host, minimizing potential security threats.

- **State Handling and Flexibility**: Handling UI states is crucial in providing user feedback. The use of TanStack Query, as recommended, facilitates this by offering a structured approach to mutations and state management.

So will you give Server Actions a try? Let us know why or why not and have fun! Thanks for reading!
