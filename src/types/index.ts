// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeParsedData?: ResumeParsedData;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeParsedData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience?: number;
  education?: Education[];
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
}

export interface UserPreferences {
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  locations: string[];
  jobTypes: JobType[];
  educationLevel?: string;
  industry?: string;
  remotePreferred?: boolean;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceMin?: number;
  experienceMax?: number;
  description?: string;
  requirements?: string;
  skills: string[];
  jobType: JobType;
  source: string;
  sourceJobId: string;
  sourceApplyUrl: string;
  postedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'full-time' | 'part-time' | 'internship' | 'remote';

// Job Application Types
export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  appliedAt: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
}

// Search and Filter Types
export interface JobSearchCriteria {
  query?: string;
  location?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  jobTypes?: JobType[];
  industry?: string;
  postedAfter?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 'latest' | 'relevant' | 'salary_high' | 'salary_low';

export interface JobSearchResponse {
  jobs: Job[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// Component Props Types
export interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (job: Job) => void;
  isSaved?: boolean;
  compact?: boolean;
}

export interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  onSaveJob?: (jobId: string) => void;
  onApplyJob?: (job: Job) => void;
  savedJobs?: string[];
}

export interface SearchBoxProps {
  onSearch: (criteria: JobSearchCriteria) => void;
  loading?: boolean;
  initialValue?: JobSearchCriteria;
}

export interface JobFiltersProps {
  filters: JobSearchCriteria;
  onFiltersChange: (filters: JobSearchCriteria) => void;
  loading?: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: ApiError;
}

// Analytics Types
export interface SearchMetrics {
  userId?: string;
  query: string;
  filters: JobSearchCriteria;
  resultCount: number;
  timestamp: string;
}

export interface ApplicationMetrics {
  userId?: string;
  jobId: string;
  source: string;
  timestamp: string;
}