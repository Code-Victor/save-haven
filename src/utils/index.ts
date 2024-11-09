import { SUPPORT_PHONE_NUMBER, SUPPORT_PROMPT } from "@/constants";
import { AxiosError } from "axios";
import * as Application from "expo-application";
import { openURL } from "expo-linking";
import { Platform } from "expo-modules-core";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { v4 as uuidv4 } from "uuid";

const IOS_DEVICE_ID_KEY = "ios-device-id";
const ACCESS_TOKEN_KEY = "access-token";
const OTP_TOKEN_KEY = "otp-token";

/**
 * Type guard to check if an array is non-empty.
 *
 * This function acts as a type predicate, narrowing the type of the input array
 * to a tuple with at least one element if it's non-empty.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to check.
 * @returns {arr is [T, ...T[]]} - Type predicate indicating if the array is non-empty.
 *                                 Returns true if the array has at least one element, false otherwise.
 *
 * @example
 * const numbers: number[] = [1, 2, 3];
 * if (isNonEmptyArray(numbers)) {
 *     // TypeScript now knows that numbers is of type [number, ...number[]]
 *     const firstNumber = numbers[0]; // Safe to access
 * }
 *
 * @example
 * const emptyArray: string[] = [];
 * if (!isNonEmptyArray(emptyArray)) {
 *     console.log("The array is empty");
 * }
 */
export function isNonEmptyArray<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0;
}

/**
 * The function `getAvatar` returns an avatar URI based on the provided name or a default logo if the
 * name is "guest".
 * @param  - The `getAvatar` function takes an object as a parameter with a `name` property of type
 * string. If the `name` is not equal to "guest", it returns an object with a `uri` property containing
 * a dynamically generated avatar image URL using the `name` parameter. If the
 * @returns If the `name` is not equal to "guest", the function will return an object with a `uri`
 * property containing a dynamically generated avatar image URL using the `name` parameter. If the
 * `name` is "guest", the function will return the logo.svg image from the assets folder.
 */
