import { Metadata } from 'next';
import { ResourceList } from './components/resource-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/app/(authenticated)/components/page-header';

export const metadata: Metadata = {
  title: 'My Things',
  description: 'Manage your indoor and outdoor resources',
};

export default function ThingsPage() {
  return (
    <main className="container py-6">
        <PageHeader
          title="My Things"
          description="Manage your indoor and outdoor resources for activities"
        />

      <Tabs defaultValue="indoor" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="indoor">Indoor</TabsTrigger>
          <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
        </TabsList>
        <TabsContent value="indoor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Indoor Resources</CardTitle>
              <CardDescription>
                Manage your indoor resources like toys, art supplies, and furniture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceList environment="indoor" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outdoor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Outdoor Resources</CardTitle>
              <CardDescription>
                Manage your outdoor resources like playground equipment, sports equipment, and garden tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceList environment="outdoor" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
} 