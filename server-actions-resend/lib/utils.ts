import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useMutation<TVariables, TData>({
  mutationFn,
  onSuccess,
  onError,
}: {
  mutationFn: (variables: TVariables) => Promise<TData | void>;
  onSuccess?: (data: TData | void, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const mutate = React.useCallback<(variables: TVariables) => void>(
    async (variables) => {
      setIsPending(true);
      setIsError(false);
      try {
        const data = await mutationFn(variables);
        setIsError(false);
        onSuccess?.(data, variables);
      } catch (error) {
        setIsError(true);
        onError?.(
          error instanceof Error ? error : new Error("Unknown error"),
          variables
        );
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onError, onSuccess]
  );

  return { isPending, isError, mutate };
}