export function getAvatar({ name }: { name: string }) {
  if (name !== "guest") {
    return {
      uri: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${name}&backgroundColor=763900,9e5622,ecad80,f2d3b1`,
    };
  }
  return require("@/assets/images/icon.svg");
}

/**
 * The `monify` function formats a number as Nigerian Naira currency.
 * @param {number} number - The `number` parameter is the numerical value that you want to format as a
 * currency in Nigerian Naira (NGN).
 * @returns The `monify` function returns the given `number` formatted as a Nigerian Naira currency
 * string with no decimal places.
 */
export function monify(number: number) {
  return number.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

/**
 * The function sends a message via WhatsApp if the app is installed, otherwise it displays a toast
 * message indicating that WhatsApp cannot be opened.
 * you want to send via WhatsApp. It will be included in the URL as the `text` query parameter.
 */
export async function sendSupportMessage() {
  const link = `whatsapp://send?text=${SUPPORT_PROMPT}&phone=${SUPPORT_PHONE_NUMBER}`;
  try {
    openURL(link);
  } catch (error) {
    ToastAndroid.show("can't open whatsapp", ToastAndroid.SHORT);
  }
}

/**
 * The function `formatBirthday` takes a Date, string, or number input representing a birthday, formats
 * it as "Month DayOrdinalSuffix", and throws an error for invalid inputs.
 * @param {DateInput} birthday - The `birthday` parameter in the `formatBirthday` function can accept
 * values of type `Date`, `string`, or `number`. It is used to represent a person's birthdate.
 * @returns The `formatBirthday` function takes a `DateInput` parameter (which can be a Date object, a
 * string, or a number representing a date) and returns a formatted string representing the birthday in
 * the format "Month DayOrdinalSuffix". The `getOrdinalSuffix` function is used to determine the
 * ordinal suffix for the day (e.g., 1st, 2nd, 3rd
 */
type DateInput = Date | string | number;

export function formatBirthday(birthday: DateInput): string {
  const date = new Date(birthday);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  const ordinalSuffix = getOrdinalSuffix(day);

  return `${month} ${day}${ordinalSuffix}`;
}

function getOrdinalSuffix(day: number): string {
  if (day < 1 || day > 31) {
    throw new Error("Day must be between 1 and 31");
  }

  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * The function `getDeviceId` retrieves the device ID based on the platform (Android or iOS) and stores
 * it securely if it's an iOS device.
 * @returns The `getDeviceId` function returns the device ID based on the platform. If the platform is
 * Android, it returns the Android ID using `Application.getAndroidId()`. If the platform is not
 * Android (assumed to be iOS), it retrieves the device ID from SecureStore using the key
 * `IOS_DEVICE_ID_KEY`. If the device ID is not found in SecureStore, it generates a new
 */
export const getDeviceId = async () => {
  if (Platform.OS === "android") {
    return Application.getAndroidId();
  } else {
    let deviceId = await SecureStore.getItemAsync(IOS_DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = uuidv4();
      await SecureStore.setItemAsync(IOS_DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }
};

/**
 * The function setToken asynchronously stores a token in SecureStore based on the provided
 * configuration.
 * @param config - The `setToken` function takes a configuration object as a parameter with the
 * following properties:
 */
export async function setToken(config: { token: string; otp?: boolean }) {
  try {
    await SecureStore.setItemAsync(
      config.otp ? OTP_TOKEN_KEY : ACCESS_TOKEN_KEY,
      config.token
    );
  } catch (e) {
    console.log("Failed to store token:", e);
  }
}

/**
 * The function `getToken` asynchronously retrieves a token from SecureStore based on the configuration
 * provided, with an option to specify OTP token retrieval.
 * @param [config] - The `config` parameter is an optional object that can contain the following
 * property:
 * @returns The `getToken` function returns the token value retrieved from SecureStore based on the
 * configuration provided. If `config` includes the `otp` property set to `true`, the function
 * retrieves the OTP token using the `OTP_TOKEN_KEY`. Otherwise, it retrieves the access token using
 * the `ACCESS_TOKEN_KEY`. The retrieved token value is returned by the function.
 */
export async function getToken(config?: { otp?: boolean }) {
  try {
    const result = await SecureStore.getItemAsync(
      config?.otp ? OTP_TOKEN_KEY : ACCESS_TOKEN_KEY
    );

    return result;
  } catch (e) {
    console.log("Failed to get token:", e);
  }
}

/**
 * The function `clearToken` clears either an OTP token or an access token stored in SecureStore.
 * @param config - The `clearToken` function takes a configuration object as a parameter. The
 * configuration object can have an optional property `otp` which is a boolean value. If `otp` is true,
 * the function will clear the OTP token using the `OTP_TOKEN_KEY`, otherwise, it will clear the access
 * token
 */
export async function clearToken(config: { otp?: boolean }) {
  try {
    await SecureStore.setItemAsync(
      config.otp ? OTP_TOKEN_KEY : ACCESS_TOKEN_KEY,
      ""
    );
  } catch (e) {
    console.log("Failed to delete token:", e);
  }
}

export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

interface ErrorHandlingOptions {
  customMessage?: string;
  severity?: ErrorSeverity;
  retry?: boolean;
  logToServer?: boolean;
}

const ERROR_SEVERITY_CONSOLE_METHOD = {
  [ErrorSeverity.INFO]: "info",
  [ErrorSeverity.WARNING]: "warn",
  [ErrorSeverity.ERROR]: "error",
  [ErrorSeverity.CRITICAL]: "error",
} as const;

/**
 * Handles errors for React Query mutations using Axios.
 *
 * This function provides a flexible error handling solution for React Query mutations.
 * It supports custom error handling, different severity levels, retry logic, server logging,
 * and specific HTTP status code handling.
 *
 * @param config - Configuration object for the error handler
 * @param config.customHandler - Optional function to handle errors in a custom way
 * @param config.options - Error handling options
 * @param config.options.customMessage - Custom error message to display
 * @param config.options.severity - Severity level of the error (default: ERROR)
 * @param config.options.retry - Whether to attempt a retry (default: false)
 * @param config.options.logToServer - Whether to log the error to a server (default: false)
 *
 * @returns A function that can be used in the onError callback of useMutation
 *
 * @example
 * useMutation({
 *   onError: handleError({
 *     customHandler: myCustomHandler,
 *     options: {
 *       severity: ErrorSeverity.WARNING,
 *       retry: true,
 *       logToServer: true
 *     }
 *   })
 * })
 */
export function handleError(
  config: {
    customHandler?: (error: AxiosError, options?: ErrorHandlingOptions) => void;
    options?: ErrorHandlingOptions;
  } = { options: {} }
) {
  const { customHandler, options } = config;
  return (error: unknown) => {
    if (error instanceof AxiosError) {
      if (customHandler) {
        return customHandler(error, options);
      }

      const {
        customMessage,
        severity = ErrorSeverity.ERROR,
        retry = false,
        logToServer = false,
      } = options;

      let message =
        customMessage || error.response?.data?.message || "An error occurred";

      console[ERROR_SEVERITY_CONSOLE_METHOD[severity]](
        `[${severity.toUpperCase()}] ${message}`,
        error
      );

      ToastAndroid.show(message, ToastAndroid.SHORT);

      if (retry) {
        console.log("Retrying...");
      }

      if (logToServer) {
        console.log("Logging to server...");
      }

      switch (error.response?.status) {
        case 401:
          console.log("Unauthorized access. Redirecting to login...");
          break;
        case 403:
          console.log("Forbidden access.");
          break;
        case 404:
          console.log("Resource not found.");
          break;
        case 500:
          console.log("Internal server error.");
          break;
      }
    } else {
      console.error("An unexpected error occurred", error);
      ToastAndroid.show("An unexpected error occurred", ToastAndroid.SHORT);
    }
  };
}
