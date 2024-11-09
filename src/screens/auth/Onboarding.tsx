import { View, Text, XStack } from "tamagui";
import { OnboardingSlides } from "@/components/OnboardingSlides";
import { Button, Icon } from "@/components/base";
import { Link } from "expo-router";

const Onboarding = () => {
  return (
    <View flex={1} bg="$background">
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
    </View>
  );
};

export default Onboarding;
