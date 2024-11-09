import { OnboardingSlides } from "@/components/OnboardingSlides";
import { Button, Icon, SafeArea } from "@/components/base";
import { Link } from "expo-router";
import { View, XStack } from "tamagui";

const Onboarding = () => {
  return (
    <SafeArea flex={1} bg="$background" edges={["left", "right", "bottom"]}>
      <View f={1}>
        <OnboardingSlides />
      </View>
      <XStack py="$11" gap="$4" px="$5">
        <Link href="/signup" asChild>
          <Button variant="outlined" f={1}>
            <Button.Text>Sign up</Button.Text>
            <Button.Icon>
              <Icon name="ri:arrow-right-s-line" />
            </Button.Icon>
          </Button>
        </Link>
        <Link href="/signin" asChild>
          <Button variant="primary" f={1}>
            <Button.Text>Sign in</Button.Text>
          </Button>
        </Link>
      </XStack>
    </SafeArea>
  );
};

export default Onboarding;
