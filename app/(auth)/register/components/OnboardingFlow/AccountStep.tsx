"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOnboarding } from "../OnboardingContext";
import { toast } from "sonner";
import { useState } from "react";
import { completeRegistration } from "../../actions";
import { format } from "date-fns";

const accountSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountValues = z.infer<typeof accountSchema>;

export function AccountStep() {
  const { state, resetOnboarding } = useOnboarding();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: AccountValues) {
    if (!showSummary) {
      // First show the summary before final submission
      setShowSummary(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Use the server action to complete registration and onboarding
      const result = await completeRegistration({
        familyData: state.familyData,
        locationData: state.locationData,
        accountData: {
          email: data.email,
          password: data.password,
        },
      });
      
      if (!result.success) {
        throw new Error(result.error || "Failed to complete registration");
      }

      toast.success("Account created successfully!", {
        description: "Welcome to Kin•Do. Let's get started!",
      });

      // Reset onboarding state since we're done
      resetOnboarding();

      // Redirect to dashboard
      router.push("/activities");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Create Your Account</h2>
        <p className="text-sm text-muted-foreground">
          Last step! Set up your login credentials to get started.
        </p>
      </div>

      {showSummary ? (
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-md font-medium mb-2">Family Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Family Name</p>
                <p className="text-sm">{state.familyData.familyName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm font-medium">Primary Guardian</p>
                  <p className="text-sm">{state.familyData.primaryGuardian.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm capitalize">
                    {state.familyData.primaryGuardian.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              
              {state.familyData.additionalMembers && state.familyData.additionalMembers.length > 0 && (
                <div>
                  <p className="text-sm font-medium mt-2">Additional Family Members</p>
                  <ul className="text-sm list-disc pl-5 mt-1">
                    {state.familyData.additionalMembers.map((member, index) => (
                      <li key={index}>
                        {member.name} ({member.role}
                        {member.dateOfBirth ? `, ${format(new Date(member.dateOfBirth), 'MMMM d, yyyy')}` : ''})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="text-md font-medium mb-2">Account Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{form.getValues().email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm">••••••••</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowSummary(false)}
            >
              Back
            </Button>
            <Button 
              type="button" 
              className="flex-1" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Confirm & Create Account"}
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create a password"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
} 