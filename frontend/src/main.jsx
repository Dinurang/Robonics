import ReactDOM from "react-dom/client";
import { AuthProvider } from "./commonend/auth.jsx";
import AppRoutes from './RoutePath.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
