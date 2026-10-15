export interface BusListDto {
  id: string;
  name: string;
  subFees: number;
  capacity: number;
  driverId: string;
  driverName?: string | null;
}

export interface BusDropdownDto {
  id: string;
  name: string;
  driverName?: string | null;
}

export interface AddBusDto {
  branchId: string;
  name: string;
  subFees: number;
  capacity: number;
  driverId: string;
}

export interface UpdateBusDto {
  id: string;
  name?: string | null;
  subFees?: number | null;
  capacity?: number | null;
  driverId?: string | null;
}