import { useParams } from 'react-router-dom';
import { getLocationBySlug } from '../data/remapping-locations';
import { getVehicleBySlug } from '../data/vehicle-remapping';
import { getDpfLocationBySlug } from '../data/dpf-locations';
import RemappingLocation from './RemappingLocation';
import VehicleRemap from './VehicleRemap';
import DPFCleaningLocation from './DPFCleaningLocation';
import NotFound from './NotFound';

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

  // Check if the slug matches a data-driven DPF location page
  const dpfLocation = getDpfLocationBySlug(slug ?? '');
  if (dpfLocation) {
    return <DPFCleaningLocation location={dpfLocation} />;
  }

  // Unknown slug — render a proper 404 (noindex) instead of redirecting to a
  // real page, which previously created a soft-404 redirect chain.
  return <NotFound />;
}
