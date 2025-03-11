"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Moon, Sun, Computer, Home, Trees } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Key to store vibrant mode preference
const VIBRANT_MODE_KEY = 'kindo-vibrant-mode';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [vibrancy, setVibrancy] = useState(true);
  const [customTheme, setCustomTheme] = useState({
    background: "30 20% 98%",
    foreground: "240 10% 3.9%",
    card: "35 30% 96%",
    cardForeground: "240 10% 3.9%",
    primary: "220 60% 50%",
    primaryForeground: "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    secondaryForeground: "240 5.9% 10%",
    accent: "220 40% 90%",
    accentForeground: "240 5.9% 10%",
    border: "240 5.9% 14%"
  });

  // Toggle vibrant mode and save preference
  const toggleVibrantMode = (checked: boolean) => {
    setVibrancy(checked);
    
    try {
      localStorage.setItem(VIBRANT_MODE_KEY, checked ? 'true' : 'false');
    } catch (error) {
      console.error('Could not save theme preference to localStorage', error);
    }
    
    toast.success(`${checked ? 'Enabled' : 'Disabled'} vibrant activity cards`);
  };

  // Apply vibrancy settings
  useEffect(() => {
    if (mounted && vibrancy) {
      document.documentElement.classList.add('theme-vibrant');
    } else if (mounted) {
      document.documentElement.classList.remove('theme-vibrant');
    }
  }, [vibrancy, mounted]);

  // Avoid hydration mismatch and load saved preferences
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first (user preference takes priority)
    try {
      const savedPreference = localStorage.getItem(VIBRANT_MODE_KEY);
      if (savedPreference !== null) {
        setVibrancy(savedPreference === 'true');
      } else {
        // If no preference is saved, check for the class (system default)
        const isVibrant = document.documentElement.classList.contains('theme-vibrant');
        setVibrancy(isVibrant);
      }
    } catch {
      // If localStorage isn't available, fall back to class check
      const isVibrant = document.documentElement.classList.contains('theme-vibrant');
      setVibrancy(isVibrant);
    }
  }, []);

  // This color parser converts HSL string to separate H, S, L values for the sliders
  const parseColor = (colorStr: string) => {
    const parts = colorStr.split(" ");
    return {
      h: parseInt(parts[0]),
      s: parseInt(parts[1]),
      l: parseInt(parts[2])
    };
  };

  // Combine H, S, L values back to string format
  const formatColor = (h: number, s: number, l: number) => {
    return `${h} ${s}% ${l}%`;
  };

  // Effect to update CSS variables when customTheme changes
  useEffect(() => {
    if (!mounted) {
      return;
    }

    // Update CSS variables based on customTheme
    document.documentElement.style.setProperty('--background', customTheme.background);
    document.documentElement.style.setProperty('--foreground', customTheme.foreground);
    document.documentElement.style.setProperty('--card', customTheme.card);
    document.documentElement.style.setProperty('--card-foreground', customTheme.cardForeground);
    document.documentElement.style.setProperty('--primary', customTheme.primary);
    document.documentElement.style.setProperty('--primary-foreground', customTheme.primaryForeground);
    document.documentElement.style.setProperty('--secondary', customTheme.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', customTheme.secondaryForeground);
    document.documentElement.style.setProperty('--accent', customTheme.accent);
    document.documentElement.style.setProperty('--accent-foreground', customTheme.accentForeground);
    document.documentElement.style.setProperty('--border', customTheme.border);
  }, [customTheme, mounted]);

  // Update a specific color in the customTheme state
  const updateColor = (colorKey: keyof typeof customTheme, h: number, s: number, l: number) => {
    setCustomTheme(prev => ({
      ...prev,
      [colorKey]: formatColor(h, s, l)
    }));
  };

  // Reset to default themes
  const applyPredefinedTheme = (themeName: string) => {
    if (themeName === "system") {
      setTheme("system");
      // Reset custom changes
      document.documentElement.style.cssText = "";
      document.documentElement.classList.remove('theme-warm');
      toast.success("Theme set to System");
    } else if (themeName === "light") {
      setTheme("light");
      document.documentElement.style.cssText = "";
      document.documentElement.classList.remove('theme-warm');
      toast.success("Theme set to Light");
    } else if (themeName === "dark") {
      setTheme("dark");
      document.documentElement.style.cssText = "";
      document.documentElement.classList.remove('theme-warm');
      toast.success("Theme set to Dark");
    } else if (themeName === "warm") {
      // Apply the warm theme from globals.css
      document.documentElement.classList.add("theme-warm");
      setTheme("light");
      toast.success("Warm theme applied");
    }
  };

  // Mock activity card for preview
  const ActivityCardPreview = ({ environment }: { environment: 'indoor' | 'outdoor' | 'both' }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all shadow-sm border-2",
        vibrancy ? (
          environment === "indoor" 
            ? "bg-activity-indoor-bg border-activity-indoor-border text-activity-indoor-text" 
            : environment === "outdoor" 
              ? "bg-activity-outdoor-bg border-activity-outdoor-border text-activity-outdoor-text" 
              : "bg-activity-both-bg border-activity-both-border text-activity-both-text"
        ) : (
          environment === "indoor" 
            ? "border-blue-200" 
            : environment === "outdoor" 
              ? "border-green-200" 
              : "border-purple-200"
        )
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium">Sample Activity</h3>
            <p className={cn(
              "text-sm",
              vibrancy && (
                environment === "indoor" 
                  ? "text-activity-indoor-text/80"
                  : environment === "outdoor"
                    ? "text-activity-outdoor-text/80"
                    : "text-activity-both-text/80"
              )
            )}>
              A short activity description would appear here to explain what this is all about.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={cn(
            "text-xs",
            vibrancy && (
              environment === "indoor" 
                ? "border-activity-indoor-border/50 bg-activity-indoor-border/10"
                : environment === "outdoor"
                  ? "border-activity-outdoor-border/50 bg-activity-outdoor-border/10"
                  : "border-activity-both-border/50 bg-activity-both-border/10"
            )
          )}>
            Focus Area
          </Badge>
          <Badge variant="outline" className={cn(
            "text-xs",
            vibrancy && (
              environment === "indoor" 
                ? "border-activity-indoor-border/50 bg-activity-indoor-border/10"
                : environment === "outdoor"
                  ? "border-activity-outdoor-border/50 bg-activity-outdoor-border/10"
                  : "border-activity-both-border/50 bg-activity-both-border/10"
            )
          )}>
            Learning
          </Badge>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className={cn(
            "rounded-full p-1.5",
            vibrancy 
              ? (environment === "indoor" 
                ? "bg-activity-indoor-border/30" 
                : environment === "outdoor" 
                  ? "bg-activity-outdoor-border/30" 
                  : "bg-activity-both-border/30")
              : (environment === "indoor"
                ? "bg-blue-100" 
                : environment === "outdoor" 
                  ? "bg-green-100" 
                  : "bg-purple-100")
          )}>
            {environment === "indoor" ? (
              <Home className={cn("h-4 w-4", !vibrancy && "text-blue-500")} />
            ) : environment === "outdoor" ? (
              <Trees className={cn("h-4 w-4", !vibrancy && "text-green-500")} />
            ) : (
              <div className="flex gap-1">
                <Home className={cn("h-4 w-4", !vibrancy && "text-purple-500")} />
                <Trees className={cn("h-4 w-4", !vibrancy && "text-purple-500")} />
              </div>
            )}
          </div>
          <span className={cn(
            vibrancy && (
              environment === "indoor" 
                ? "text-activity-indoor-text/80"
                : environment === "outdoor"
                  ? "text-activity-outdoor-text/80"
                  : "text-activity-both-text/80"
            )
          )}>
            3 items needed
          </span>
        </div>
      </CardContent>
    </Card>
  );

  // ColorPicker component for each color property
  const ColorPicker = ({ 
    colorKey, 
    label 
  }: { 
    colorKey: keyof typeof customTheme; 
    label: string;
  }) => {
    const color = customTheme[colorKey];
    const { h, s, l } = parseColor(color);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <div 
            className="w-6 h-6 rounded border" 
            style={{ backgroundColor: `hsl(${color})` }}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs">Hue: {h}</span>
            <Slider 
              min={0} 
              max={360} 
              step={1}
              value={[h]}
              onValueChange={(values) => updateColor(colorKey, values[0], s, l)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs">Saturation: {s}%</span>
            <Slider 
              min={0} 
              max={100} 
              step={1}
              value={[s]}
              onValueChange={(values) => updateColor(colorKey, h, values[0], l)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs">Lightness: {l}%</span>
            <Slider 
              min={0} 
              max={100} 
              step={1}
              value={[l]}
              onValueChange={(values) => updateColor(colorKey, h, s, values[0])}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // Example components to showcase theme
  const ThemeShowcase = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
            <CardDescription>This is how cards look with this theme</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content appears here with the current theme applied.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Button Variants</Label>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Form Element</Label>
            <Input placeholder="Input field" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading theme preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Customization</TabsTrigger>
        </TabsList>
        
        {/* Basic Settings Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
            <RadioGroup
              defaultValue={theme}
              onValueChange={(value) => {
                if (value === "light" || value === "dark" || value === "system") {
                  setTheme(value);
                  toast.success(`Theme changed to ${value}`);
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
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

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Activity Cards</h3>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <Label htmlFor="vibrant-mode">Vibrant Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable colorful activity cards based on environment
                </p>
              </div>
              <Switch 
                id="vibrant-mode" 
                checked={vibrancy}
                onCheckedChange={toggleVibrantMode}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <ActivityCardPreview environment="indoor" />
              <ActivityCardPreview environment="outdoor" />
              <ActivityCardPreview environment="both" />
            </div>

            <p className="text-sm text-muted-foreground">
              Activity cards will adapt to your selections, using different colors based on whether
              they&apos;re for indoor, outdoor, or both environments.
            </p>
          </div>
        </TabsContent>
        
        {/* Advanced Customization Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={theme === "light" ? "default" : "outline"} 
              onClick={() => applyPredefinedTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button 
              variant={theme === "dark" ? "default" : "outline"} 
              onClick={() => applyPredefinedTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button 
              variant={theme === "system" ? "default" : "outline"} 
              onClick={() => applyPredefinedTheme("system")}
            >
              <Computer className="mr-2 h-4 w-4" />
              System
            </Button>
            <Button 
              variant="outline" 
              onClick={() => applyPredefinedTheme("warm")}
            >
              <Sun className="mr-2 h-4 w-4 text-amber-500" />
              Warm
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="background">
              <AccordionTrigger>Background Colors</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ColorPicker colorKey="background" label="Background" />
                <ColorPicker colorKey="foreground" label="Foreground" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cards">
              <AccordionTrigger>Card Colors</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ColorPicker colorKey="card" label="Card" />
                <ColorPicker colorKey="cardForeground" label="Card Foreground" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="buttons">
              <AccordionTrigger>Button Colors</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ColorPicker colorKey="primary" label="Primary" />
                <ColorPicker colorKey="primaryForeground" label="Primary Foreground" />
                <ColorPicker colorKey="secondary" label="Secondary" />
                <ColorPicker colorKey="secondaryForeground" label="Secondary Foreground" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="accents">
              <AccordionTrigger>Accent Colors</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ColorPicker colorKey="accent" label="Accent" />
                <ColorPicker colorKey="accentForeground" label="Accent Foreground" />
                <ColorPicker colorKey="border" label="Border" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Button 
            variant="outline" 
            onClick={() => {
              document.documentElement.style.cssText = "";
              setTheme(theme || "light"); // Reset to current theme
              toast.success("Custom changes reset");
            }}
            className="mt-4"
          >
            Reset Custom Changes
          </Button>
          
          <ThemeShowcase />
          
          <div className="mt-8 p-4 border rounded bg-card text-card-foreground">
            <h3 className="font-medium">Export Theme</h3>
            <div className="mt-2">
              <pre className="p-2 bg-muted rounded text-xs overflow-auto">
                {`:root {
  --background: ${customTheme.background};
  --foreground: ${customTheme.foreground};
  --card: ${customTheme.card};
  --card-foreground: ${customTheme.cardForeground};
  --primary: ${customTheme.primary};
  --primary-foreground: ${customTheme.primaryForeground};
  --secondary: ${customTheme.secondary};
  --secondary-foreground: ${customTheme.secondaryForeground};
  --accent: ${customTheme.accent};
  --accent-foreground: ${customTheme.accentForeground};
  --border: ${customTheme.border};
}`}
              </pre>
              <p className="text-xs mt-2">Copy this code to your globals.css file to save your theme.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 