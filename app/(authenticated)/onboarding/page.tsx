'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'primary_guardian' | 'secondary_guardian'>('primary_guardian');
  const [familyName, setFamilyName] = useState('My Family');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter your name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName,
          primaryGuardian: {
            name,
            role,
          },
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to complete onboarding');
      }
      
      toast.success('Onboarding completed successfully!');
      router.push('/family');
      router.refresh();
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Setup</CardTitle>
          <CardDescription>
            Let&apos;s set up your family profile to get started with Kin•Do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Enter your family name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Your Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as 'primary_guardian' | 'secondary_guardian')}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="primary_guardian" id="primary" />
                  <Label htmlFor="primary" className="font-normal">Primary Guardian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="secondary_guardian" id="secondary" />
                  <Label htmlFor="secondary" className="font-normal">Secondary Guardian</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Setting Up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
} 