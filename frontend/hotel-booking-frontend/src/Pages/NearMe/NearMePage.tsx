import { NearMeLayout } from "../../components/map";
import { useGeolocation } from "../../hooks";
import { useNearbyHotelsQuery } from "../../services/queries";

const NearMePage = () => {
  const { location, loading } = useGeolocation();
  const { data: hotels = [], isLoading } =
    useNearbyHotelsQuery(location);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <NearMeLayout
      location={location}
      hotels={hotels}
    />
  );
};

export default NearMePage;