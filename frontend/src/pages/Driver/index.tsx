import { Driver } from "@/@types/driver.type";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columnsDriver } from "./components/table/columns";
import { DataTable } from "@/components/data-table";

export function DriversPage() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [fetching, setFetching] = useState(false);
  const [finishFirstLoad, setFinishFirstLoad] = useState(false);

  async function fetchDrivers(page: number, page_size: number) {
    setFetching(true);
    const response = await api.get("/driver", {
      params: {
        page,
        page_size,
      },
    });

    const data = await response.data;

    setDrivers(data.results);
    setTotalItems(data.total_items);
    setTotalPages(data.total_pages);
    setCurrentPage(data.current_page);
    setFetching(false);
  }

  useEffect(() => {
    fetchDrivers(1, 5);
    setFinishFirstLoad(true);
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Controle de Motoristas
          </h2>
          <p className="text-muted-foreground">
            Gerencie os motoristas da sua empresa
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/drivers/new">
            <Button>Adicionar Motorista</Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columnsDriver}
        data={drivers}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        fetchData={fetchDrivers}
        loading={fetching}
        setSearch={() => {}}
        finishFirstLoad={finishFirstLoad}
      />
    </div>
  );
}
