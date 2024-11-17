import { walletRouter } from "@/api/routers";
import { WalletDetailsResponse } from "@/api/types";
import { Skeleton } from "@/components/Skeleton";
import { Button, Icon, Text, UnifiedIconName } from "@/components/base";
import { color } from "@/config/colors";
import { monify } from "@/utils";
import Color from "color";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import * as React from "react";
import { Share } from "react-native";
import { toast } from "sonner-native";
import { Sheet, View, XStack, YStack, useTheme } from "tamagui";

export function WalletPanel() {
  const { data: walletDetails, isLoading } =
    walletRouter.getWalletDetails.useQuery({});
  return (
    <>
      <YStack bg="$white1" gap="$3" mt="$4" pb="$4" br={16}>
        <YStack bg="$purple6" br={16} py="$4.5" px="$4" gap="$4">
          <YStack gap="$1">
            <Text fow="500" color="$white1">
              Wallet Balance
            </Text>
            {walletDetails ? (
              <Text fow="500" fos="$6.5" color="$white1">
                {monify(walletDetails.wallet_balance)}
              </Text>
            ) : (
              <Skeleton
                style={{
                  height: 36.7,
                  width: 120,
                }}
              />
            )}
          </YStack>

          {isLoading || !walletDetails ? (
            <Skeleton style={{ height: 32, borderRadius: 16 }} />
          ) : (
            <AccountNumberBtn {...walletDetails} />
          )}
        </YStack>
        <YStack gap="$2">
          <XStack jc="space-between" ai="center" px="$3">
            <Text fow="500">Recent Transactions</Text>
            <Button variant="ghost" size="sm">
              <Button.Text>See all</Button.Text>
            </Button>
          </XStack>
          <YStack>
            <TransactionItem variant="sent" />
            <TransactionItem variant="received" />
            <TransactionItem variant="failed" />
          </YStack>
        </YStack>
        <XStack gap="$6" px="$3">
          <Link href="/(protected)/transfer" asChild>
            <Button f={1}>
              <Button.Icon>
                <Icon name="ri:arrow-right-up-line" size={24} />
              </Button.Icon>
              <Button.Text>Transfer</Button.Text>
            </Button>
          </Link>
          <Button f={1}>
            <Button.Icon>
              <Icon name="ri:add-circle-fill" size={24} />
            </Button.Icon>
            <Button.Text>Fund Wallet</Button.Text>
          </Button>
        </XStack>
      </YStack>
    </>
  );
}

type TransactionVariant = "sent" | "received" | "failed";
function TransactionItem(props: { variant: "sent" | "received" | "failed" }) {
  const theme = useTheme();
  const icons = {
    sent: "ri:arrow-right-up-line",
    received: "ri:arrow-left-down-line",
    failed: "ri:error-warning-line",
  } as const satisfies Record<TransactionVariant, UnifiedIconName>;
  const colors = {
    sent: theme.green6.val,
    received: theme.purple6.val,
    failed: "#FF0000",
  } as const satisfies Record<TransactionVariant, string>;
  return (
    <XStack px="$3" ai="center" gap="$4" py="$1.5">
      <View
        h={40}
        w={40}
        ai="center"
        jc="center"
        br={20}
        bg={Color(colors[props.variant]).alpha(0.1).string()}
      >
        <Icon
          name={icons[props.variant]}
          color={colors[props.variant]}
          size={24}
        />
      </View>
      <YStack f={1}>
        <Text fos="$2" color="$black1" fow="500">
          Saved to Target Saving
        </Text>
        <Text color="$black6" fos="$1">
          {new Date().toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </Text>
      </YStack>
      <Text fow="500">{monify(1000000)}</Text>
    </XStack>
  );
}

function AccountNumberBtn(props: WalletDetailsResponse) {
  const [position, setPosition] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const accountText = React.useMemo(
    () =>
      `Account number:${props.account_number} \n Bank Name: ${props.bank_name} \n Account Name: ${props.account_name}`,
    []
  );
  const copyDetails = React.useCallback(() => {
    Clipboard.setStringAsync(accountText);
    toast.success("Copied to clipboard");
  }, [accountText]);
  const shareDetails = React.useCallback(() => {
    Share.share({
      message: accountText,
    });
  }, [accountText]);

  return (
    <>
      <XStack
        ai="center"
        jc="space-between"
        px="$4"
        py="$1.5"
        bg="$white025"
        br={16}
        onPress={() => setOpen(true)}
        transform={[{ scale: 1 }]}
        pressStyle={{
          transform: [
            {
              scale: 0.99,
            },
          ],
        }}
      >
        <Text fow="600" fos="$2" color="$white1">
          {props.account_name}
        </Text>
        <XStack ai="center" gap="$2">
          <Text color="$white1" fos="$2">
            {props.account_number}
          </Text>
          <Icon name="ri:file-copy-fill" color={color.white1} size={20} />
        </XStack>
      </XStack>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPointsMode={"fit"}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="quick"
        modal
      >
        <Sheet.Overlay />

        <Sheet.Handle />
        <Sheet.Frame
          padding="$4"
          gap="$5"
          bg="white"
          width={"95%"}
          mx="2.5%"
          mb="$8"
          br="$4"
          disableHideBottomOverflow
        >
          <Text fos="$4" fow="600">
            Fund Your Wallet
          </Text>
          <YStack bg="$white2" p="$3" br="$4">
            <Text color="$black8" fos="$1">
              {props.bank_name}
            </Text>
            <Text color="$black8">{props.account_name}</Text>
            <Text fontFamily="$gilroy" color="$black2" fos="$6.5" fow="600">
              {props.account_number}
            </Text>
            <XStack gap="$4" mt="$4">
              <Button
                size="sm"
                variant="secondary-light"
                f={1}
                onPress={copyDetails}
              >
                <Button.Icon>
                  <Icon name="ri:clipboard-fill" />
                </Button.Icon>
                <Button.Text>Copy Numbers</Button.Text>
              </Button>
              <Button size="sm" f={1} onPress={shareDetails}>
                <Button.Icon>
                  <Icon name="ri:share-forward-fill" />
                </Button.Icon>
                <Button.Text>Share</Button.Text>
              </Button>
            </XStack>
          </YStack>
          <XStack ai="center" bg="$white2" gap={8} p="$3" br="$4">
            <View bg="$purple5" h={48} w={48} br={8} ai="center" jc="center">
              <Icon name="ri:bank-card-fill" size={24} color="#fff" />
            </View>
            <YStack f={1}>
              <Text color="$black1" fow="600">
                Fund with Card
              </Text>
              <Text color="$black6" fos="$1">
                Add money directly from your bank card
              </Text>
            </YStack>
            <Icon
              name="ri:arrow-right-s-line"
              size={24}
              color={theme.black1.val}
            />
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
