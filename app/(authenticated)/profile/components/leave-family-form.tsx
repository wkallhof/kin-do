"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function LeaveFamilyForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleLeaveFamily = async () => {
        setIsLoading(true);

        try {
            // This would be an API call in a real application
            // For now, we'll just simulate a successful operation
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success("You have left the family. You will be redirected to your profile.");

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/profile");
            }, 2000);
        } catch (error) {
            toast.error("Failed to leave family. Please try again.");
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Warning</h3>
                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                                <p>
                                    Leaving your family will remove your access to all shared family content, activities, and settings. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                    <h3 className="text-sm font-medium">What happens when you leave a family:</h3>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                        <li>You will lose access to all shared family content</li>
                        <li>Your personal content will remain in your account</li>
                        <li>You will need to be invited again to rejoin this family</li>
                        <li>Family members will be notified that you have left</li>
                    </ul>
                </div>

                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            Leave Family
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. You will be removed from your family and lose access to all shared content.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLeaveFamily}
                                disabled={isLoading}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isLoading ? "Processing..." : "Yes, leave family"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
} 