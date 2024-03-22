import { z } from "zod";

export interface UsernameRequest {
  username: string;
  status: "Pending" | "Error" | "Requested" | "Approved" | "Rejected";
}

export const usernameRequestForm = z.object({
  username: z.string().min(3),
});

export interface UsernameRequestForm
  extends z.infer<typeof usernameRequestForm> {}
