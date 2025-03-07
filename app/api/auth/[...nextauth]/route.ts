import { handlers } from "@/lib/auth";

// Export the GET and POST handlers directly
export const { GET, POST } = handlers; 

// Explicitly set runtime to nodejs
export const runtime = 'nodejs'; 