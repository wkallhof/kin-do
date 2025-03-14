"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Globe, Home, Trees } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { environmentEnum } from "@/lib/db/schema/resources";
import { familyMembers } from "@/lib/db/schema/families";
import { ScrollDrawer } from "@/components/scroll-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Environment = typeof environmentEnum.enumValues[number] | "both";

interface RefinementPanelProps {
  environment: Environment;
  setEnvironment: (environment: Environment) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  familyMembers: typeof familyMembers.$inferSelect[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function RefinementPanel({
  environment,
  setEnvironment,
  selectedMembers,
  setSelectedMembers,
  familyMembers,
}: RefinementPanelProps) {
  const [environmentDrawerOpen, setEnvironmentDrawerOpen] = React.useState(false);
  const [membersDrawerOpen, setMembersDrawerOpen] = React.useState(false);
  const [tempSelectedEnvironments, setTempSelectedEnvironments] = React.useState<string[]>(() => {
    if (environment === "both") return ["indoor", "outdoor"];
    return [environment];
  });
  const [tempSelectedMembers, setTempSelectedMembers] = React.useState<string[]>(selectedMembers);
  
  const selectedMemberCount = selectedMembers.length;
  const totalMembers = familyMembers.length;

  // Handle environment selection
  const handleEnvironmentSelect = () => {
    if (tempSelectedEnvironments.length === 0) {
      setEnvironment("both");
    } else if (tempSelectedEnvironments.length === 2) {
      setEnvironment("both");
    } else {
      setEnvironment(tempSelectedEnvironments[0] as Environment);
    }
    setEnvironmentDrawerOpen(false);
  };

  // Handle members selection
  const handleMembersSelect = () => {
    setSelectedMembers(tempSelectedMembers);
    setMembersDrawerOpen(false);
  };

  // Reset temp selections when drawers open
  useEffect(() => {
    if (environmentDrawerOpen) {
      if (environment === "both") {
        setTempSelectedEnvironments(["indoor", "outdoor"]);
      } else {
        setTempSelectedEnvironments([environment]);
      }
    }
  }, [environmentDrawerOpen, environment]);

  useEffect(() => {
    if (membersDrawerOpen) {
      setTempSelectedMembers(selectedMembers);
    }
  }, [membersDrawerOpen, selectedMembers]);

  // Toggle environment selection
  const toggleEnvironment = (env: string) => {
    setTempSelectedEnvironments(prev => {
      if (prev.includes(env)) {
        return prev.filter(e => e !== env);
      } else {
        return [...prev, env];
      }
    });
  };

  // Get environment display text
  const getEnvironmentDisplayText = () => {
    if (environment === "both") return "Both";
    return environment.charAt(0).toUpperCase() + environment.slice(1);
  };

  return (
    <ScrollArea className="w-full mb-6">
      <div className="flex items-center gap-3 px-1 py-2 min-w-max">
        {/* Environment Selection */}
        <Button
          variant="outline"
          className="rounded-full bg-background flex items-center gap-2 h-12 pl-2 pr-5"
          onClick={() => setEnvironmentDrawerOpen(true)}
        >
          <div className="bg-card-bg-3 rounded-full p-2">
            <Globe className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">{getEnvironmentDisplayText()}</span>
          <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
        </Button>

        {/* Participants Selection */}
        <Button
          variant="outline"
          className="rounded-full bg-background flex items-center gap-2 h-12 pl-2 pr-5"
          onClick={() => setMembersDrawerOpen(true)}
        >
          <div className="bg-card-bg-2 rounded-full p-2">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">
            {selectedMemberCount === totalMembers
              ? "All members"
              : selectedMemberCount > 0
              ? `${selectedMemberCount} selected`
              : "Select members"}
          </span>
          <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </div>

      {/* Environment Selection Drawer */}
      <ScrollDrawer
        title="Environment"
        description="Select indoor or outdoor activities"
        open={environmentDrawerOpen}
        onOpenChange={setEnvironmentDrawerOpen}
        titleActions={
          <Button 
            size="sm" 
            onClick={handleEnvironmentSelect}
            disabled={tempSelectedEnvironments.length === 0}
          >
            Apply
          </Button>
        }
      >
        <div className="space-y-4">
          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer border",
              tempSelectedEnvironments.includes("indoor") ? "border-primary" : "border-input"
            )}
            onClick={() => toggleEnvironment("indoor")}
          >
            <div className={cn(
              "rounded-full p-2",
              tempSelectedEnvironments.includes("indoor") ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Indoor</h3>
              <p className="text-sm text-muted-foreground">Activities for inside the home</p>
            </div>
            <Checkbox 
              className="ml-auto"
              checked={tempSelectedEnvironments.includes("indoor")}
              onCheckedChange={(checked) => {
                if (checked) {
                  if (!tempSelectedEnvironments.includes("indoor")) {
                    toggleEnvironment("indoor");
                  }
                } else {
                  if (tempSelectedEnvironments.includes("indoor")) {
                    toggleEnvironment("indoor");
                  }
                }
              }}
            />
          </div>

          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer border",
              tempSelectedEnvironments.includes("outdoor") ? "border-primary" : "border-input"
            )}
            onClick={() => toggleEnvironment("outdoor")}
          >
            <div className={cn(
              "rounded-full p-2",
              tempSelectedEnvironments.includes("outdoor") ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Trees className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Outdoor</h3>
              <p className="text-sm text-muted-foreground">Activities for outside the home</p>
            </div>
            <Checkbox 
              className="ml-auto"
              checked={tempSelectedEnvironments.includes("outdoor")}
              onCheckedChange={(checked) => {
                if (checked) {
                  if (!tempSelectedEnvironments.includes("outdoor")) {
                    toggleEnvironment("outdoor");
                  }
                } else {
                  if (tempSelectedEnvironments.includes("outdoor")) {
                    toggleEnvironment("outdoor");
                  }
                }
              }}
            />
          </div>
        </div>
      </ScrollDrawer>

      {/* Family Members Selection Drawer */}
      <ScrollDrawer
        title="Family Members"
        description="Select who will participate"
        open={membersDrawerOpen}
        onOpenChange={setMembersDrawerOpen}
        titleActions={
          <Button 
            size="sm" 
            onClick={handleMembersSelect}
          >
            Apply
          </Button>
        }
      >
        <div className="space-y-2">
          {familyMembers.map((member) => (
            <div 
              key={member.id} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-md cursor-pointer border",
                tempSelectedMembers.includes(member.id.toString()) ? "border-primary" : "border-input"
              )}
              onClick={() => {
                const value = member.id.toString();
                setTempSelectedMembers(prev => 
                  prev.includes(value) 
                    ? prev.filter(id => id !== value) 
                    : [...prev, value]
                );
              }}
            >
              <Avatar className="h-9 w-9">
                {member.avatar ? (
                  <AvatarImage src={member.avatar} alt={member.name} />
                ) : (
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium">{member.name}</span>
              <Checkbox 
                className="ml-auto"
                checked={tempSelectedMembers.includes(member.id.toString())}
                onCheckedChange={(checked) => {
                  const value = member.id.toString();
                  if (checked) {
                    if (!tempSelectedMembers.includes(value)) {
                      setTempSelectedMembers(prev => [...prev, value]);
                    }
                  } else {
                    if (tempSelectedMembers.includes(value)) {
                      setTempSelectedMembers(prev => prev.filter(id => id !== value));
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>
      </ScrollDrawer>
    </ScrollArea>
  );
}