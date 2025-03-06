"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyMemberForm } from './FamilyMemberForm';
import { FocusAreaList } from './FocusAreaList';
import { FocusArea } from '@/lib/db/schema/focus-areas';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface FamilyMemberDetailDialogProps {
  member?: {
    id: number;
    name: string;
    role: string;
    dateOfBirth: Date | null;
    bio: string | null;
    avatar: string | null;
    userId: number | null;
    familyId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    focusAreas: FocusArea[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FamilyMemberDetailDialog({
  member,
  open,
  onOpenChange,
}: FamilyMemberDetailDialogProps) {
  const router = useRouter();
  const isEdit = !!member;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/family/members/${member!.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete family member');
      }

      toast.success('Family member deleted successfully');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast.error('Failed to delete family member');
    }
  };

  const DeleteButton = isEdit ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {member.name} from your family. This action cannot be undone.
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
        className="h-[90vh] rounded-t-[10px] border-t-0 max-w-4xl mx-auto pt-8"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {isEdit ? `Edit ${member.name}` : 'Add Family Member'}
          </SheetTitle>
          <SheetDescription>
            {isEdit 
              ? `Update ${member.name}'s details and focus areas`
              : 'Add a new member to your family'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-6">
          {isEdit ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="focus-areas">Focus Areas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Suspense fallback={<div>Loading...</div>}>
                  <FamilyMemberForm 
                    familyMemberId={member.id}
                    initialData={{
                      name: member.name,
                      role: member.role as 'primary_guardian' | 'secondary_guardian' | 'child',
                      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
                      bio: member.bio || '',
                      avatar: member.avatar || '',
                    }}
                    isEdit
                    deleteButton={DeleteButton}
                  />
                </Suspense>
              </TabsContent>
              
              <TabsContent value="focus-areas">
                <Suspense fallback={<div>Loading focus areas...</div>}>
                    <FocusAreaList 
                    familyId={member.familyId!}
                    memberId={member.id}
                    focusAreas={member.focusAreas}
                    vertical={true}
                    />
                </Suspense>
              </TabsContent>
            </Tabs>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <FamilyMemberForm />
            </Suspense>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
} 