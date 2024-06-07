import { useSelector } from "react-redux";

const useLeadLoad = () => {
    return useSelector((state) => state.leads.leadLoad);
};

export default useLeadLoad;