"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Computer } from "lucide-react";
import { toast } from "sonner";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[200px] flex items-center justify-center">Loading theme preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
      <RadioGroup
        value={theme || "system"}
        onValueChange={(value) => {
          if (value === "light" || value === "dark" || value === "system") {
            setTheme(value);
            toast.success(`Theme changed to ${value}`);
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Light Theme Option */}
        <div>
          <RadioGroupItem
            value="light"
            id="theme-light"
            className="sr-only"
          />
          <Label
            htmlFor="theme-light"
            className="cursor-pointer"
          >
            <Card className={`p-4 ${
              theme === "light" ? "border-2 border-primary" : ""
            } hover:border-primary transition-all`}>
              <div className="flex flex-col items-center gap-2">
                <Sun className="h-6 w-6 text-yellow-500" />
                <div className="font-medium">Light</div>
                <div className="text-sm text-muted-foreground">
                  Light background with dark text
                </div>
              </div>
            </Card>
          </Label>
        </div>

        {/* Dark Theme Option */}
        <div>
          <RadioGroupItem
            value="dark"
            id="theme-dark"
            className="sr-only"
          />
          <Label
            htmlFor="theme-dark"
            className="cursor-pointer"
          >
            <Card className={`p-4 ${
              theme === "dark" ? "border-2 border-primary" : ""
            } hover:border-primary transition-all`}>
              <div className="flex flex-col items-center gap-2">
                <Moon className="h-6 w-6 text-blue-400" />
                <div className="font-medium">Dark</div>
                <div className="text-sm text-muted-foreground">
                  Dark background with light text
                </div>
              </div>
            </Card>
          </Label>
        </div>

        {/* System Theme Option */}
        <div>
          <RadioGroupItem
            value="system"
            id="theme-system"
            className="sr-only"
          />
          <Label
            htmlFor="theme-system"
            className="cursor-pointer"
          >
            <Card className={`p-4 ${
              theme === "system" ? "border-2 border-primary" : ""
            } hover:border-primary transition-all`}>
              <div className="flex flex-col items-center gap-2">
                <Computer className="h-6 w-6 text-gray-500" />
                <div className="font-medium">System</div>
                <div className="text-sm text-muted-foreground">
                  Follow system appearance
                </div>
              </div>
            </Card>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
} 