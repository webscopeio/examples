"use client";

import * as React from "react";
import { RequestForm } from "./request-form";
import type { UsernameRequest } from "./types";

const historicalRequests: UsernameRequest[] = [
  {
    username: "hectorsosa",
    status: "Requested",
  },
  {
    username: "sosahm",
    status: "Pending",
  },
];

export default function Home() {
  const [requests, setRequests] = React.useState(historicalRequests);
  return <RequestForm requests={requests} setRequests={setRequests} />;
}
