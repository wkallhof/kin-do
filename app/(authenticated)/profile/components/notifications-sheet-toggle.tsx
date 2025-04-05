"use client";

import { Bell } from "lucide-react";
import { ProfileSheetToggle } from "./profile-sheet-toggle";

export function NotificationsSheetToggle() {
  return (
    <ProfileSheetToggle
      title="Notifications"
      description="Control how you receive notifications"
      icon={<Bell className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure your notification preferences.
          </p>
          <p className="text-sm">
            This is a placeholder for notification settings. You would implement the actual form here.
          </p>
        </div>
      </div>
    </ProfileSheetToggle>
  );
} 