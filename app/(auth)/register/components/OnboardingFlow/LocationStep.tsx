"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const commonThings = {
  "Art Supplies": ["crayons", "paper", "paint"],
  "Toys": ["blocks", "board games", "puzzles"],
  "Outdoor": ["balls", "bikes", "chalk"],
  "Educational": ["books", "learning toys"],
};

export function LocationStep() {
  const { state, updateLocationData, setStep } = useOnboarding();

  const handleContinue = () => {
    updateLocationData({
      home: {
        ...state.locationData.home,
        availableThings: Object.entries(commonThings).reduce(
          (acc, [_, items]) => ({
            ...acc,
            ...items.reduce((itemAcc, item) => ({
              ...itemAcc,
              [item]: true,
            }), {}),
          }),
          {}
        ),
      },
    });
    setStep("account");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Your Home Location</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ve set up your home location with common items. You can customize these later.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(commonThings).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You can add more locations and customize items later
        </p>
      </div>
    </div>
  );
} 