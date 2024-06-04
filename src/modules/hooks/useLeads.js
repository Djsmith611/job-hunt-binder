import { useSelector } from "react-redux";

const useLeads = () => {
  return useSelector((state) => state.leads);
};

export default useLeads;
