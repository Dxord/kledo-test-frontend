export interface Province {
  id: number;
  name: string;
}

export interface Regency {
  id: number;
  name: string;
  province_id: number;
}

export interface District {
  id: number;
  name: string;
  regency_id: number;
}

export interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}
