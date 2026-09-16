/** مطابق لـ BusListDto بالباك (BusController § list) */
export interface BusListDto {
  id: string;
  name: string;
  subFees: number;
  capacity: number;
  driverId: string;
  driverName?: string | null;
}

/** مطابق لـ BusDropdownDto */
export interface BusDropdownDto {
  id: string;
  name: string;
  driverName?: string | null;
}

/** مطابق لـ AddBusDto — driverId مطلوب (Guid غير Nullable بالباك) */
export interface AddBusDto {
  branchId: string;
  name: string;
  subFees: number;
  capacity: number;
  driverId: string;
}

/** مطابق لـ UpdateBusDto */
export interface UpdateBusDto {
  id: string;
  name?: string | null;
  subFees?: number | null;
  capacity?: number | null;
  driverId?: string | null;
}