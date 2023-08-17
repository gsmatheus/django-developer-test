/* eslint-disable react-hooks/exhaustive-deps */

import { Control } from "@/@types/control.type";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import { columnsControl } from "./Components/table/columns";
import { Link } from "react-router-dom";

export function HomePage() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [controls, setControls] = useState<Control[]>([]);
  const [fetching, setFetching] = useState(false);
  const [finishFirstLoad, setFinishFirstLoad] = useState(false);
  const [search, setSearch] = useState("");

  async function fetchControls(pageIndex: number, pageSize: number) {
    setFetching(true);
    const response = await api.get(
      `/control?page=${pageIndex}&page_size=${pageSize}` +
        (search ? `&search=${search}` : "")
    );

    const data = await response.data;

    setTotalItems(data.total_items);
    setTotalPages(data.total_pages);
    setCurrentPage(data.current_page);
    setControls(data.results);

    setFetching(false);
  }

  useEffect(() => {
    if (!fetching) {
      fetchControls(1, 5);
      setFinishFirstLoad(true);
    }
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      fetchControls(1, 5);
    } else {
      if (finishFirstLoad) {
        fetchControls(1, 5);
      }
    }
  }, [search]);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Bem vindo, <span className="text-cyan-500">Usúario</span>
          </h2>
          <p className="text-muted-foreground">
            Abaixo estão o controle dos veículos cadastrados!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/control/new">
            <Button>
              <span className="text-sm">Nova Entrada</span>
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columnsControl({ fetchControls })}
        data={controls}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        fetchData={fetchControls}
        loading={fetching}
        setSearch={setSearch}
        finishFirstLoad={finishFirstLoad}
        serachPlaceholder="Pesquise pela a data ex: 2023-01-30"
      />
    </div>
  );
}
