'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';

// Define form validation schema
const familyMemberFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  role: z.enum(['primary_guardian', 'secondary_guardian', 'child']),
  dateOfBirth: z.date().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type FamilyMemberFormValues = z.infer<typeof familyMemberFormSchema>;

// Default values for the form
const defaultValues: Partial<FamilyMemberFormValues> = {
  name: '',
  role: 'child',
  dateOfBirth: undefined,
  bio: '',
  avatar: '',
};

interface FamilyMemberFormProps {
  initialData?: FamilyMemberFormValues;
  isEdit?: boolean;
  familyMemberId?: number;
  deleteButton?: React.ReactNode;
  onSuccess?: () => void;
}

export function FamilyMemberForm({ 
  initialData, 
  isEdit = false, 
  familyMemberId,
  deleteButton,
  onSuccess
}: FamilyMemberFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [dateInputValue, setDateInputValue] = useState<string>(
    initialData?.dateOfBirth ? format(initialData.dateOfBirth, 'yyyy-MM-dd') : ''
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [yearSelectOpen, setYearSelectOpen] = useState(false);
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  // Initialize form with react-hook-form
  const form = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(familyMemberFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Handle form submission
  async function onSubmit(values: FamilyMemberFormValues) {
    setIsPending(true);
    
    try {
      if (isEdit) {
        // Handle edit flow
        const response = await fetch(`/api/family/members/${familyMemberId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString().split('T')[0] : null
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save family member');
        }
        
        toast.success('Family member updated successfully');
        onSuccess?.();
        router.refresh();
      } else {
        // Handle create flow
        const response = await fetch('/api/family/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString().split('T')[0] : null
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create family member');
        }
        
        toast.success('Family member created successfully');
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save family member:', error);
      toast.error('Failed to save family member. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  // Handle direct date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Parse the date and update form if valid
    if (value) {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        form.setValue('dateOfBirth', parsedDate);
      }
    } else {
      form.setValue('dateOfBirth', undefined);
    }
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const currentDate = form.getValues('dateOfBirth') || new Date();
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    form.setValue('dateOfBirth', newDate);
    setDateInputValue(format(newDate, 'yyyy-MM-dd'));
    setYearSelectOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the family member.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="primary_guardian">Primary Guardian</SelectItem>
                  <SelectItem value="secondary_guardian">Secondary Guardian</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The role of this person in the family.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="date"
                    value={dateInputValue}
                    onChange={handleDateInputChange}
                    placeholder="YYYY-MM-DD"
                    className="w-full"
                  />
                </FormControl>
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
                            {field.value ? field.value.getFullYear() : new Date().getFullYear()}
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
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
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
              <FormDescription>
                The date of birth of this family member.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter details about this family member, such as interests, personality, etc." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Additional information about this family member.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between gap-4">
          {deleteButton}
          <div className="flex items-center gap-4 ml-auto">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
} 