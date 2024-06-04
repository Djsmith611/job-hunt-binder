import { useSelector } from "react-redux";

const useLeads = () => {
  return useSelector((state) => state.leads.leads);
};

export default useLeads;
