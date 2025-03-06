// Project Structure
src/
  app/
    (auth)/               # Authentication routes (login, register, etc.)
      login/
        page.tsx
      register/
        page.tsx
        components/
          OnboardingFlow/
            FamilyProfileStep.tsx  # Name and family role collection
            ResourcesStep.tsx      # Indoor/outdoor resources setup
            AccountStep.tsx        # Final email/password collection
          OnboardingProgress.tsx   # Progress indicator
          OnboardingContext.tsx    # Local storage state management
    (authenticated)/      # Protected routes requiring authentication
      # Main App Routes
      dashboard/         # Today's Activities (default landing page)
        page.tsx
        loading.tsx      # Skeleton loader
        components/
          ActivityCard.tsx
          EnvironmentToggle.tsx    # Indoor/Outdoor toggle
          RefinementPanel.tsx
      favorites/         # Favorite Activities
        page.tsx
        components/
          FavoritesList.tsx
      family/            # My Family section
        page.tsx         # Family overview with all members
        [memberId]/      # Family member detail pages
          page.tsx
          focus-areas/   # Individual focus areas management
            page.tsx
        focus-areas/     # Family-level focus areas
          page.tsx
        components/
          FamilyMemberCard.tsx
          FocusAreaList.tsx
          FamilyMemberForm.tsx
      things/            # My Things (resource management)
        page.tsx
        components/
          ResourceEditor.tsx
          ResourceCategoryList.tsx
      profile/           # My Profile
        page.tsx
        settings/
          page.tsx
        components/
          AccountSettings.tsx
    api/                 # API routes
      trpc/             # tRPC router definitions
      auth/             # Auth.js API routes
    layout.tsx
    page.tsx
  components/           # Shared components
    ui/                 # ShadcN components
    layout/            # Layout components
      MainNav.tsx      # Main navigation
      SideNav.tsx      # Side navigation
    animations/        # Lottie animations
  lib/                 # Shared utilities
    db/               # Database configuration
      schema/         # Drizzle schema
      migrations/     # Database migrations
    auth/            # Auth.js configuration
    utils/           # Utility functions
  styles/             # Global styles
  types/              # TypeScript types
  tests/              # Playwright tests
    e2e/             # End-to-end tests
    integration/     # Integration tests

// Local Storage Schema
interface OnboardingState {
  step: 'family' | 'resources' | 'account';
  familyData: {
    primaryGuardian: {
      name: string;
      role: 'primary_guardian' | 'secondary_guardian';
    };
    additionalMembers?: Array<{
      name: string;
      role: string;
      ageGroup?: string;
    }>;
  };
  resourceData: {
    indoor: Record<string, boolean>; // e.g. {'legos': true, 'art_supplies': true}
    outdoor: Record<string, boolean>; // e.g. {'playground': true, 'sandbox': true}
  };
}

// Database Schema (Drizzle ORM)
import { pgTable, serial, text, timestamp, boolean, integer, json, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User Management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  userId: integer('user_id').references(() => users.id), // null for non-user family members (e.g. children)
  name: text('name').notNull(),
  role: text('role').notNull(), // 'primary_guardian', 'secondary_guardian', 'child'
  dateOfBirth: date('date_of_birth'), // Date of birth for age calculation
  bio: text('bio'), // Description, interests, etc.
  avatar: text('avatar'), // URL to avatar image
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Activity Management
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  duration: integer('duration'), // in minutes
  ageMin: integer('age_min'),
  ageMax: integer('age_max'),
  physicalLevel: integer('physical_level'),
  educationalValue: integer('educational_value'),
  supervisionLevel: text('supervision_level'),
  weatherRequirements: json('weather_requirements'),
  requiredResources: json('required_resources'),
  environment: text('environment').notNull(), // 'indoor', 'outdoor', 'both'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Daily Generated Activities (temporary)
export const dailyActivities = pgTable('daily_activities', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  activityData: json('activity_data'), // LLM generated activity data
  environment: text('environment').notNull(), // 'indoor', 'outdoor', 'both'
  date: timestamp('date').defaultNow(),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // actual time spent
  participatingMembers: json('participating_members'), // array of family member IDs
});

