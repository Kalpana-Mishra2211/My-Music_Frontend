import { Route } from "react-router-dom";
import HomePage from "../Components/Header/HomePage";
import PendingApprovalPage from "../Components/Header/PendingApprovalPage";

const HomeRoutes = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/pending-approval"
        element={<PendingApprovalPage />}
      />
    </>
  );
};

export default HomeRoutes;