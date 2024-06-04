import { useSelector } from "react-redux";

const useData = () => {
  return useSelector((state) => state.leads.data);
};

export default useData;
