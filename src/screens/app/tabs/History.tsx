import { SafeArea, Text } from "@/components/base";
import TransactionList from "@/components/tabs/history/TransactionsList";

export default function HistoryTab() {
  return (
    <SafeArea edges={["left", "right", "bottom"]} bg="$white2">
      <TransactionList />
    </SafeArea>
  );
}
