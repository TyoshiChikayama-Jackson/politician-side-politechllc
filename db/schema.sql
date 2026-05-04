-- PoliTech Politician Portal Database Schema
-- Multi-tenant platform for campaign management, compliance, and constituent services.

CREATE TABLE tenants (
  tenant_id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  campaign_name VARCHAR(255) NOT NULL,
  jurisdiction_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE jurisdictions (
  jurisdiction_id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  state_code VARCHAR(10),
  federal_limit NUMERIC(12,2) NOT NULL,
  state_limit NUMERIC(12,2) NOT NULL,
  filing_deadline DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  email VARCHAR(320) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaign_profiles (
  profile_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  office_sought VARCHAR(128) NOT NULL,
  district VARCHAR(128),
  election_year SMALLINT NOT NULL,
  type VARCHAR(64) NOT NULL,
  budget_goal NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE donors (
  donor_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(40),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(128),
  state VARCHAR(64),
  postal_code VARCHAR(32),
  employer VARCHAR(255),
  occupation VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE donations (
  donation_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  donor_id UUID REFERENCES donors(donor_id) ON DELETE SET NULL,
  jurisdiction_type VARCHAR(32) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  contribution_type VARCHAR(64) NOT NULL,
  source_channel VARCHAR(128) NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  employer VARCHAR(255),
  occupation VARCHAR(255),
  address_line1 VARCHAR(255),
  city VARCHAR(128),
  state VARCHAR(64),
  postal_code VARCHAR(32),
  compliance_status VARCHAR(64) NOT NULL DEFAULT 'Pending',
  violation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE expenditures (
  expenditure_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  category VARCHAR(128) NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
  memo TEXT,
  receipt_url VARCHAR(1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE casework_tickets (
  ticket_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  district VARCHAR(128),
  submitted_by VARCHAR(255),
  status VARCHAR(64) NOT NULL DEFAULT 'Open',
  priority VARCHAR(32) NOT NULL DEFAULT 'Normal',
  assigned_to UUID REFERENCES users(user_id),
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE voter_profiles (
  voter_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(40),
  zipcode VARCHAR(16),
  precinct VARCHAR(64),
  engagement_status VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE voter_tags (
  tag_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  voter_id UUID REFERENCES voter_profiles(voter_id) ON DELETE CASCADE,
  label VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE volunteer_shifts (
  shift_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  shift_type VARCHAR(64) NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity SMALLINT DEFAULT 1,
  location VARCHAR(255)
);

CREATE TABLE volunteer_signups (
  signup_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  shift_id UUID REFERENCES volunteer_shifts(shift_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  sign_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE communication_segments (
  segment_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  criteria JSONB NOT NULL,
  channel VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transparency_posts (
  post_id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  tags VARCHAR(255),
  content JSONB
);
