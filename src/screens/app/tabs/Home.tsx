import { ProfilePanel } from "@/components/tabs/home/ProfilePanel";
import { WalletPanel } from "@/components/tabs/home/WalletPanel";
import { ActionsPanel } from "@/components/tabs/home/ActionsPanel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshScrollView } from "@/components/RefreshScrollView";
import { ProcessPanel } from "@/components/tabs/home/ProcessPanel";
import { TransactionPanel } from "@/components/tabs/home/TransactionPanel";
import { TABBAR_HEIGHT_OFFSET } from "@/constants";

export default function HomeTab() {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <RefreshScrollView
      bg="$white2"
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom + 16 + TABBAR_HEIGHT_OFFSET,
        paddingTop: safeAreaInsets.top,
        paddingHorizontal: safeAreaInsets.left,
      }}
    >
      <ProfilePanel />
      <WalletPanel />
      <ProcessPanel />
      <ActionsPanel />
      <TransactionPanel />
    </RefreshScrollView>
  );
}
