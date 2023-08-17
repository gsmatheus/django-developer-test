import { Vehicle } from "@/@types/vehicle.type";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columnsVehicle } from "./components/table/columns";

export function VehiclesPage() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fetching, setFetching] = useState(false);
  const [finishFirstLoad, setFinishFirstLoad] = useState(false);

  async function fetchVehicles(page: number, page_size: number) {
    setFetching(true);
    const response = await api.get("/vehicle", {
      params: {
        page,
        page_size,
      },
    });

    const data = await response.data;

    setVehicles(data.results);
    setTotalItems(data.total_items);
    setTotalPages(data.total_pages);
    setCurrentPage(data.current_page);
    setFetching(false);
  }

  useEffect(() => {
    fetchVehicles(1, 5);
    setFinishFirstLoad(true);
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Controle de Veículos
          </h2>
          <p className="text-muted-foreground">
            Gerencie os veículos da sua frota
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/vehicles/new">
            <Button>Adicionar Veículo</Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columnsVehicle}
        data={vehicles}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        fetchData={fetchVehicles}
        loading={fetching}
        setSearch={() => {}}
        finishFirstLoad={finishFirstLoad}
      />
    </div>
  );
}
