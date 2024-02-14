import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateStatusDto } from "./create-status-schema";
import { createStatusApi, useCreateStatusForm } from "./create-status-service";
import { useSession } from "@/shared/auth/core";

const createStatusContext = createContext<{
  form: UseFormReturn<CreateStatusDto, undefined>;
  mutation: UseMutationResult<null, Error, CreateStatusDto, unknown>;
} | null>(null);

export function useCreateStatusContext() {
  const context = useContext(createStatusContext);

  if (!context) throw Error("not in create status provider");

  return context;
}

export function CreateStatusProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const { form } = useCreateStatusForm();
  const mutation = useMutation({
    mutationFn: (data: CreateStatusDto) => createStatusApi({ data, session }),
    mutationKey: ["createStatus"],
    onError: (error) => form.setError("root", error),
  });

  return (
    <createStatusContext.Provider value={{ form, mutation }}>
      {children}
    </createStatusContext.Provider>
  );
}
