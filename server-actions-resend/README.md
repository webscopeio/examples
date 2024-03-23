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

Behind the scenes, Server Actions use the POST method, and only this HTTP method is allowed to invoke them. This prevents most CSRF vulnerabilities in modern browsers. Server Actions in Next also compare request headers. If these don't match, the request will be aborted. In other words, Server Actions can only be invoked on the same host as the page that hosts it. A deeper read can be referenced in Sebastian Markbåge's [How to Think About Security in Next.js](https://nextjs.org/blog/security-nextjs-server-components-actions)

![Server Actions Network Request](/assets/server-actions-network-request.png "Server Actions Network Request")

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

### Form UI

Then set up your Form component using your resolver and type definition from your schema.

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

Typically you would define an `onSubmit` function and provide in the form's `onSubmit` attribute. However, you can invoke the `handleSubmit` method outside of the `onSubmit` attribute. Here are several examples:

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

Or if you have different triggers in your form, you can also use a button.

```tsx
<Button type="button" onClick={() => form.handleSubmit(onSubmit)()} />
```

### Server Action

To call a Server Action in a Client Component, create a new file and add the `"use server"` directive at the top of it. All functions within the file will be marked as Server Actions that can be reused in both Client and Server Components.

```ts
"use server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(form: Form): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Hector from webscope.io <sosa@webscope.io>",
    to: [form.email],
    subject: "Thank you for your message!",
    text: "We will reach out to you shortly",
    react: EmailTemplate(form),
  });

  if (error) {
    throw error;
  }
}
```

Resend's SDK returns a `data` and `error` response in `CreateEmailResponse`. However, in this example we only make use of the error since the data only contains the email ID.

### Handling States

Since Server Actions are just functions, it is up to us to handle states in our UI to provide an appropriate feedback to our user. These are roughly the states the UI needs:

- A `isPending` state while the Server Action is being processed.
- A `isError` state if the Server Action responds with an error.

Good to have are the following callbacks:

- A `onSuccess` callback once the Server Action is successful.
- A `onError` callback if the Server actions response with an error for next steps.

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

### What if you are not using TanStack Query

This would be a mistake. However, just for the fun of it, if your project is not using TanStack Query or this is the only use case for it here's a drop-in replacement you can have in your utils:

```ts
export function useServerFunction<TVariables, TData>(
  fn: (variables: TVariables) => Promise<TData | void>,
  callbacks?: {
    onSuccess?: (variables: TVariables, data: TData | void) => void;
    onError?: (error: Error) => void;
  }
) {
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const execute = React.useCallback<(variables: TVariables) => void>(
    async (variables) => {
      setIsPending(true);
      try {
        const data = await fn(variables);
        setIsError(false);
        callbacks?.onSuccess?.(variables, data);
      } catch (error) {
        setIsError(true);
        callbacks?.onError?.(
          error instanceof Error ? error : new Error("Unknown error")
        );
      } finally {
        setIsPending(false);
      }
    },
    [fn, callbacks]
  );

  return { isPending, isError, execute };
}
```

## Will you give Server Actions a try?

React's Server Actions fundamentally streamline the implementation of email functionalities in web applications, making it a highly efficient and reliable solution. This guided example not only demonstrates the process from schema validation to state management but also emphasizes the ease of integration with essential web development tools, illustrating a holistic approach to modern web application development.

- **Simplified Process**: The introduction of Server Actions eradicates the necessity for back-and-forth logic between client and server to manage email sending, state processing, and response handling. By directly calling a Server Action, developers can swiftly set up email delivery mechanisms.

- **Reliable Security**: The security measures built into Server Actions, such as the exclusive use of the POST method and header verification to prevent CSRF vulnerabilities, offer a reliable security framework. This ensures that Server Actions are securely invoked only from the same host, minimizing potential security threats.

- **State Handling and Flexibility**: Handling UI states is crucial in providing user feedback. The use of TanStack Query, as recommended, facilitates this by offering a structured approach to mutations and state management.

So will you give Server Actions a try? Let us know why or why not and have fun! Thanks for reading!
