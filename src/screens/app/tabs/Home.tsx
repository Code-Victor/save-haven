import { SafeArea } from "@/components/base";

import { ProfilePanel } from "@/components/tabs/home/ProfilePanel";
import { WalletPanel } from "@/components/tabs/home/WalletPanel";
import { ActionsPanel } from "@/components/tabs/home/ActionsPanel";

export default function HomeTab() {
  return (
    <SafeArea bg="$white2" px="$4">
      <ProfilePanel />
      <WalletPanel />
      <ActionsPanel />
    </SafeArea>
  );
}
