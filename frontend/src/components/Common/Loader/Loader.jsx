// src/components/Loader.jsx (or wherever your loader is)
import { CircleLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <CircleLoader
        color={"#0058be"}
        loading={true}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
