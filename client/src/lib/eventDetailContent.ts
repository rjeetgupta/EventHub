import {
  Coffee,
  Flag,
  Medal,
  Music,
  Network,
  Package,
  Presentation,
  Rocket,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Event } from "@/lib/schema/event.schema";

// ============================================================================
// CATEGORY STYLING
// ============================================================================

interface CategoryStyle {
  /** Light-mode friendly pill (works on white cards). */
  pill: string;
  /** Hero / gallery gradient for the lead image. */
  hero: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Technical: {
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    hero: "from-indigo-700 via-purple-600 to-blue-500",
  },
  Cultural: {
    pill: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
    hero: "from-purple-700 via-fuchsia-600 to-indigo-600",
  },
  Sports: {
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    hero: "from-emerald-600 via-teal-500 to-cyan-500",
  },
  Workshop: {
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    hero: "from-amber-500 via-orange-500 to-rose-500",
  },
  Seminar: {
    pill: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    hero: "from-sky-600 via-blue-600 to-indigo-600",
  },
  Hackathon: {
    pill: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    hero: "from-rose-600 via-red-500 to-orange-500",
  },
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  pill: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  hero: "from-orange-600 via-amber-500 to-rose-500",
};

export function categoryStyle(category: string): CategoryStyle {
  return (
    CATEGORY_STYLES[category] ??
    CATEGORY_STYLES[
      Object.keys(CATEGORY_STYLES).find(
        (key) =>
          category.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(category.toLowerCase()),
      ) ?? ""
    ] ??
    DEFAULT_CATEGORY_STYLE
  );
}

// ============================================================================
// GALLERY (no image uploads in the schema — rich gradients stand in for photos)
// ============================================================================

export const GALLERY_GRADIENTS = [
  "from-indigo-700 via-purple-600 to-blue-500",
  "from-sky-500 via-cyan-400 to-blue-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-fuchsia-600 via-pink-500 to-rose-400",
  "from-slate-700 via-indigo-700 to-purple-600",
  "from-violet-600 via-purple-500 to-fuchsia-500",
  "from-rose-500 via-red-500 to-orange-500",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-lime-500 via-emerald-500 to-teal-600",
  "from-orange-600 via-amber-500 to-yellow-400",
  "from-blue-700 via-blue-500 to-cyan-400",
  "from-purple-700 via-violet-600 to-indigo-500",
];

export const GALLERY_SIZE = GALLERY_GRADIENTS.length;

/** Deterministic gradient for any title (used for related-event thumbs). */
export function gradientForText(text: string): string {
  const hash = [...text].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7);
  return GALLERY_GRADIENTS[Math.abs(hash) % GALLERY_GRADIENTS.length];
}

export function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-600",
  "from-fuchsia-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-cyan-400 to-blue-600",
];

export function avatarGradient(name: string): string {
  const hash = [...name].reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) | 0, 5);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

// ============================================================================
// MOCK CONTENT (schema has no gallery/speakers/schedule/rules/FAQ models)
// ============================================================================

export interface EventHighlight {
  icon: LucideIcon;
  label: string;
  classes: string;
}

export const EVENT_HIGHLIGHTS: EventHighlight[] = [
  { icon: Trophy, label: "Technical\nCompetitions", classes: "text-orange-600 bg-orange-100 dark:bg-orange-500/15 dark:text-orange-400" },
  { icon: UsersRound, label: "Expert\nWorkshops", classes: "text-violet-600 bg-violet-100 dark:bg-violet-500/15 dark:text-violet-400" },
  { icon: Music, label: "Live\nPerformances", classes: "text-rose-600 bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400" },
  { icon: Package, label: "Project\nExhibition", classes: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400" },
  { icon: Network, label: "Networking\nOpportunities", classes: "text-red-600 bg-red-100 dark:bg-red-500/15 dark:text-red-400" },
];

export interface Speaker {
  name: string;
  role: string;
  company: string;
  topic: string;
}

export const FEATURED_SPEAKERS: Speaker[] = [
  { name: "Rohit Mehta", role: "Senior Software Engineer", company: "Google", topic: "Building Scalable Web Applications" },
  { name: "Ananya Sharma", role: "Product Designer", company: "Microsoft", topic: "Design Thinking for Modern Products" },
  { name: "Karan Malhotra", role: "AI Researcher", company: "IIT Delhi", topic: "The Future of AI in Everyday Life" },
  { name: "Priya Nair", role: "Cloud Architect", company: "Amazon Web Services", topic: "Designing for the Cloud-First Era" },
  { name: "Arjun Verma", role: "Startup Founder", company: "TechSpark", topic: "From Idea to First 1000 Users" },
  { name: "Meera Iyer", role: "Data Scientist", company: "Flipkart", topic: "Data Stories Behind Big Sale Days" },
];

export interface TeamMember {
  name: string;
  role: string;
  year: string;
}

export const ORGANIZING_TEAM: TeamMember[] = [
  { name: "Riya Singh", role: "Event Coordinator", year: "3rd Year, CSE" },
  { name: "Amit Kumar", role: "Technical Head", year: "3rd Year, CSE" },
  { name: "Sneha Patel", role: "Cultural Head", year: "2nd Year, ECE" },
  { name: "Vikram Das", role: "Sponsorship Head", year: "Final Year, ME" },
];

export interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  icon: LucideIcon;
}

export const EVENT_SCHEDULE: ScheduleItem[] = [
  { time: "9:00 AM", title: "Inauguration Ceremony", location: "Main Stage", icon: Flag },
  { time: "10:30 AM", title: "Hackathon Kickoff", location: "Innovation Lab", icon: Rocket },
  { time: "12:00 PM", title: "Technical Workshops", location: "Seminar Hall A", icon: Presentation },
  { time: "2:00 PM", title: "Lunch & Networking", location: "Food Court", icon: Coffee },
  { time: "3:30 PM", title: "Cultural Performances", location: "Open Air Theatre", icon: Music },
  { time: "7:30 PM", title: "Prize Distribution", location: "Main Stage", icon: Medal },
];

