import { Driver } from "./driver.type";
import { Vehicle } from "./vehicle.type";

export type Control = {
  id: number;
  departure_date: string;
  departure_time: string;
  departure_km: number;
  destination: string;
  return_date: string;
  return_time: string;
  return_km: number;
  distance_traveled: number;
  vehicle: Vehicle;
  driver: Driver;
};
