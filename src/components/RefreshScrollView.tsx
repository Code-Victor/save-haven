import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  forwardRef,
} from "react";
import { RefreshControl } from "react-native";
import { ScrollView, ScrollViewProps } from "tamagui";
// Context to store refetch functions
type RefreshContextType = {
  registerRefetchFn: (fns: Array<() => Promise<any>>) => void;
  unregisterRefetchFn: (fns: Array<() => Promise<any>>) => void;
};

const RefreshContext = createContext<RefreshContextType | null>(null);

// Hook for components to register their refetch functions
export const useRegisterRefetch = (
  ...refetchFns: Array<() => Promise<any>>
) => {
  const context = useContext(RefreshContext);

  if (!context) {
    throw new Error(
      "useRegisterRefetch must be used within a RefreshScrollView"
    );
  }

  React.useEffect(() => {
    if (refetchFns.length > 0) {
      context.registerRefetchFn(refetchFns);
      return () => {
        context.unregisterRefetchFn(refetchFns);
      };
    }
  }, []);
};

// The main ScrollView wrapper component
type RefreshScrollViewProps = ScrollViewProps & {
  children: React.ReactNode;
};

export const RefreshScrollView = forwardRef<ScrollView, RefreshScrollViewProps>(
  ({ children, ...scrollViewProps }, ref) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refetchFns, setRefetchFns] = useState<Array<() => Promise<any>>>([]);

    const registerRefetchFn = useCallback((fns: Array<() => Promise<any>>) => {
      setRefetchFns((prev) => [...prev, ...fns]);
    }, []);

    const unregisterRefetchFn = useCallback(
      (fns: Array<() => Promise<any>>) => {
        setRefetchFns((prev) =>
          prev.filter((existingFn) => !fns.includes(existingFn))
        );
      },
      []
    );

    const onRefresh = useCallback(async () => {
      setIsRefreshing(true);
      try {
        await Promise.all(refetchFns.map((fn) => fn()));
      } finally {
        setIsRefreshing(false);
      }
    }, [refetchFns]);

    return (
      <RefreshContext.Provider
        value={{ registerRefetchFn, unregisterRefetchFn }}
      >
        <ScrollView
          ref={ref}
          {...scrollViewProps}
          refreshControl={
            <RefreshControl
              colors={["#29003d"]}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {children}
        </ScrollView>
      </RefreshContext.Provider>
    );
  }
);
