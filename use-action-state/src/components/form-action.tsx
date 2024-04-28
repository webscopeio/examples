"use client";

import { useActionState } from "react";

type State =
  | { data: string; status: "SUCCESS" }
  | { status: "ERROR" | "INIT" };
const initState: State = { status: "INIT" };

export const FormAction = () => {
  const [action, submitAction, isPending] = useActionState(
    async (prevState: State, formData: FormData) =>
      runAction(prevState, String(formData.get("name"))),
    initState
  );

  return (
    <div>
      <form action={submitAction}>
        <input type="text" name="name" value="Hello from actions" readOnly />
        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
      <footer>
        {action.status === "INIT" && <p>Awaiting action 🚀</p>}
        {action.status === "SUCCESS" && <p>Success, all good ✅</p>}
        {action.status === "ERROR" && <p>Error, please resubmit action ❌</p>}
      </footer>
    </div>
  );
};

async function runAction(prevState: State, data: string) {
  return new Promise<State>((r) => {
    console.log(prevState);
    setTimeout(
      () =>
        Math.random() < 0.5
          ? r({ data, status: "SUCCESS" })
          : r({ status: "ERROR" }),

      1500
    );
  });
}
