import {
  REDIRECT_URL,
  SUPPORT_PHONE_NUMBER,
  SUPPORT_PROMPT,
} from "@/constants";
import { AxiosError, isAxiosError } from "axios";
import { openURL } from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import { toast } from "sonner-native";

const ACCESS_TOKEN_KEY = "access-token";

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

export async function setAccessToken(token: string) {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (e) {
    console.log("Failed to store token:", e);
  }
}

export async function getAccessToken() {
  try {
    const result = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    return result;
  } catch (e) {
    console.log("Failed to get token:", e);
  }
}

/**
 * The function `clearToken` clears either an OTP token or an access token stored in SecureStore.

 */
export async function clearAccessToken() {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, "");
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
 * @param config.handler - Optional function to handle errors in a custom way
 * @param config.options - Error handling options
 * @param config.options.customMessage - Custom error message to display
 * @param config.options.severity - Severity level of the error (default: ERROR)
 * @param config.options.logToServer - Whether to log the error to a server (default: false)
 *
 * @returns A function that can be used in the onError callback of useMutation
 *
 * @example
 * useMutation({
 *   onError: handleError({
 *     handler: myCustomHandler,
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
    handler?: (error: AxiosError, options?: ErrorHandlingOptions) => void;
    options?: ErrorHandlingOptions;
  } = { options: {} }
) {
  const { handler, options } = config;
  return (error: unknown) => {
    if (error instanceof AxiosError) {
      if (handler) {
        return handler(error, options);
      }

      const {
        customMessage,
        severity = ErrorSeverity.ERROR,
        logToServer,
      } = options ?? {
        severity: ErrorSeverity.ERROR,
        logToServer: false,
      };

      let message =
        customMessage || error.response?.data?.detail || "An error occurred";

      console[ERROR_SEVERITY_CONSOLE_METHOD[severity]](
        `[${severity.toUpperCase()}] ${message}`,
        error
      );

      toast.error(message);

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

interface ErrorResponse {
  message: string;
}

export function isAxiosErrorWithMessage(
  error: unknown
): error is AxiosError<ErrorResponse> {
  return (
    isAxiosError(error) &&
    error.response !== undefined &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  );
}

// Types for the payment configuration
type ConnectionMode = "live" | "test";
type CurrencyCode = "NGN" | "USD";

interface PaymentConfig {
  merchantKey: string;
  baseUrl?: string;
}

interface PaymentLinkParams {
  checkoutAmount: number;
  currencyCode?: CurrencyCode;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transactionReference: string;
  redirectUrl?: string;
  connectionMode?: ConnectionMode;
  additionalDetails?: Record<string, unknown>;
}

class PaymentLinkGenerator {
  private readonly merchantKey: string;
  private readonly baseUrl: string;

  constructor(config: PaymentConfig) {
    this.merchantKey = config.merchantKey;
    this.baseUrl = config.baseUrl || "https://business.dev.payaza.africa";
  }

  /**
   * Generates a payment link with the provided parameters
   * @param params Payment link parameters
   * @returns Generated payment URL
   */
  generatePaymentLink(params: PaymentLinkParams): string {
    const {
      checkoutAmount,
      currencyCode = "NGN",
      emailAddress,
      firstName,
      lastName,
      phoneNumber,
      transactionReference,
      redirectUrl = REDIRECT_URL,
      connectionMode = "test",
      additionalDetails,
    } = params;

    // Validate amount
    if (checkoutAmount <= 0) {
      throw new Error("Checkout amount must be greater than 0");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      throw new Error("Invalid email address");
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("merchant_key", this.merchantKey);
    queryParams.append("connection_mode", connectionMode);
    queryParams.append("checkout_amount", checkoutAmount.toString());
    queryParams.append("currency_code", currencyCode);
    queryParams.append("email_address", emailAddress);
    queryParams.append("first_name", firstName);
    queryParams.append("last_name", lastName);
    queryParams.append("phone_number", phoneNumber);
    queryParams.append("transaction_reference", transactionReference);
    queryParams.append("redirect_url", redirectUrl);

    // Add additional details if provided
    if (additionalDetails) {
      queryParams.append(
        "additional_details",
        JSON.stringify(additionalDetails)
      );
    }

    return `${this.baseUrl}/payment-page?${queryParams.toString()}`;
  }

  /**
   * Validates a generated payment URL
   * @param url Payment URL to validate
   * @returns boolean indicating if the URL is valid
   */
  validatePaymentUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const requiredParams = [
        "merchant_key",
        "connection_mode",
        "checkout_amount",
        "currency_code",
        "email_address",
        "first_name",
        "last_name",
        "phone_number",
        "transaction_reference",
        "redirect_url",
      ];

      for (const param of requiredParams) {
        if (!parsedUrl.searchParams.has(param)) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Usage example
export const createPaymentLinkGenerator = (config: PaymentConfig) => {
  return new PaymentLinkGenerator(config);
};

export const paymentGenerator = createPaymentLinkGenerator({
  merchantKey: "PZ78-PKTEST-942F4045-28B7-4EDF-8805-15EF1B3F9BFF",
});

/**
 * Split a full name into first and last name components
 * @param fullName - The full name to be split
 * @returns An object with firstName and lastName
 */
export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  // Remove extra whitespace and split
  const nameParts = fullName.trim().split(/\s+/);

  // If only one name is provided
  if (nameParts.length <= 1) {
    return {
      firstName: fullName.trim(),
      lastName: "",
    };
  }

  // Last part is last name, everything before is first name
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts.slice(0, -1).join(" ");

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  };
}
