"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreditCard, ArrowRight } from "lucide-react";

interface SubscriptionInfoProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  subscription: {
    status: string;
    plan: string;
    billingCycle: string;
    nextBillingDate: string;
    amount: string;
  };
}

// We need the user param for type checking, though it's not used in this demo component yet
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SubscriptionInfo({ user, subscription }: SubscriptionInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleUpdatePayment = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Redirecting to payment portal...");
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelSubscription = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Subscription canceled. Changes will take effect at the end of your billing cycle.");
      setIsLoading(false);
      setShowCancelDialog(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Current Plan</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold">{subscription.plan}</span>
            <Badge className="ml-2" variant={subscription.status === 'active' ? 'default' : 'outline'}>
              {subscription.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {subscription.billingCycle} billing • {subscription.amount}
          </p>
        </div>
        
        <div className="flex flex-col sm:items-end justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            Next billing date: <strong>{subscription.nextBillingDate}</strong>
          </p>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleUpdatePayment} 
            disabled={isLoading}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Available Plans</h3>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Basic</h4>
                  <p className="text-sm text-muted-foreground">For individuals</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$4.99</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Basic features
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Limited storage
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Email support
                </li>
              </ul>
              
              <Button 
                className="w-full mt-4" 
                variant={subscription.plan === 'Basic' ? 'secondary' : 'outline'}
                disabled={subscription.plan === 'Basic' || isLoading}
              >
                {subscription.plan === 'Basic' ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Premium</h4>
                  <p className="text-sm text-muted-foreground">For families</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$9.99</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  All basic features
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Unlimited storage
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                  Premium features
                </li>
              </ul>
              
              <Button 
                className="w-full mt-4" 
                variant={subscription.plan === 'Premium' ? 'secondary' : 'default'}
                disabled={subscription.plan === 'Premium' || isLoading}
              >
                {subscription.plan === 'Premium' ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Cancel Subscription</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You can cancel your subscription at any time. Your plan will remain active until the end of your current billing cycle.
        </p>
        
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4" disabled={isLoading}>
              Cancel Subscription
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel your subscription. Your plan will remain active until {subscription.nextBillingDate}, after which you&apos;ll be downgraded to the free plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Nevermind</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelSubscription} disabled={isLoading}>
                {isLoading ? "Canceling..." : "Yes, Cancel Subscription"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
} 