'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FocusArea } from '@/lib/db/schema/focus-areas';
import { differenceInYears } from 'date-fns';

interface FamilyMember {
  id: number;
  name: string;
  role: string;
  dateOfBirth?: Date | null;
  bio?: string | null;
  avatar?: string | null;
  focusAreas?: FocusArea[];
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  onClick?: () => void;
}

export function FamilyMemberCard({ member, onClick }: FamilyMemberCardProps) {
  // Calculate age from date of birth
  const getAge = (dateOfBirth?: Date | null) => {
    if (!dateOfBirth) return null;
    const years = differenceInYears(new Date(), new Date(dateOfBirth));
    return `${years} ${years === 1 ? 'year' : 'years'} old`;
  };

  // Get the appropriate role display text
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'primary_guardian':
        return 'Primary Guardian';
      case 'secondary_guardian':
        return 'Secondary Guardian';
      case 'child':
        return 'Child';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const age = getAge(member.dateOfBirth);

  return (
    <Card 
      className="h-full transition-all hover:shadow-md cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar || ''} alt={member.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  {getRoleDisplay(member.role)}
                  {age !== null && (
                    <span className="ml-1">• {age}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {member.bio && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Bio</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 