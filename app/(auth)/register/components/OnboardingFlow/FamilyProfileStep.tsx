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
import { useState, useEffect } from "react";
import { PlusCircle, X, CalendarIcon, ChevronDown, UserPlus } from "lucide-react";
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
import { findFamilyByInviteCode } from "../../actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const familyProfileSchema = z.object({
  familyName: z.string().min(2, "Family name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["primary_guardian", "secondary_guardian"]),
});

type FamilyProfileValues = z.infer<typeof familyProfileSchema>;

const inviteCodeSchema = z.object({
  inviteCode: z.string().length(6, "Invite code must be 6 characters"),
});

type InviteCodeValues = z.infer<typeof inviteCodeSchema>;

const joinFamilySchema = z.object({
  memberOption: z.string({ required_error: "Please select an option" }),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["primary_guardian", "secondary_guardian", "other_relative"]).optional(),
});

type JoinFamilyValues = z.infer<typeof joinFamilySchema>;

interface FamilyMember {
  name: string;
  role: string;
  dateOfBirth?: Date;
  id?: number;
}

export function FamilyProfileStep() {
  const { state, updateFamilyData, setStep, setJoiningExistingFamily } = useOnboarding();
  const [additionalMembers, setAdditionalMembers] = useState<FamilyMember[]>(
    state.familyData.additionalMembers || []
  );
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("child");
  const [newMemberDateOfBirth, setNewMemberDateOfBirth] = useState<Date | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [yearSelectOpen, setYearSelectOpen] = useState(false);
  const [isCheckingInviteCode, setIsCheckingInviteCode] = useState(false);
  const [inviteCodeError, setInviteCodeError] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [familyInviteData, setFamilyInviteData] = useState<{
    familyName: string;
    familyId: number;
    eligibleMembers: FamilyMember[];
  } | null>(null);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [newMemberFormVisible, setNewMemberFormVisible] = useState(false);
  
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

  const inviteCodeForm = useForm<InviteCodeValues>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const joinFamilyForm = useForm<JoinFamilyValues>({
    resolver: zodResolver(joinFamilySchema),
    defaultValues: {
      memberOption: "",
      name: "",
      role: "primary_guardian",
    },
  });

  // Reset forms when switching tabs
  useEffect(() => {
    if (activeTab === 'create') {
      inviteCodeForm.reset();
      setInviteCodeError("");
      setShowJoinOptions(false);
    } else if (activeTab === 'join') {
      resetNewMemberForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
    resetNewMemberForm();
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
    setJoiningExistingFamily(false);
    setStep("location");
  }

  function resetNewMemberForm() {
    setNewMemberName("");
    setNewMemberRole("child");
    setNewMemberDateOfBirth(undefined);
    setDateInputValue("");
  }

  async function onInviteCodeSubmit(data: InviteCodeValues) {
    setIsCheckingInviteCode(true);
    setInviteCodeError("");
    setShowJoinOptions(false);
    
    try {
      const result = await findFamilyByInviteCode(data.inviteCode.toUpperCase());
      
      if (result.success && result.family) {
        // Store the invite code and family information
        updateFamilyData({
          familyName: result.family.name,
          inviteCode: data.inviteCode.toUpperCase(),
        });
        
        setJoiningExistingFamily(true);
        
        // Convert the dateOfBirth strings to Date objects
        const eligibleMembers = result.eligibleMembers?.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined
        })) || [];
        
        // Set the family data for the join options
        setFamilyInviteData({
          familyName: result.family.name,
          familyId: result.family.id,
          eligibleMembers
        });
        
        // Reset join family form
        joinFamilyForm.reset({
          memberOption: "",
          name: "",
          role: "primary_guardian"
        });
        
        // Reset new member form
        resetNewMemberForm();
        setNewMemberFormVisible(false);
        
        // Show the join options if we have a valid family
        setShowJoinOptions(true);
      } else {
        setInviteCodeError(result.error || "Invalid invite code");
      }
    } catch (error) {
      setInviteCodeError("Error checking invite code");
      console.error(error);
    } finally {
      setIsCheckingInviteCode(false);
    }
  }

  function onJoinFamilySubmit(data: JoinFamilyValues) {
    if (!familyInviteData) return;

    let memberData: {
      id?: number;
      name: string;
      role: string;
      dateOfBirth?: Date;
    };

    if (data.memberOption === "new") {
      // User is adding themselves as a new member
      if (!data.name || !data.role) {
        return;
      }

      memberData = {
        name: data.name,
        role: data.role,
        dateOfBirth: newMemberDateOfBirth,
      };
    } else {
      // User selected an existing member
      const existingMember = familyInviteData.eligibleMembers.find(
        member => member.id === parseInt(data.memberOption)
      );
      
      if (!existingMember) {
        return;
      }
      
      memberData = {
        id: existingMember.id,
        name: existingMember.name,
        role: existingMember.role,
        dateOfBirth: existingMember.dateOfBirth,
      };
    }

    // Update the onboarding context with the selected member info
    updateFamilyData({
      primaryGuardian: {
        name: memberData.name,
        role: memberData.role as "primary_guardian" | "secondary_guardian",
        dateOfBirth: memberData.dateOfBirth,
      },
      familyMemberId: memberData.id, // Store the ID if selecting an existing member
      additionalMembers: [],
    });

    // Proceed to account creation
    setStep("account");
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

  const handleMemberOptionChange = (value: string) => {
    joinFamilyForm.setValue("memberOption", value);
    
    if (value === "new") {
      setNewMemberFormVisible(true);
      // Clear existing values when switching to "new"
      joinFamilyForm.setValue("name", "");
      setNewMemberDateOfBirth(undefined);
      setDateInputValue("");
    } else {
      setNewMemberFormVisible(false);
      
      // If selecting an existing member, pre-fill the form with their data
      const selectedMember = familyInviteData?.eligibleMembers.find(
        member => member.id === parseInt(value)
      );
      
      if (selectedMember) {
        // Update the primary guardian data directly
        updateFamilyData({
          primaryGuardian: {
            name: selectedMember.name,
            role: selectedMember.role as "primary_guardian" | "secondary_guardian",
            dateOfBirth: selectedMember.dateOfBirth,
          },
          familyMemberId: selectedMember.id
        });
      }
    }
  };

  // Update the tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value as "create" | "join");
    
    // Reset relevant forms and state
    if (value === 'create') {
      inviteCodeForm.reset();
      joinFamilyForm.reset();
      setInviteCodeError("");
      setShowJoinOptions(false);
    } else if (value === 'join') {
      form.reset({
        familyName: state.familyData.familyName,
        name: state.familyData.primaryGuardian.name,
        role: state.familyData.primaryGuardian.role,
      });
      resetNewMemberForm();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Family Setup</h2>
        <p className="text-sm text-muted-foreground">
          Create a new family or join an existing one with an invite code.
        </p>
      </div>

      <Tabs
        defaultValue="create"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Family</TabsTrigger>
          <TabsTrigger value="join">Join Existing Family</TabsTrigger>
        </TabsList>
        
        <TabsContent value="join" className="space-y-4 mt-4">
          <div>
            <p className="text-sm mb-4">
              If someone has invited you to join their family, enter the 6-character invite code below.
            </p>
            
            <Form {...inviteCodeForm}>
              <form onSubmit={inviteCodeForm.handleSubmit(onInviteCodeSubmit)} className="space-y-4">
                <FormField
                  control={inviteCodeForm.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 6-character code" 
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value ? field.value.toUpperCase() : ''}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {inviteCodeError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{inviteCodeError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCheckingInviteCode || !inviteCodeForm.formState.isValid}
                >
                  {isCheckingInviteCode ? "Checking..." : "Check Invite Code"}
                </Button>
              </form>
            </Form>
          </div>

          {showJoinOptions && familyInviteData && (
            <div className="mt-6 space-y-6">
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-1">
                  Join {familyInviteData.familyName} Family
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please select yourself from the list or add yourself as a new family member.
                </p>

                <Form {...joinFamilyForm}>
                  <form onSubmit={joinFamilyForm.handleSubmit(onJoinFamilySubmit)} className="space-y-6">
                    <FormField
                      control={joinFamilyForm.control}
                      name="memberOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Yourself</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleMemberOptionChange(value);
                              }}
                              className="space-y-3"
                            >
                              {familyInviteData.eligibleMembers.length > 0 ? (
                                <>
                                  {familyInviteData.eligibleMembers.map((member) => (
                                    <FormItem
                                      key={member.id}
                                      className="flex items-start space-x-3 space-y-0 border p-3 rounded-md"
                                    >
                                      <FormControl>
                                        <RadioGroupItem value={String(member.id)} />
                                      </FormControl>
                                      <div className="space-y-1">
                                        <FormLabel className="font-medium">
                                          {member.name}
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground capitalize">
                                          {member.role.replace('_', ' ')}
                                          {member.dateOfBirth && 
                                            ` • ${format(new Date(member.dateOfBirth), 'MMM d, yyyy')}`}
                                        </p>
                                      </div>
                                    </FormItem>
                                  ))}
                                </>
                              ) : (
                                <p className="text-sm text-muted-foreground italic mb-2">
                                  No eligible family members found. You can add yourself below.
                                </p>
                              )}

                              <FormItem
                                className="flex items-start space-x-3 space-y-0 border p-3 rounded-md"
                              >
                                <FormControl>
                                  <RadioGroupItem value="new" />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-medium flex items-center gap-1">
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Add myself as a new member
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    I&apos;m not in the list above
                                  </p>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {newMemberFormVisible && (
                      <div className="space-y-4 border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium">Your Information</h4>
                        
                        <FormField
                          control={joinFamilyForm.control}
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
                          control={joinFamilyForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Role</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="primary_guardian">Primary Guardian</SelectItem>
                                  <SelectItem value="secondary_guardian">Secondary Guardian</SelectItem>
                                  <SelectItem value="other_relative">Other Relative</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormItem className="space-y-2">
                          <FormLabel>Date of Birth (Optional)</FormLabel>
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
                                    } else {
                                      setDateInputValue("");
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
                        </FormItem>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={
                        !joinFamilyForm.formState.isValid || 
                        (newMemberFormVisible && (!joinFamilyForm.getValues().name || !joinFamilyForm.getValues().role))
                      }
                    >
                      Continue
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4 mt-4">
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
                              } else {
                                setDateInputValue("");
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 