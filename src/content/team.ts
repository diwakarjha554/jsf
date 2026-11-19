export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /** Path under /public, e.g. "/images/team/prashant.jpg". Initials are shown if empty. */
  photo?: string;
};

/**
 * Founding members as listed in the MOA.
 * [TBD] Confirm with each person: their title, a short bio, a photo, and consent to appear on the site.
 */
export const board: TeamMember[] = [
  { name: "Prashant Prashar", role: "Founding Member", bio: "[TBD] Short bio." },
  { name: "Shubham Gupta", role: "Founding Member", bio: "[TBD] Short bio." },
  { name: "Deepti Gupta", role: "Founding Member", bio: "[TBD] Short bio." },
  { name: "Priyanka Gupta", role: "Founding Member", bio: "[TBD] Short bio." },
];

export const advisors: TeamMember[] = [];
