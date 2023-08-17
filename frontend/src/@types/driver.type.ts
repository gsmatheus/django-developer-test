export type Driver = {
  id: number;
  name: string;
  phone: string;
  license_number: string;
};

export enum DriverKeys {
  id = "Identificador",
  name = "Nome",
  phone = "Telefone",
  license_number = "Número da CNH",
}
