'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Environment = 'indoor' | 'outdoor';

interface Resource {
  id: number;
  name: string;
  environment: Environment;
  isActive: boolean;
}

interface ResourceListProps {
  environment: Environment;
}

export function ResourceList({ environment }: ResourceListProps) {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [newResourceName, setNewResourceName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // Fetch resources
  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch(`/api/family/resources?environment=${environment}`);
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [environment]);

  // Add new resource
  const handleAddResource = async () => {
    if (!newResourceName.trim()) return;

    try {
      const response = await fetch('/api/family/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newResourceName,
          environment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add resource');
      
      const newResource = await response.json();
      setResources([newResource, ...resources]); // Add new resource at the top
      setNewResourceName('');
      toast.success('Resource added successfully');
      router.refresh();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Failed to add resource');
    }
  };

  // Delete resource
  const handleDeleteResource = async (id: number) => {
    try {
      const response = await fetch(`/api/family/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete resource');
      
      setResources(resources.filter(resource => resource.id !== id));
      toast.success('Resource deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  // Start editing
  const handleStartEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setEditingName(resource.name);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Save edit
  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/family/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingName,
        }),
      });

      if (!response.ok) throw new Error('Failed to update resource');
      
      setResources(
        resources.map(resource => 
          resource.id === id ? { ...resource, name: editingName } : resource
        )
      );
      setEditingId(null);
      setEditingName('');
      toast.success('Resource updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
    }
  };

  if (loading) {
    return <div className="py-4">Loading resources...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add new resource..."
          value={newResourceName}
          onChange={(e) => setNewResourceName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddResource()}
          className="flex-1 h-12 py-2"
        />
        <Button onClick={handleAddResource} size="icon" className="h-12 w-12">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {resources.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No {environment} resources yet. Add some to get started!
          </p>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
            >
              {editingId === resource.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(resource.id)}
                    autoFocus
                    className="flex-1"
                  />
                  <Button onClick={() => handleSaveEdit(resource.id)} size="icon" variant="ghost">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancelEdit} size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{resource.name}</span>
                  <div className="flex items-center space-x-1">
                    <Button onClick={() => handleStartEdit(resource)} size="icon" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDeleteResource(resource.id)} size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 