import { useParams, Navigate } from 'react-router-dom';
import { getLocationBySlug } from '../data/remapping-locations';
import { getVehicleBySlug } from '../data/vehicle-remapping';
import RemappingLocation from './RemappingLocation';
import VehicleRemap from './VehicleRemap';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();

  // Check if the slug matches a location
  const location = getLocationBySlug(slug ?? '');
  if (location) {
    // If it's a location, RemappingLocation will handle fetching data via useParams,
    // but we can also just render it directly and let it do its thing.
    // However, RemappingLocation was previously receiving slug via useParams.
    // It's still using useParams internally.
    return <RemappingLocation />;
  }

  // Check if the slug matches a vehicle
  const vehicle = getVehicleBySlug(slug ?? '');
  if (vehicle) {
    return <VehicleRemap vehicle={vehicle} />;
  }

  // If neither, fallback to the main remapping page
  return <Navigate to="/remapping" replace />;
}
