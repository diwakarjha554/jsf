"use client";

import { HandHeart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AGE_GROUPS, AVAILABILITY, VOLUNTEER_INTERESTS, VOLUNTEER_TYPES } from "@/content/options";
import { volunteerSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Checkbox, CheckboxGroup, FormError, FormSuccess, Honeypot, SelectField, TextArea, TextField } from "./fields";
import { Turnstile } from "./turnstile";
import { formValues, useFormSubmit } from "./use-form-submit";

export function VolunteerForm() {
  const { status, errors, message, submit, markStarted } = useFormSubmit("/api/forms/volunteer", volunteerSchema);
  const [token, setToken] = useState("");
  const [minor, setMinor] = useState(false);

  if (status === "success") {
    return (
      <FormSuccess title="Welcome aboard!">
        Thank you for signing up. We&apos;ve emailed you a confirmation, and our volunteer coordinator will be in touch
        within a week.
      </FormSuccess>
    );
  }

  return (
    <form
      noValidate
      onFocus={markStarted}
      onSubmit={(e) => {
        e.preventDefault();
        const { values, honeypot } = formValues(e.currentTarget, ["interests"], ["consent", "guardianConsent"]);
        submit(values, { homepage: honeypot, turnstileToken: token });
      }}
      className="relative space-y-6"
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" required error={errors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
        <TextField label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" required error={errors.phone} />
        <TextField label="City" name="city" autoComplete="address-level2" required error={errors.city} />
        <SelectField
          label="Age group"
          name="ageGroup"
          options={AGE_GROUPS}
          required
          error={errors.ageGroup}
          onChange={(e) => setMinor(e.target.value === "Under 18")}
        />
        <SelectField label="I want to join as" name="type" options={VOLUNTEER_TYPES} required error={errors.type} />
        <SelectField label="Availability" name="availability" options={AVAILABILITY} required error={errors.availability} className="sm:col-span-2" />
      </div>
      <CheckboxGroup legend="Areas you'd like to help with" name="interests" options={VOLUNTEER_INTERESTS} required error={errors.interests} />
      <TextArea label="Skills or experience" name="skills" rows={3} maxLength={1000} error={errors.skills} hint="For example teaching, medicine, design, photography, event management." />
      <TextArea label="Why do you want to join us?" name="message" rows={3} maxLength={1000} error={errors.message} />
      {minor && (
        <Checkbox name="guardianConsent" error={errors.guardianConsent}>
          My parent or guardian knows about and agrees to my volunteering.
        </Checkbox>
      )}
      <Checkbox name="consent" error={errors.consent}>
        I agree to Jeevansphere Foundation storing these details to contact me about volunteering, as described in the{" "}
        <Link href="/privacy-policy" className="font-semibold text-brand-700 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Turnstile onToken={setToken} />
      <FormError message={status === "error" ? message : ""} />
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        <HandHeart className="h-5 w-5" aria-hidden="true" />
        {status === "submitting" ? "Sending…" : "Sign me up"}
      </Button>
    </form>
  );
}
