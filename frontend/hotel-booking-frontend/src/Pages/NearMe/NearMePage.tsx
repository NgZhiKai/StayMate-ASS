import { NearMeLayout } from "../../components/map";
import { HeroSection } from "../../components/Misc";
import { useGeolocation } from "../../hooks";
import { useNearbyHotelsQuery } from "../../services/queries";

const NearMePage = () => {
  const { location, loading } = useGeolocation();
  const { data: hotels = [], isLoading } =
    useNearbyHotelsQuery(location);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen space-y-14">
      <HeroSection
        title="Stays near you"
        highlight="Stays"
        description="Discover beautiful places around your location"
        padding="lg"
        align="left"
      />

      <NearMeLayout
        location={location}
        hotels={hotels}
      />
    </div>
  );
};

export default NearMePage;