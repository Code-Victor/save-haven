import { FRONTEND_URL } from "@/constants";
import { parse } from "expo-linking";
import { z } from "zod";
export async function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  if (path.includes(FRONTEND_URL)) {
    const { queryParams } = parse(path);
    console.log("native intents", queryParams, path);
    if (path.includes("campaign")) {
      const res = z
        .object({ id: z.string(), transaction_ref: z.string() })
        .safeParse(queryParams ?? {});
      if (!res.success) return "/(protected)/(tabs)/";
      return (
        "/(protected)/crowdfunding/" +
        res.data.id +
        "?transaction_ref=" +
        res.data.transaction_ref
      );
    } else if (path.includes("group-savings")) {
      const res = z.object({ ref: z.string() }).safeParse(queryParams ?? {});
      if (!res.success) return "/(protected)/(tabs)/";
      return (
        "/(protected)/group-savings/join" + "?transaction_ref=" + res.data.ref
      );
    }
  }
  // TODO: Implement native intent redirection
  return "/(protected)/(tabs)/";
}