// Favorite Activities
export const favoriteActivities = pgTable('favorite_activities', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  activityData: json('activity_data'),
  environment: text('environment').notNull(), // 'indoor', 'outdoor', 'both'
  createdAt: timestamp('created_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
  useCount: integer('use_count').default(0),
});

// Activity Preferences
export const activityPreferences = pgTable('activity_preferences', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  activityType: text('activity_type'),
  preference: text('preference'), // 'more', 'less', 'never'
  createdAt: timestamp('created_at').defaultNow(),
});

// Resource Management
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'toy', 'art_supply', 'sports_equipment', etc.
  environment: text('environment').notNull(), // 'indoor', 'outdoor'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Focus Area Management
export const focusAreas = pgTable('focus_areas', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  familyMemberId: integer('family_member_id').references(() => familyMembers.id), // null for family-wide focus areas
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'physical', 'educational', 'creative', 'social', 'life_skills'
  isActive: boolean('is_active').default(true),
  priority: integer('priority').default(1), // 1-5, higher means more weight in activity generation
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many, one }) => ({
  familyMember: one(familyMembers, {
    fields: [users.id],
    references: [familyMembers.userId],
  }),
  activityFeedback: many(activityFeedback),
}));

export const familyMemberRelations = relations(familyMembers, ({ many, one }) => ({
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
  focusAreas: many(focusAreas),
}));

export const familyRelations = relations(families, ({ many }) => ({
  members: many(familyMembers),
  resources: many(resources),
  focusAreas: many(focusAreas),
  dailyActivities: many(dailyActivities),
  favoriteActivities: many(favoriteActivities),
}));

export const focusAreaRelations = relations(focusAreas, ({ one }) => ({
  family: one(families, {
    fields: [focusAreas.familyId],
    references: [families.id],
  }),
  familyMember: one(familyMembers, {
    fields: [focusAreas.familyMemberId],
    references: [familyMembers.id],
  }),
}));

// Docker Compose for Local Development
version: '3.8'
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: kindo
      POSTGRES_PASSWORD: kindo_local
      POSTGRES_DB: kindo_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

// Environment Variables (.env.local)
DATABASE_URL="postgresql://kindo:kindo_local@localhost:5432/kindo_dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

// Animation Utilities (animations.ts)
import lottie from 'lottie-web';

export const playAnimation = (container: HTMLElement, animationData: any) => {
  const anim = lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData,
  });

  return anim;
};

// Playwright Test Example
import { test, expect } from '@playwright/test';

test('user can create a new family activity', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  // ... authentication steps
  await page.getByRole('button', { name: 'New Activity' }).click();
  await page.getByLabel('Title').fill('Family Game Night');
  await page.getByLabel('Description').fill('Weekly board game night');
  await page.getByRole('button', { name: 'Create' }).click();
  
  await expect(page.getByText('Activity created successfully')).toBeVisible();
});

// Playwright Test Specifications
import { test, expect } from '@playwright/test';

// Onboarding Flow Tests
test.describe('Onboarding Flow', () => {
  test('user can complete onboarding process', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Family Profile Step
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByRole('radio', { name: 'Primary Guardian' }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Resources Step
    await expect(page.getByText('Indoor Resources')).toBeVisible();
    await page.getByLabel('Toys').check();
    await page.getByLabel('Art Supplies').check();
    await expect(page.getByText('Outdoor Resources')).toBeVisible();
    await page.getByLabel('Playground').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Account Step
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password').fill('securepassword');
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Verify Redirect to Dashboard
    await expect(page).toHaveURL('/activities');
  });

  test('user can switch to login from onboarding', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'I Already Have an Account' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('onboarding data persists across page refreshes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    await page.getByLabel('Your Name').fill('John Doe');
    await page.reload();
    
    await expect(page.getByLabel('Your Name')).toHaveValue('John Doe');
  });
});