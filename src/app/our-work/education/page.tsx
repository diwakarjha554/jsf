import { CausePage, causeMetadata } from "@/components/sections/cause-page";

export const metadata = causeMetadata("education");

export default function Page() {
  return <CausePage slug="education" />;
}
