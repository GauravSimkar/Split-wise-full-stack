import { useParams } from "react-router-dom";
import { GroupProvider } from "../context/GroupContext";

// dashboard components
import GroupHeader from "../components/groups/GroupHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import Participants from "../components/groups/Participants";
import BalanceTable from "../components/dashboard/BalanceTable";
import Settlement from "../components/dashboard/Settlement";

// expense components
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseList from "../components/expenses/ExpenseList";

// analytics
import GroupStats from "../components/dashboard/GroupStats";
import Ledger from "../components/dashboard/Ledger";
import GroupContributions from "../components/groups/GroupContributions";
import AISummaryCard from "../components/dashboard/AISummaryCard";

const GroupDashboard = () => {
  const { groupId } = useParams();

  return (
    <GroupProvider groupId={groupId}>
      <div className="p-6 space-y-6">

        <GroupHeader />

        <SummaryCards />
        <AISummaryCard />
        <GroupStats/>

        <Participants />

        <BalanceTable />

        <GroupContributions />

        <ExpenseFilters />

        <ExpenseList />

        <Ledger/>

        <Settlement />

      </div>
    </GroupProvider>
  );
};

export default GroupDashboard;
