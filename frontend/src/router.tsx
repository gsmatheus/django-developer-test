import { Route, Routes } from "react-router-dom";
import { Layout } from "./layout";
import { HomePage } from "./pages/Home";
import { NewVehiclePage } from "./pages/Vehicle/new";
import { VehiclesPage } from "./pages/Vehicle";
import { DriversPage } from "./pages/Driver";
import { NewDriverPage } from "./pages/Driver/new";
import { NewControlPage } from "./pages/Control/new";
import { UpdateControlPage } from "./pages/Control/update";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/new" element={<NewVehiclePage />} />

        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/drivers/new" element={<NewDriverPage />} />

        <Route path="/control/new" element={<NewControlPage />} />
        <Route path="/control/:id/edit/" element={<UpdateControlPage />} />

        <Route path="*" element={<h1>404</h1>} />
      </Route>
    </Routes>
  );
}
