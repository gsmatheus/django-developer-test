export type Vehicle = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  oil_change_km: number;
};

export enum VehicleKeys {
  id = "Identificador",
  plate = "Placa",
  brand = "Marca",
  model = "Modelo",
  oil_change_km = "Troca de óleo (km)",
}