export const EVENT_RULES: string[] = [
  "Carry a valid college ID card — entry is restricted to students, faculty and invited guests.",
  "Registration is mandatory for all competitions and workshops; on-spot entries are subject to seat availability.",
  "Participants must report at their venue 15 minutes before the scheduled start time.",
  "Outside food and beverages are not allowed inside the campus event areas.",
  "Photography is permitted, but please avoid blocking walkways or stage views during performances.",
  "Maintain decorum — any misconduct may lead to cancellation of registration without refund.",
];

export interface Faq {
  question: string;
  answer: string;
}

export const EVENT_FAQS: Faq[] = [
  {
    question: "Who can attend the event?",
    answer:
      "All students, faculty members and staff of the college can attend with a valid ID. A few flagship shows may require separate passes — details will be shared on the event page closer to the date.",
  },
  {
    question: "Is there any registration fee?",
    answer:
      "General entry is free for registered students. Selected competitions and workshops may have a nominal fee to cover kits and materials, which is shown before you confirm registration.",
  },
  {
    question: "What should I bring along?",
    answer:
      "Bring your college ID, registration confirmation (digital is fine), a water bottle and loads of energy. Laptops are only required for hackathon and workshop participants.",
  },
  {
    question: "Will participation certificates be provided?",
    answer:
      "Yes — every participant receives a digital participation certificate, and winners receive merit certificates along with prizes during the closing ceremony.",
  },
  {
    question: "Is parking available on campus?",
    answer:
      "Yes, visitor parking is available near Gate 2 on a first-come basis. We strongly encourage using college buses or carpooling, as crowds are expected through the day.",
  },
];

/** "In collaboration with" partner derived from the owning department. */
const COLLABORATORS = [
  "Computer Science Department",
  "Student Affairs Council",
  "Entrepreneurship Cell",
  "Alumni Association",
  "Robotics Club",
  "Fine Arts Society",
];

export function collaboratorFor(event: Pick<Event, "departmentId" | "departmentName">): string {
  const hash = [...event.departmentId].reduce(
    (acc, ch) => (acc * 17 + ch.charCodeAt(0)) | 0,
    11,
  );
  return COLLABORATORS[Math.abs(hash) % COLLABORATORS.length];
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/** "Dec 20, 2025" */
export function formatEventDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "Dec 18, 2025, 11:59 PM" */
export function formatDeadline(deadline: string | Date): string {
  return new Date(deadline).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function to12Hour(hours: number, minutes: number): string {
  const suffix = hours < 12 ? "AM" : "PM";
  const display = (hours + 11) % 12 + 1;
  return `${display}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/**
 * The schema stores a single start time ("HH:MM"); events run a full day, so
 * derive an end time (+12h, clamped to 11:59 PM) → "9:00 AM - 9:00 PM".
 */
export function formatTimeRange(time: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!match) return time;

  const startHours = Math.min(23, Number(match[1]));
  const startMinutes = Number(match[2]);
  const endTotal = Math.min(23 * 60 + 59, startHours * 60 + startMinutes + 12 * 60);

  const endHours = Math.floor(endTotal / 60);
  const endMinutes = endTotal % 60;

  return `${to12Hour(startHours, startMinutes)} - ${to12Hour(endHours, endMinutes)}`;
}

export function seatsLeft(event: Pick<Event, "currentRegistrations" | "maxCapacity">): number {
  return Math.max(0, event.maxCapacity - event.currentRegistrations);
}

/** Pseudo contact address derived from the department (no contact model). */
export function contactFor(event: Pick<Event, "departmentName">): string {
  const slug = event.departmentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return `${slug || "events"}@college.edu`;
}

/** Registration is open while the event is published & the deadline hasn't passed. */
export function isRegistrationOpen(event: Event): boolean {
  return (
    event.status === "PUBLISHED" &&
    new Date(event.registrationDeadline).getTime() > Date.now() &&
    new Date(event.date).getTime() > Date.now()
  );
}

export function hasEventEnded(event: Event): boolean {
  return new Date(event.date).getTime() < Date.now();
}

// ============================================================================
// CATALOG (events listing page)
// ============================================================================

export type RegistrationState = "open" | "closed" | "full" | "ended";

/** Derived registration state for status badges / filters (no dedicated field). */
export function registrationStateFor(event: Event): RegistrationState {
  if (hasEventEnded(event)) return "ended";
  if (seatsLeft(event) === 0) return "full";
  if (new Date(event.registrationDeadline).getTime() <= Date.now()) return "closed";
  return "open";
}

/** Solid category pill colors for overlays on photos/gradients. */
const CATEGORY_PILL_SOLID: Record<string, string> = {
  Technical: "bg-orange-500",
  Cultural: "bg-purple-600",
  Sports: "bg-emerald-500",
  Workshop: "bg-violet-600",
  Seminar: "bg-blue-600",
  Competition: "bg-pink-600",
  Hackathon: "bg-rose-600",
  Fest: "bg-amber-500",
};

export function categoryPillSolid(category: string): string {
  return (
    Object.keys(CATEGORY_PILL_SOLID).find(
      (key) =>
        category.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(category.toLowerCase()),
      ) !== undefined
      ? CATEGORY_PILL_SOLID[
          Object.keys(CATEGORY_PILL_SOLID).find(
            (key) =>
              category.toLowerCase().includes(key.toLowerCase()) ||
              key.toLowerCase().includes(category.toLowerCase()),
          )!
        ]
      : "bg-slate-800"
  );
}
