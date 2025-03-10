import { PageHeader } from "../components/page-header";
import { FavoritesList } from "./components/favorites-list";

export const metadata = {
  title: "Favorite Activities | Kin•Do",
  description: "View and manage your favorite family activities",
};

export default function FavoritesPage() {
  return (
    <main className="container py-6">
      <PageHeader
        title="Favorite Activities"
        description="View and manage your saved favorite activities"
      />
      
      <FavoritesList />
    </main>
  );
} 