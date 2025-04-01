import { Outlet } from "react-router";
import useAuthCheck from "../useAuthCheck";

const LayoutContent: React.FC = () => {

  useAuthCheck();
  return (
    <div className="min-h-screen">
      <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return <LayoutContent />;
};

export default AppLayout;
