# Creating an email workflow for local Supabase development

Local Supabase development is highly recommended for creating robust and efficient project workflows. With a local-first approach you can: (a) develop faster without any network latency or disruptions and even completely offline; (b) spin up unlimited Supabase instances free-of-cost; and (c) rely on code-based configurations and migrations making it easier to collaborate with team members on the same project. If you haven't tried it yet, you can read more in [Local development - How to use Supabase on your local development machine](https://supabase.com/docs/guides/cli/local-development).

Before getting started make sure that you:

- Install globally or locally (as a dev dependency) [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) to run the development stack locally on your machine.
- Install [Docker Desktop](https://docs.docker.com/desktop) to run the Docker containers required for the development stack.

This guide assumes you are working with Supabase CLI as a dev dependency. If you already have it installed globally, you can run all of the CLI commands directly, i.e. (use `supabase init` instead of `pnpm supabase init`).

This guide will help you build the following workflow:

1. Run a local Supabase instance
2. Run a local email development server using [React Email](https://react.email/docs/cli)
3. Set your [CLI configuration](https://supabase.com/docs/guides/cli/config) `supabase/config.toml` to include your email templates
4. Use [Inbucket](https://github.com/inbucket/inbucket) to capture emails sent from your local machine

## 1. Run a local Supabase instance

Go ahead and run the following commands:

```bash
# Create a cwd and initialize a project
mkdir supatest
cd supatest
pnpm init

# Install Supabase CLI as a dev dependency
pnpm add -D supabase

# Initialize and start
pnpm supabase init
pnpm supabase start
```

Once all of the Supabase services are running, you'll see the following output containing your local Supabase credentials:

```bash
        API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJh......
service_role key: eyJh......
```

From all of these we will be using:

- **Studio**: This container runs a web-based interface for managing your Supabase instance.
- **Inbucket**: This container runs an email testing service; it will accept messages for any email address and make them available via web interface.

### Additional information about Supabase CLI

What is good to know about the `supabase start` output:

- The environment variables are hard-coded and safe to include in your `.env.example` file
- You can use `supabase stop` at any time to stop all services (without resetting your local database). Use `supabase stop --no-backup` to stop all services and reset your local database

You can also add some of the Supabase CLI commands in your `package.json` for ease-of-use such as:

```json
"scripts": {
  "db:start": "supabase start",
  "db:stop": "supabase stop",
  "db:reset": "supabase db reset",
  "db:gen-types": "supabase gen types typescript --local > types/supabase.ts"
}
```

### Sending your first email

Go to Studio (using the Studio URL) and visit the Authentication page and click on "Add user" to send an invitation to any email. Once you have sent an invitation a new user will appear in a `Waiting for verification...` state.

![Supabase Studio Invite User](assets/01-supabase-studio-invite-user.png "Supabase Studio Invite User")

Go to Inbucket (using the Inbucket URL) and your recently sent email should appear in "Monitor" or you will be able to find it under "Recent Mailboxes".

This is a fully functional email, but it isn't styled and it may not be the exact same email you want to send in production. Supabase Auth makes use of [Go Templates](https://pkg.go.dev/text/template) and you may be wanting to add more variables or add conditions based on the authentication method or user. You can read more about this in [Email Templates - Learn how to manage the email templates in Supabase](https://supabase.com/docs/guides/auth/auth-email-templates)

![Supabase Default Invite Email Template](assets/02-supabase-default-invite-email-template.png "Supabase Default Invite Email Template")

## 2. Run a local email development server using React Email

Enter React Email, a collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript. React Email also has a CLI that is able to start a local development server for email development. Here's how to integrate it into your existing project.

```bash
# Add dependencies
pnpm add react @react-email/components

# Add dev dependencies
pnpm add -D react-email
```

With these dependencies we will be able to create, develop and test our emails using React Email's development server and use their CLI to generate HTML files for our Supabase project.

Again, here are some commands you can add in your `package.json` for ease-of-use:

```json
"scripts": {
  "email:dev": "email dev -p 4000",
  "email:export": "email export --outDir supabase/templates --pretty",
}
```

Before you run any of these commands make sure to create an `./emails` directory and create a `invite.tsx` file using this example [/examples/supabase-email-workflow/emails/invite.tsx](https://github.com/webscopeio/examples/blob/main/supabase-email-workflow/emails/invite.tsx)

All of the available variables for Suapbase Auth emails can be found in [Email Tempaltes Terminology](https://supabase.com/docs/guides/auth/auth-email-templates). Once you have set everything you need for email development you can continue with the following commands:

```bash
# Test your email development server running
pnpm email:dev

# Generate HTML for your templates running
pnpm email:export
```

![React Email Development Server](assets/03-react-email-development-server.png "React Email Development Server")

Once you are happy with your template and are ready to test your emails with Inbucket. You should make sure they are available in `supabase/templates` after running `pnpm email:export`.

## 3. Set your CLI configuration to include your email templates

You can customize all of the authentication emails in your CLI configuration using the `config.toml` file. This guide is only showcasing the invite email but you can read more about the other available email templates in [Customizing Email Templates](https://supabase.com/docs/guides/cli/customizing-email-templates).

```toml
[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = true

[auth.email.template.invite]
subject = "You have been invited"
content_path = "./supabase/templates/invite.html"

```

Remember, you will need to reset or restart your containers whenever the CLI configuration changes.

## 4. Use Inbucket to capture emails sent from your local machine

Now you can use Inbucket to test the email templates, use different email addresses, see how the variables are being loaded into the emails and test the different authentication flows. You should be able to see both the generated HTML and Plain Text from your email templates.

![Supabase New Invite Email Template](assets/04-supabase-new-invite-email-template.png "Supabase New Invite Email Template")

These settings are only for local development. To update your hosted project, please copy the templates from `supabase/templates` into the [Email Templates](https://arc.net/l/quote/kjchbwqk) section of the Dashboard.

Keep in mind that for your production application you should update your SMTP configuration to use a service such as [Resend](https://resend.com). You can read more about this process in their guide [Supabase with SMTP](https://resend.com/docs/send-with-supabase-smtp)

## Main takeaways

To wrap up, integrating a local Supabase setup with an email workflow is a game-changer for development efficiency and effectiveness. Here's why this approach is a win-win:

- **Rapid Developmen**: Eliminating network delays with local Supabase speeds up development, while direct email testing slashes time to perfect email communications.
- **Cost-Effective**: Free unlimited Supabase instances keep your budget in check.
- **Team Synergy**: Code configurations ease collaboration and version control, and streamlined email development aligns your team on user communication strategies.
- **Quality Assurance**: With tools like React Email and Inbucket, you ensure your emails look great and work perfectly, enhancing the user experience.

Check out all the complete code snippets and the demo in [github.com/webscopeio/examples/tree/main/supabase-email-workflow](https://github.com/webscopeio/examples/tree/main/supabase-email-workflow)

Embrace this setup to boost your project's development workflow and deliver outstanding email communication. Give it a go, your project (and inbox) will thank you.
