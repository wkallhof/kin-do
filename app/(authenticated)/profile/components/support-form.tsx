"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const supportFormSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  category: z.string({
    required_error: "Please select a category",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

interface SupportFormProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function SupportForm({ user }: SupportFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: "",
      category: "",
      message: "",
    },
  });

  async function onSubmit() {
    setIsLoading(true);

    try {
      // This would be an API call in a real application
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Your support request has been submitted. We'll get back to you shortly.");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit support request. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 rounded-lg bg-muted p-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">Your Contact Information</p>
          <p className="text-sm text-muted-foreground">
            Name: {user.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Email: {user.email}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of your issue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="billing">Billing & Subscription</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category that best describes your issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your issue in detail"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please provide as much detail as possible to help us assist you better
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Support Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 