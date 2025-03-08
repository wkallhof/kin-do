'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Suspense } from 'react';
import { FocusAreaForm } from './FocusAreaForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FocusAreaDetailDialogProps {
  area?: {
    id: number;
    title: string;
    description: string | null;
    category: 'physical' | 'educational' | 'creative' | 'social' | 'life_skills';
    priority: number | null;
    familyId: number | null;
    familyMemberId: number | null;
  };
  familyId?: number;
  familyMemberId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FocusAreaDetailDialog({
  area,
  familyId,
  familyMemberId,
  open,
  onOpenChange,
}: FocusAreaDetailDialogProps) {
  const router = useRouter();
  const isEdit = !!area;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/family/focus-areas/${area!.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete focus area');
      }

      toast.success('Focus area deleted successfully');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting focus area:', error);
      toast.error('Failed to delete focus area');
    }
  };

  const DeleteButton = isEdit ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the focus area &ldquo;{area.title}&rdquo;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[10px] border-t-0 max-w-4xl mx-auto pt-6 flex flex-col overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {isEdit ? `Edit Focus Area` : 'Add Focus Area'}
          </SheetTitle>
          <SheetDescription>
            {isEdit 
              ? `Update Focus Area details`
              : familyMemberId 
                ? 'Add a new focus area specific to this family member'
                : 'Add a new focus area that applies to the entire family'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-4 h-[calc(90vh-100px)] overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <FocusAreaForm 
              focusAreaId={area?.id}
              familyId={familyId}
              familyMemberId={familyMemberId}
              initialData={area ? {
                title: area.title,
                description: area.description || '',
                category: area.category,
                priority: area.priority === null ? 1 : area.priority,
              } : undefined}
              isEdit={isEdit}
              deleteButton={DeleteButton}
              onSuccess={() => onOpenChange(false)}
            />
          </Suspense>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
} 