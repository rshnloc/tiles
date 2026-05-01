// ==================== USER TYPES ====================
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'agent' | 'admin';
  kyc_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==================== INSURANCE TYPES ====================
export type InsuranceCategory = 'car' | 'bike' | 'health' | 'life';

export interface Insurer {
  id: number;
  name: string;
  logo: string;
  claim_ratio: number;
  rating: number;
  description: string;
}

export interface InsurancePlan {
  id: number;
  insurer: Insurer;
  category: InsuranceCategory;
  name: string;
  premium: number;
  sum_insured: number;
  coverage: string[];
  exclusions: string[];
  add_ons: AddOn[];
  claim_ratio: number;
  cashless_hospitals?: number;
  features: Feature[];
  is_popular: boolean;
  badge?: string;
}

export interface AddOn {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Feature {
  icon: string;
  label: string;
  value: string;
}

// ==================== POLICY TYPES ====================
export type PolicyStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface Policy {
  id: number;
  policy_number: string;
  user_id: number;
  plan: InsurancePlan;
  category: InsuranceCategory;
  status: PolicyStatus;
  premium: number;
  sum_insured: number;
  start_date: string;
  end_date: string;
  nominee?: string;
  vehicle_number?: string;
  pdf_url?: string;
  created_at: string;
}

// ==================== CLAIM TYPES ====================
export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';

export interface Claim {
  id: number;
  claim_number: string;
  policy_id: number;
  policy?: Policy;
  user_id: number;
  type: string;
  status: ClaimStatus;
  amount_claimed: number;
  amount_approved?: number;
  description: string;
  documents: ClaimDocument[];
  timeline: ClaimTimeline[];
  created_at: string;
  updated_at: string;
}

export interface ClaimDocument {
  id: number;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface ClaimTimeline {
  id: number;
  status: ClaimStatus;
  message: string;
  created_at: string;
}

// ==================== AGENT TYPES ====================
export interface Agent {
  id: number;
  user_id: number;
  user?: User;
  agent_code: string;
  license_number?: string;
  irdai_code?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  certification_level: 'basic' | 'intermediate' | 'expert';
  total_policies: number;
  total_premium: number;
  commission_earned: number;
  rating: number;
  active_leads: number;
  joined_at: string;
}

export interface Lead {
  id: number;
  agent_id: number;
  name: string;
  phone: string;
  email: string;
  category: InsuranceCategory;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: number;
  agent_id: number;
  policy_id: number;
  policy?: Policy;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid';
  paid_at?: string;
  created_at: string;
}

// ==================== QUOTE TYPES ====================
export interface QuoteRequest {
  category: InsuranceCategory;
  // Car / Bike
  make?: string;
  model?: string;
  year?: number;
  registration_number?: string;
  fuel_type?: string;
  // Health
  members?: Member[];
  // Life
  age?: number;
  annual_income?: number;
  cover_amount?: number;
  tenure?: number;
}

export interface Member {
  relation: string;
  age: number;
  gender: 'male' | 'female';
  pre_existing?: boolean;
}

// ==================== KYC TYPES ====================
export interface KYCDocument {
  id: number;
  user_id: number;
  type: 'pan' | 'aadhaar' | 'license' | 'passport' | 'other';
  document_number: string;
  file_url: string;
  status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  uploaded_at: string;
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// ==================== BLOG TYPES ====================
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  read_time: number;
  published_at: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ==================== FORM TYPES ====================
export interface LoginForm {
  phone: string;
  otp?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface PolicyPurchaseForm {
  plan_id: number;
  start_date: string;
  nominee_name?: string;
  nominee_relation?: string;
  add_ons: number[];
  vehicle_number?: string;
}

// ==================== DASHBOARD STATS ====================
export interface AdminStats {
  total_users: number;
  total_agents: number;
  total_policies: number;
  total_premium: number;
  total_claims: number;
  pending_kyc: number;
  active_policies: number;
  monthly_growth: number;
}

export interface AgentStats {
  total_leads: number;
  converted_leads: number;
  active_policies: number;
  total_commission: number;
  pending_commission: number;
  monthly_target: number;
  monthly_achieved: number;
  conversion_rate: number;
}

export interface CustomerStats {
  total_policies: number;
  active_policies: number;
  total_claims: number;
  pending_claims: number;
  upcoming_renewals: number;
  total_premium_paid: number;
}
