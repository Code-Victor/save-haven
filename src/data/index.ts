import { Href } from "expo-router";

export const savingsOptions: {
  name: string;
  description: string;
  icon: any;
  href: Href;
  color: string;
  comingSoon?: boolean;
}[] = [
  {
    name: "Target Savings",
    description: "Save with discipline towards a specific goal or project",
    icon: require("@/assets/images/target.png"),
    href: "/(protected)/target-savings",
    color: "#EAE6EC",
  },
  {
    name: "Group Savings",
    description:
      "Save and take turns to receive funds for your goals or business.",
    icon: require("@/assets/images/group.png"),
    href: "/(protected)/group-savings",
    color: "#E7F8F6",
  },
  {
    name: "Crowdfunding",
    description:
      "Raise funds together to achieve your dreams, launch a business, or support a cause.",
    icon: require("@/assets/images/crowdfunding.png"),
    href: "/(protected)/crowdfunding",
    color: "#FFF6ED",
  },
  {
    name: "Subscription",
    description:
      "Join friends or app users to share the cost of your Spotify, Apple Music, or YouTube subscription.",
    href: "/",
    icon: require("@/assets/images/subscription.png"),
    comingSoon: true,
    color: "#F3F6FF",
  },
];
