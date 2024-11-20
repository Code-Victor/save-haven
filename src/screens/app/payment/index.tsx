import { SafeArea } from "@/components/base";
import TransactionList from "@/components/tabs/history/TransactionsList";
import { REDIRECT_URL } from "@/constants";
import { Stack } from "expo-router";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { toast } from "sonner-native";

export default function PaymentScreen() {
  const router = useRouter();
  const { uri: paymentUri, redirect } = useLocalSearchParams<{
    uri?: string;
    redirect?: string;
  }>();
  const onNavigationStateChange = React.useCallback(
    async (state: WebViewNavigation) => {
      const { url } = state;
      console.log(url);
      // if the url is the close url, close the sheet(i.e if the payment is successful)
      if (url?.startsWith(REDIRECT_URL)) {
        toast.info("Payment is being processed");
        if (redirect) {
          router.navigate(redirect);
        }
      }
    },
    []
  );
  if (!paymentUri) {
    return <Redirect href="/(protected)/(tabs)/" />;
  }
  return (
    <SafeArea edges={["left", "right", "bottom"]} bg="$white2">
      <Stack.Screen
        options={{
          title: "Payment",
        }}
      />
      <WebView
        source={{ uri: paymentUri ?? "" }}
        style={{ flex: 1 }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeArea>
  );
}
