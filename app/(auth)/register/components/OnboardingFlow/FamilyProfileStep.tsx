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
import { useState } from "react";
import { PlusCircle, X, CalendarIcon, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, isValid } from "date-fns";

const familyProfileSchema = z.object({
  familyName: z.string().min(2, "Family name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["primary_guardian", "secondary_guardian"]),
});

type FamilyProfileValues = z.infer<typeof familyProfileSchema>;

interface FamilyMember {
  name: string;
  role: string;
  dateOfBirth?: Date;
}

export function FamilyProfileStep() {
  const { state, updateFamilyData, setStep } = useOnboarding();
  const [additionalMembers, setAdditionalMembers] = useState<FamilyMember[]>(
    state.familyData.additionalMembers || []
  );
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("child");
  const [newMemberDateOfBirth, setNewMemberDateOfBirth] = useState<Date | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [yearSelectOpen, setYearSelectOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const form = useForm<FamilyProfileValues>({
    resolver: zodResolver(familyProfileSchema),
    defaultValues: {
      familyName: state.familyData.familyName,
      name: state.familyData.primaryGuardian.name,
      role: state.familyData.primaryGuardian.role,
    },
  });

  function addFamilyMember() {
    if (newMemberName.trim() === "") return;

    setAdditionalMembers([
      ...additionalMembers,
      {
        name: newMemberName,
        role: newMemberRole,
        dateOfBirth: newMemberDateOfBirth,
      },
    ]);

    // Reset form fields
    setNewMemberName("");
    setNewMemberRole("child");
    setNewMemberDateOfBirth(undefined);
    setDateInputValue("");
  }

  function removeFamilyMember(index: number) {
    const updatedMembers = [...additionalMembers];
    updatedMembers.splice(index, 1);
    setAdditionalMembers(updatedMembers);
  }

  function onSubmit(data: FamilyProfileValues) {
    updateFamilyData({
      familyName: data.familyName,
      primaryGuardian: {
        name: data.name,
        role: data.role,
      },
      additionalMembers,
    });
    setStep("location");
  }

  // Handle direct date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Parse the date and update if valid
    if (value) {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        setNewMemberDateOfBirth(parsedDate);
      }
    } else {
      setNewMemberDateOfBirth(undefined);
    }
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const currentDate = newMemberDateOfBirth || new Date();
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setNewMemberDateOfBirth(newDate);
    setDateInputValue(format(newDate, 'yyyy-MM-dd'));
    setYearSelectOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tell us about your family</h2>
        <p className="text-sm text-muted-foreground">
          This information helps us personalize activities for your family.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="familyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your family name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 border-t">
            <h3 className="text-md font-medium mb-4">Primary Guardian</h3>
          </div>

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

          <div className="space-y-4">
            <div className="pt-4 border-t">
              <h3 className="text-md font-medium">Family Members</h3>
              <p className="text-sm text-muted-foreground">
                Add other members of your family
              </p>
            </div>

            {additionalMembers.length > 0 && (
              <div className="space-y-2">
                {additionalMembers.map((member, index) => (
                  <Card key={index} className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => removeFamilyMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm">{member.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Role</p>
                          <p className="text-sm capitalize">{member.role.replace('_', ' ')}</p>
                        </div>
                        {member.dateOfBirth && (
                          <div>
                            <p className="text-sm font-medium">Date of Birth</p>
                            <p className="text-sm">{format(member.dateOfBirth, 'MMMM d, yyyy')}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Role</FormLabel>
                <Select
                  value={newMemberRole}
                  onValueChange={setNewMemberRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="secondary_guardian">Secondary Guardian</SelectItem>
                    <SelectItem value="other_relative">Other Relative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <FormLabel>Date of Birth</FormLabel>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateInputValue}
                    onChange={handleDateInputChange}
                    placeholder="YYYY-MM-DD"
                    className="w-full"
                  />
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="px-2"
                        onClick={() => setCalendarOpen(true)}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="flex justify-between items-center p-2 border-b">
                        <div className="text-sm font-medium">Select Date</div>
                        <Popover open={yearSelectOpen} onOpenChange={setYearSelectOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1"
                            >
                              {newMemberDateOfBirth ? newMemberDateOfBirth.getFullYear() : new Date().getFullYear()}
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="h-[200px] overflow-y-auto p-1">
                              {years.map((year) => (
                                <Button
                                  key={year}
                                  variant="ghost"
                                  className="w-full justify-start text-left font-normal"
                                  onClick={() => handleYearSelect(year)}
                                >
                                  {year}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Calendar
                        mode="single"
                        selected={newMemberDateOfBirth}
                        onSelect={(date) => {
                          setNewMemberDateOfBirth(date);
                          if (date) {
                            setDateInputValue(format(date, 'yyyy-MM-dd'));
                          }
                          setCalendarOpen(false);
                        }}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addFamilyMember}
              disabled={!newMemberName.trim()}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
} 