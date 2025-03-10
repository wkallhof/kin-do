import { Metadata } from 'next';
import { ResourceList } from './components/resource-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <TabsContent value="indoor" className="mt-6 space-y-4">
            <h3 className="text-2xl font-semibold">Indoor</h3>
            <p className="text-muted-foreground">
              Manage your indoor resources like toys, art supplies, and furniture
            </p>
          <ResourceList environment="indoor" />
        </TabsContent>
        <TabsContent value="outdoor" className="mt-6 space-y-4">
            <h3 className="text-2xl font-semibold">Outdoor</h3>
            <p className="text-muted-foreground">
              Manage your outdoor resources like playground equipment, sports equipment, and garden tools
            </p>
          <ResourceList environment="outdoor" />
        </TabsContent>
      </Tabs>
    </main>
  );
} 