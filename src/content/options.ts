// Choice lists shared by forms (client) and validation (server).

export const CONTACT_SUBJECTS = [
  "General",
  "Donation query",
  "Volunteering",
  "Partnership",
  "Media",
  "Other",
] as const;

export const AGE_GROUPS = ["Under 18", "18–25", "26–40", "41–60", "60+"] as const;

export const VOLUNTEER_TYPES = ["Volunteer", "Intern"] as const;

export const VOLUNTEER_INTERESTS = [
  "Education",
  "Healthcare",
  "Social welfare",
  "Culture & heritage",
  "Community development",
  "Events",
  "Fundraising",
  "Digital & design",
  "Teaching",
  "Medical",
] as const;

export const AVAILABILITY = ["Weekdays", "Weekends", "Flexible", "Remote only"] as const;

export const ORG_TYPES = [
  "Company (CSR)",
  "NGO",
  "Educational institution",
  "Government body",
  "Hospital",
  "Other",
] as const;

export const PARTNER_INTERESTS = [
  "CSR funding",
  "Programme partnership",
  "In-kind support",
  "Employee volunteering",
  "Event sponsorship",
  "Other",
] as const;

export const DEDICATION_TYPES = [
  { value: "honour", label: "In honour of" },
  { value: "memory", label: "In memory of" },
  { value: "occasion", label: "For a special occasion" },
] as const;

export const PAID_VIA = ["UPI", "Bank transfer"] as const;

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;
