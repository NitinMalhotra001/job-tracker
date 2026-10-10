export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  link: string;
  salary: string;
  notes: string;
  status: Status;
  /** ISO date string, YYYY-MM-DD */
  appliedDate: string;
  createdAt: number;
}

export type JobInput = Omit<Job, 'id' | 'createdAt'>;

export type SortKey = 'newest' | 'company' | 'applied';
