"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, Users, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { environmentEnum } from "@/lib/db/schema/resources";
import { familyMembers } from "@/lib/db/schema/families";

type Environment = typeof environmentEnum.enumValues[number] | "both";

interface RefinementPanelProps {
  environment: Environment;
  setEnvironment: (environment: Environment) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  familyMembers: typeof familyMembers.$inferSelect[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefinementPanel({
  environment,
  setEnvironment,
  selectedMembers,
  setSelectedMembers,
  familyMembers,
}: RefinementPanelProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const selectedMemberCount = selectedMembers.length;
  const totalMembers = familyMembers.length;

  return (
    <Card className="mb-6 border shadow-sm bg-card">
      <CardContent className="py-3 px-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Environment Selection */}
          <div className="flex items-center">
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger className="h-9 w-[120px] border bg-background">
                <Globe className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Participants Selection */}
          <div className="flex items-center">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border bg-background flex items-center gap-1"
                >
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {selectedMemberCount === totalMembers
                    ? "All members"
                    : selectedMemberCount > 0
                    ? `${selectedMemberCount} selected`
                    : "Select"}
                  <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="start">
                <ScrollArea className="h-[200px] p-4">
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id.toString())}
                          onCheckedChange={(checked) => {
                            const value = member.id.toString();
                            if (checked) {
                              setSelectedMembers([...selectedMembers, value]);
                            } else {
                              setSelectedMembers(selectedMembers.filter((id) => id !== value));
                            }
                          }}
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {member.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected Members Badges - only show on larger screens */}
          <div className="hidden md:flex flex-wrap gap-1 ml-1 max-w-[40%]">
            {familyMembers
              .filter((member) => selectedMembers.includes(member.id.toString()))
              .slice(0, 3) // Only show first 3 badges
              .map((member) => (
                <Badge key={member.id} variant="secondary" className="flex items-center gap-1 h-6">
                  {member.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMembers(
                        selectedMembers.filter((id) => id !== member.id.toString())
                      );
                    }}
                  />
                </Badge>
              ))}
            {selectedMemberCount > 3 && (
              <Badge variant="secondary" className="h-6">
                +{selectedMemberCount - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 