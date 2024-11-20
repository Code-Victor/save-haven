import { SafeArea } from "@/components/base";

import { ProfilePanel } from "@/components/tabs/home/ProfilePanel";
import { WalletPanel } from "@/components/tabs/home/WalletPanel";
import { ActionsPanel } from "@/components/tabs/home/ActionsPanel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshScrollView } from "@/components/RefreshScrollView";

export default function HomeTab() {
  const safeAreaInstes = useSafeAreaInsets();
  return (
    <RefreshScrollView
      px={safeAreaInstes.left + 16}
      pt={safeAreaInstes.top}
      pb={safeAreaInstes.bottom}
      bg="$white2"
    >
      <ProfilePanel />
      <WalletPanel />
      <ActionsPanel />
    </RefreshScrollView>
  );
}
