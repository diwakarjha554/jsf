"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CONTACT_SUBJECTS } from "@/content/options";
import { contactSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Checkbox, FormError, FormSuccess, Honeypot, SelectField, TextArea, TextField } from "./fields";
import { Turnstile } from "./turnstile";
import { formValues, useFormSubmit } from "./use-form-submit";

export function ContactForm() {
  const { status, errors, message, submit, markStarted } = useFormSubmit("/api/forms/contact", contactSchema);
  const [token, setToken] = useState("");

  if (status === "success") {
    return (
      <FormSuccess title="Thank you for writing to us">
        We&apos;ve received your message and sent a confirmation to your email. Someone from our team will reply within
        two working days.
      </FormSuccess>
    );
  }

  return (
    <form
      noValidate
      onFocus={markStarted}
      onSubmit={(e) => {
        e.preventDefault();
        const { values, honeypot } = formValues(e.currentTarget, [], ["consent"]);
        submit(values, { homepage: honeypot, turnstileToken: token });
      }}
      className="relative space-y-5"
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" name="name" autoComplete="name" required error={errors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
        <SelectField label="Subject" name="subject" options={CONTACT_SUBJECTS} required error={errors.subject} />
      </div>
      <TextArea label="Message" name="message" required error={errors.message} maxLength={2000} />
      <Checkbox name="consent" error={errors.consent}>
        I agree to Jeevansphere Foundation storing these details to respond to me, as described in the{" "}
        <Link href="/privacy-policy" className="font-semibold text-brand-700 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Turnstile onToken={setToken} />
      <FormError message={status === "error" ? message : ""} />
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        <Send className="h-5 w-5" aria-hidden="true" />
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
