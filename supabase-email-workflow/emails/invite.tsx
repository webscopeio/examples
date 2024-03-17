import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const redirectTo = `/settings`;
const type = "invite";
const confirmationURL = `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}&next=${redirectTo}`;

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>You have been invited</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You have been invited</Heading>
          <Text
            style={text}
          >{`You have been invited to create a user on {{ .SiteURL}}. Click below to accept the invite:`}</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmationURL}>
              Accept the invite
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            <Link
              href="https://supabase-modules-docs.vercel.app"
              target="_blank"
              style={{ ...link, color: "#71717A" }}
            >
              Supatest
            </Link>
            <br />
            Creating an email workflow for local Supabase development
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 12px 48px",
  maxWidth: "600px",
};

const h1: React.CSSProperties = {
  color: "#09090B",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 16px",
  padding: "0",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
};

const button: React.CSSProperties = {
  backgroundColor: "#18181B",
  color: "#FAFAFA",
  fontWeight: 500,
  fontSize: "14px",
  padding: "10.5px 18px",
  borderRadius: "8px",
  width: "fit-content",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
};

const code: React.CSSProperties = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#F4F4F5",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#09090B",
};

const link: React.CSSProperties = {
  color: "#2754C5",
  fontSize: "14px",
  textDecoration: "underline",
};

const text: React.CSSProperties = {
  color: "#09090B",
  fontSize: "14px",
  margin: "16px 0",
};

const hr: React.CSSProperties = {
  borderColor: "#dfe1e4",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};
