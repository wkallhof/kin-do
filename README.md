# Kin•Do - AI-Powered Family Activity Planner

Kin•Do is an AI-powered daily activity planner for families that generates personalized activities based on your family's preferences, available resources, and individual focus areas. Think of it as FitBod for family activities - personalized, contextual, and always fresh.

## Features

- 🎯 **Daily Personalized Activities**: AI-generated activities tailored to your family's needs
- 🏠 **Indoor/Outdoor Context**: Smart activity suggestions based on weather and available resources
- 👨‍👩‍👧‍👦 **Family Management**: Individual profiles and focus areas for each family member
- 📝 **Focus Areas**: Track and develop specific skills or interests for each family member
- 🎨 **Resource Management**: Organize your indoor and outdoor activity resources
- ⭐ **Favorites Library**: Save and organize your favorite activities
- 🌦️ **Weather Integration**: Smart outdoor activity suggestions based on weather
- 📱 **Mobile-First Design**: Optimized for use on any device

## Tech Stack

- **Framework**: [Next.js 15.1](https://nextjs.org/) with App Router and React 19
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **UI Components**: 
  - Shadcn UI (latest)
  - Radix UI Primitives
  - Tailwind CSS
- **AI Integration**: OpenAI API
- **State Management**: React Hooks + Server Components
- **Form Handling**: React Hook Form + Zod
- **Testing**: Playwright
- **Development**: 
  - Docker for local development
  - Turbopack for fast refresh
  - ESLint for code quality

## Getting Started

### Prerequisites

- Node.js 20.x or later
- Docker and Docker Compose
- PostgreSQL (via Docker or local installation)

### Environment Setup

1. Clone the repository
2. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Update the following variables in `.env.local`:
   ```
   DATABASE_URL="postgresql://kindo:kindo_local@localhost:5432/kindo_dev"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   ```

### Development

1. Start the database:
   ```bash
   npm run docker:up
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Playwright tests
- `npm run test:ui` - Run Playwright tests with UI
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push migrations to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run dev:docker` - Start both Docker and development server

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Authentication routes
│   ├── (authenticated)/    # Protected routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/               # Shadcn components
│   └── layout/          # Layout components
├── lib/
│   ├── db/              # Database configuration
│   ├── auth/           # Auth.js configuration
│   └── utils/          # Utility functions
└── tests/              # Playwright tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
