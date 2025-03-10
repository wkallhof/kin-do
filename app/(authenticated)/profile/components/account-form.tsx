"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const accountFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface AccountFormProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onAccountSubmit(data: AccountFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update account");
      }

      toast.success("Account updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password updated successfully. Please log in again.");
      await signOut();
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal information.
        </p>
        <Form {...accountForm}>
          <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="mt-4 space-y-4">
            <FormField
              control={accountForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Account"}
            </Button>
          </form>
        </Form>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password. You will need to log in again after changing your password.
        </p>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-4 space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 