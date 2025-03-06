"use client";

import { FamilyMemberCard } from './FamilyMemberCard';
import { FamilyMemberDetailDialog } from './FamilyMemberDetailDialog';
import { FocusArea } from '@/lib/db/schema/focus-areas';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

// Define the type for the component props
interface FamilyMemberListProps {
  members: {
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
  }[];
}

export function FamilyMemberList({ members }: FamilyMemberListProps) {
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMemberClick = (member: typeof members[0]) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleAddMemberClick = () => {
    setSelectedMember(undefined);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <FamilyMemberCard 
            key={member.id}
            member={member}
            onClick={() => handleMemberClick(member)}
          />
        ))}
        <div onClick={handleAddMemberClick}>
          <Card className="h-full border-2 border-dashed hover:border-primary hover:bg-accent transition-colors cursor-pointer flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-primary">
              <PlusCircle className="h-8 w-8 mb-2" />
              <span className="font-medium">Add Member</span>
            </div>
          </Card>
        </div>
      </div>

      <FamilyMemberDetailDialog
        member={selectedMember}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
} 