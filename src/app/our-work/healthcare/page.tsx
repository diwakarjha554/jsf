import { CausePage, causeMetadata } from "@/components/sections/cause-page";

export const metadata = causeMetadata("healthcare");

export default function Page() {
  return <CausePage slug="healthcare" />;
}
