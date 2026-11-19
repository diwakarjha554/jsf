"use client";

import { Handshake } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ORG_TYPES, PARTNER_INTERESTS } from "@/content/options";
import { partnerSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Checkbox, CheckboxGroup, FormError, FormSuccess, Honeypot, SelectField, TextArea, TextField } from "./fields";
import { Turnstile } from "./turnstile";
import { formValues, useFormSubmit } from "./use-form-submit";

export function PartnerForm() {
  const { status, errors, message, submit, markStarted } = useFormSubmit("/api/forms/partner", partnerSchema);
  const [token, setToken] = useState("");

  if (status === "success") {
    return (
      <FormSuccess title="Thank you for reaching out">
        We&apos;ve received your enquiry and emailed you a confirmation. Our partnerships team will contact you within
        three working days.
      </FormSuccess>
    );
  }

  return (
    <form
      noValidate
      onFocus={markStarted}
      onSubmit={(e) => {
        e.preventDefault();
        const { values, honeypot } = formValues(e.currentTarget, ["interests"], ["consent"]);
        submit(values, { homepage: honeypot, turnstileToken: token });
      }}
      className="relative space-y-6"
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Organisation name" name="organisation" autoComplete="organization" required error={errors.organisation} />
        <SelectField label="Organisation type" name="orgType" options={ORG_TYPES} required error={errors.orgType} />
        <TextField label="Contact person" name="contactPerson" autoComplete="name" required error={errors.contactPerson} />
        <TextField label="Designation" name="designation" autoComplete="organization-title" error={errors.designation} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
        <TextField label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required error={errors.phone} />
        <TextField label="Website" name="website" type="url" inputMode="url" autoComplete="url" error={errors.website} className="sm:col-span-2" placeholder="https://" />
      </div>
      <CheckboxGroup legend="Interested in" name="interests" options={PARTNER_INTERESTS} required error={errors.interests} />
      <TextArea label="Tell us about your idea" name="message" required maxLength={2000} error={errors.message} />
      <Checkbox name="consent" error={errors.consent}>
        I agree to Jeevansphere Foundation storing these details to respond to this enquiry, as described in the{" "}
        <Link href="/privacy-policy" className="font-semibold text-brand-700 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Turnstile onToken={setToken} />
      <FormError message={status === "error" ? message : ""} />
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        <Handshake className="h-5 w-5" aria-hidden="true" />
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
