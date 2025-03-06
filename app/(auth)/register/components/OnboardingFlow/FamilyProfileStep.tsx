"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useOnboarding } from "../OnboardingContext";

const familyProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["primary_guardian", "secondary_guardian"]),
});

type FamilyProfileValues = z.infer<typeof familyProfileSchema>;

export function FamilyProfileStep() {
  const { state, updateFamilyData, setStep } = useOnboarding();

  const form = useForm<FamilyProfileValues>({
    resolver: zodResolver(familyProfileSchema),
    defaultValues: {
      name: state.familyData.primaryGuardian.name,
      role: state.familyData.primaryGuardian.role,
    },
  });

  function onSubmit(data: FamilyProfileValues) {
    updateFamilyData({
      primaryGuardian: {
        name: data.name,
        role: data.role,
      },
    });
    setStep("location");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tell us about yourself</h2>
        <p className="text-sm text-muted-foreground">
          This information helps us personalize activities for your family.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="primary_guardian" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Primary Guardian
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="secondary_guardian" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Secondary Guardian
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
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
    </div>
  );
} 