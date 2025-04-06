"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NotificationsFormProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// We're not using the user prop yet but will need it for future API integration
export function NotificationsForm({  }: NotificationsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // These states would typically be fetched from the API
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityUpdates, setActivityUpdates] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");

  async function onSubmit() {
    setIsLoading(true);

    try {
      // This would be an API call to update notification settings
      // const response = await fetch("/api/profile/notifications", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     emailNotifications,
      //     activityUpdates,
      //     taskReminders,
      //     marketingEmails,
      //     notificationFrequency,
      //   }),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("Notification settings updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important updates
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activity-updates">Activity Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about family activity
              </p>
            </div>
            <Switch 
              id="activity-updates" 
              checked={activityUpdates}
              onCheckedChange={setActivityUpdates}
              disabled={!emailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders about upcoming tasks
              </p>
            </div>
            <Switch 
              id="task-reminders" 
              checked={taskReminders}
              onCheckedChange={setTaskReminders}
              disabled={!emailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and promotions
              </p>
            </div>
            <Switch 
              id="marketing-emails" 
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
              disabled={!emailNotifications}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Notification Frequency</h3>
        <p className="text-sm text-muted-foreground">
          Select how often you want to receive notification digests
        </p>
        
        <RadioGroup 
          className="mt-4 space-y-3" 
          value={notificationFrequency}
          onValueChange={setNotificationFrequency}
          disabled={!emailNotifications}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="real-time" id="real-time" />
            <Label htmlFor="real-time">Real-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily digest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly digest</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button onClick={onSubmit} disabled={isLoading} className="mt-6">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
} 