import { useSearchParams } from "react-router-dom";
import SoloResult from "../components/SoloResult";
import VsBotResult from "../components/VsBotResult";

const Results = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div>
      {mode === "solo" && <SoloResult />}
      {mode === "vsbot" && <VsBotResult />}
    </div>
  );
};

export default Results;