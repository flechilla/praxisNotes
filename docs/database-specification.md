# PraxisNote Database Specification

## Overview

This document outlines the database architecture for the PraxisNote application, designed to store and manage data related to behavioral therapy sessions, client information, and user accounts.

## Database Provider

- **PostgreSQL** hosted via Supabase
- Production database will require automated backups and point-in-time recovery

## Data Models and Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('rbt', 'bcba', 'admin')),
  credentials VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Clients Table

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  guardian_name VARCHAR(200),
  guardian_relationship VARCHAR(50),
  guardian_phone VARCHAR(20),
  guardian_email VARCHAR(255),
  diagnosis TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Client Assignments Table

```sql
CREATE TABLE client_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary', 'supervisor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (client_id, user_id)
);
```

### Programs Table

```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  target_behavior VARCHAR(255),
  measurement_type VARCHAR(50) CHECK (measurement_type IN ('frequency', 'duration', 'intensity', 'latency', 'other')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Session Reports Table

```sql
CREATE TABLE session_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  rbt_id UUID NOT NULL REFERENCES users(id),
  bcba_id UUID REFERENCES users(id),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')),
  general_notes TEXT,
  bcba_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Behavior Logs Table

```sql
CREATE TABLE behavior_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_report_id UUID NOT NULL REFERENCES session_reports(id) ON DELETE CASCADE,
  behavior_name VARCHAR(255) NOT NULL,
  behavior_description TEXT,
  frequency INTEGER,
  duration INTEGER, -- In seconds
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  antecedent TEXT,
  consequence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Skill Acquisition Logs Table

```sql
CREATE TABLE skill_acquisition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_report_id UUID NOT NULL REFERENCES session_reports(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id),
  skill_name VARCHAR(255) NOT NULL,
  prompt_level VARCHAR(50) NOT NULL,
  response_type VARCHAR(50) NOT NULL,
  trials_total INTEGER NOT NULL,
  trials_successful INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Reinforcers Table

```sql
CREATE TABLE reinforcers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_report_id UUID NOT NULL REFERENCES session_reports(id) ON DELETE CASCADE,
  reinforcer_name VARCHAR(255) NOT NULL,
  reinforcer_type VARCHAR(50) NOT NULL,
  effectiveness VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes

```sql
-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Clients indexes
CREATE INDEX idx_clients_name ON clients(last_name, first_name);
CREATE INDEX idx_clients_dob ON clients(date_of_birth);

-- Session reports indexes
CREATE INDEX idx_session_reports_client ON session_reports(client_id);
CREATE INDEX idx_session_reports_rbt ON session_reports(rbt_id);
CREATE INDEX idx_session_reports_bcba ON session_reports(bcba_id);
CREATE INDEX idx_session_reports_date ON session_reports(session_date);
CREATE INDEX idx_session_reports_status ON session_reports(status);

-- Behavior logs indexes
CREATE INDEX idx_behavior_logs_session ON behavior_logs(session_report_id);
CREATE INDEX idx_behavior_logs_name ON behavior_logs(behavior_name);

-- Skill acquisition logs indexes
CREATE INDEX idx_skill_acquisition_logs_session ON skill_acquisition_logs(session_report_id);
CREATE INDEX idx_skill_acquisition_logs_program ON skill_acquisition_logs(program_id);
```

## Database Access Patterns

The application will access the database primarily through the Drizzle ORM, which provides a type-safe interface to the database. Common access patterns include:

1. **User Authentication**

   - Lookup by email for login
   - Create new user records during registration

2. **Client Management**

   - List clients assigned to a specific RBT or BCBA
   - Retrieve client details with associated programs

3. **Session Reporting**

   - Create new session reports with related behavior and skill logs
   - Update session reports as they move through the workflow
   - Retrieve session reports with all associated data

4. **Analytics Queries**
   - Aggregate data across sessions for progress tracking
   - Group behavior occurrences by time period
   - Calculate skill acquisition rates

## Data Relationships

The database schema implements the following relationships:

- One-to-many: Users to SessionReports
- Many-to-many: Clients to Users (through ClientAssignments)
- One-to-many: Client to Programs
- One-to-many: Programs to SkillAcquisitionLogs
- One-to-many: SessionReport to BehaviorLogs
- One-to-many: SessionReport to SkillAcquisitionLogs
- One-to-many: SessionReport to Reinforcers

## Data Validation

Data validation will occur at multiple levels:

1. **Database Level**

   - CHECK constraints for enumerated values
   - NOT NULL constraints for required fields
   - UNIQUE constraints to prevent duplicates
   - Foreign key constraints to maintain referential integrity

2. **API Level**

   - Zod schema validation on all inputs
   - Type checking through TypeScript

3. **UI Level**
   - Form validation using React Hook Form
   - Client-side validation with immediate feedback

## Sample Data

The application will include seed data for testing and development, including:

- Sample user accounts for each role
- Representative client profiles
- Example programs and behavior targets
- Sample session reports

## Data Migration Strategy

1. **Initial Setup**

   - Schema creation scripts
   - Seed data scripts

2. **Schema Changes**

   - Use Drizzle migrations for versioned schema changes
   - Apply migrations through CI/CD pipeline

3. **Data Backups**
   - Daily automated backups
   - Point-in-time recovery capability

## Security Considerations

- Personally Identifiable Information (PII) will be encrypted at rest
- Database access limited to application server IP addresses
- Row-level security policies where appropriate
- Regular security audits
