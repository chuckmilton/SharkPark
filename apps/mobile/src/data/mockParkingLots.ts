import { ParkingLotUI } from '../types/ui';
import { scalePosition } from '../utils/mapUtils';

const rawParkingLots = [
  { id: 'G1', name: 'G1', occupancy: 45, category: 'general', position: { x: 291, y: 512 } },
  { id: 'G2', name: 'G2', occupancy: 67, category: 'general', position: { x: 195, y: 340 } },
  { id: 'G3', name: 'G3', occupancy: 78, category: 'general', position: { x: 407, y: 416 } },
  { id: 'G4', name: 'G4', occupancy: 82, category: 'general', position: { x: 352, y: 306 } },
  { id: 'G5', name: 'G5', occupancy: 56, category: 'general', position: { x: 460, y: 283 } },
  { id: 'G6', name: 'G6', occupancy: 91, category: 'general', position: { x: 428, y: 237 } },
  { id: 'G7', name: 'G7', occupancy: 73, category: 'general', position: { x: 431, y: 164 } },
  { id: 'G8', name: 'G8', occupancy: 64, category: 'general', position: { x: 431, y: 99 } },
  { id: 'G9', name: 'G9', occupancy: 88, category: 'general', position: { x: 431, y: 44 } },
  { id: 'G10', name: 'G10', occupancy: 45, category: 'general', position: { x: 244, y: 65 } },
  { id: 'G11', name: 'G11', occupancy: 92, category: 'general', position: { x: 510, y: 74 } },
  { id: 'G12', name: 'G12', occupancy: 89, category: 'general', position: { x: 799, y: 75 } },
  { id: 'G13', name: 'G13', occupancy: 71, category: 'general', position: { x: 930, y: 87 } },
  { id: 'G14', name: 'G14', occupancy: 58, category: 'general', position: { x: 930, y: 192 } },
  { id: 'PVN', name: 'Palo Verde N.', occupancy: 65, category: 'general', position: { x: 875, y: 75 } },
  { id: 'PVS', name: 'Palo Verde S.', occupancy: 65, category: 'general', position: { x: 875, y: 180 } },
  { id: 'PYR', name: 'Pyramid', occupancy: 79, category: 'general', position: { x: 510, y: 237 } },
  { id: 'E1', name: 'E1', occupancy: 85, category: 'employee', position: { x: 450, y: 369 } },
  { id: 'E2', name: 'E2', occupancy: 72, category: 'employee', position: { x: 587, y: 436 } },
  { id: 'E3', name: 'E3', occupancy: 68, category: 'employee', position: { x: 695, y: 365 } },
  { id: 'E4', name: 'E4', occupancy: 91, category: 'employee', position: { x: 728, y: 287 } },
  { id: 'E5', name: 'E5', occupancy: 33, category: 'employee', position: { x: 850, y: 255 } },
  { id: 'E6', name: 'E6', occupancy: 76, category: 'employee', position: { x: 923, y: 435 } },
  { id: 'E7', name: 'E7', occupancy: 82, category: 'employee', position: { x: 728, y: 690 } },
  { id: 'E8', name: 'E8', occupancy: 59, category: 'employee', position: { x: 665, y: 880 } },
  { id: 'E9', name: 'E9', occupancy: 87, category: 'employee', position: { x: 548, y: 858 } },
  { id: 'E10', name: 'E10', occupancy: 64, category: 'employee', position: { x: 537, y: 658 } },
  { id: 'E11', name: 'E11', occupancy: 71, category: 'employee', position: { x: 537, y: 549 } },
] as const;

// transform lot's position to scale for current device
export const parkingLots: ParkingLotUI[] = rawParkingLots.map(lot => ({
  ...lot,
  position: scalePosition(lot.position.x, lot.position.y),
}));