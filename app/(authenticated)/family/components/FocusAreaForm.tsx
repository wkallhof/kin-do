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
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

// Define form validation schema
const focusAreaFormSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  description: z.string().optional(),
  category: z.enum(['physical', 'educational', 'creative', 'social', 'life_skills']),
  priority: z.number().min(1).max(5).default(1),
});

type FocusAreaFormValues = z.infer<typeof focusAreaFormSchema>;

// Default values for the form
const defaultValues: Partial<FocusAreaFormValues> = {
  title: '',
  description: '',
  category: 'physical',
  priority: 1,
};

interface FocusAreaFormProps {
  initialData?: FocusAreaFormValues;
  isEdit?: boolean;
  focusAreaId?: number;
  familyId?: number;
  familyMemberId?: number;
  deleteButton?: React.ReactNode;
  onSuccess?: () => void;
}

export function FocusAreaForm({ 
  initialData, 
  isEdit = false, 
  focusAreaId,
  familyId,
  familyMemberId,
  deleteButton,
  onSuccess
}: FocusAreaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<FocusAreaFormValues>({
    resolver: zodResolver(focusAreaFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Handle form submission
  async function onSubmit(values: FocusAreaFormValues) {
    setIsSubmitting(true);
    
    try {
      if (isEdit) {
        // Handle edit flow
        const response = await fetch(`/api/family/focus-areas/${focusAreaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save focus area');
        }
        
        toast.success('Focus area updated successfully');
        onSuccess?.();
        router.refresh();
      } else {
        // Handle create flow
        const response = await fetch('/api/family/focus-areas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            familyId,
            familyMemberId,
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create focus area');
        }
        
        toast.success('Focus area created successfully');
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save focus area:', error);
      toast.error('Failed to save focus area. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the focus area.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief description"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Additional details about this focus area.
                  </FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="life_skills">Life Skills</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of skills or activities this focus area targets.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                      <SelectItem value="4">Very High</SelectItem>
                      <SelectItem value="5">Highest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How important this focus area is for activities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between gap-4">
              {deleteButton}
              <div className="flex items-center gap-4 ml-auto">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 