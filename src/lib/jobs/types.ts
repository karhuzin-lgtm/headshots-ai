import type { PlanId } from "@/lib/plans";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type JobRow = {
  id: string;
  created_at: string;
  updated_at: string;
  status: JobStatus;
  plan: PlanId;
  style_keys: string[];
  input_paths: string[];
  output_paths: string[];
  total_outputs: number;
  error: string | null;
  paid: boolean;
  stripe_checkout_session_id: string | null;
};
