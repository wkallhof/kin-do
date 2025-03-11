import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSettings } from "../components/theme-settings";


export const metadata: Metadata = {
  title: "Appearance | Kin•Do",
  description: "Customize the look and feel of your Kin•Do experience",
};

export default function AppearancePage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your Kin•Do experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ThemeSettings />
        </CardContent>
      </Card>
    </div>
  );
} 