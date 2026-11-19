import { Landmark, type LucideProps } from "lucide-react";

/** lucide-react v1 has no Building2; Landmark reads as "bank" here. */
export function Building2Fallback(props: LucideProps) {
  return <Landmark aria-hidden="true" {...props} />;
}
