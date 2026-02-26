import { createContext, useContext, useState, ReactNode } from "react";

export interface Guest {
  id: string;
  name: string;
  type: "adult" | "child";
  useHIACredit?: boolean;
}

export interface SpecialtyMeal {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  isDiscounted?: boolean;
  usedHIACredit?: boolean;
  date: string;
  time: string;
  selectedGuests: Guest[];
  originalPrice?: number;
}

export type CartItem = SpecialtyMeal;
export type Reservation = SpecialtyMeal;

export interface DiscountConfig {
  discountType: "percentage" | "fixed";
  discountValue: number;
}

interface AppContextType {
  cartItems: CartItem[];
  reservations: Reservation[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
  cancelReservation: (id: string) => void;
  discountConfig: DiscountConfig;
  updateDiscountConfig: (config: DiscountConfig) => void;
  isEligibleForDiscount: () => boolean;
  usedHIAGuestIds: string[]; // Track which guests have used HIA credit
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [discountConfig, setDiscountConfig] = useState<DiscountConfig>({
    discountType: "percentage",
    discountValue: 20,
  });
  const [usedHIAGuestIds, setUsedHIAGuestIds] = useState<string[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    
    // Mark guests who used HIA credits as having used them
    const guestsUsingHIA = item.selectedGuests
      .filter(g => g.useHIACredit)
      .map(g => g.id);
    
    if (guestsUsingHIA.length > 0) {
      setUsedHIAGuestIds((prev) => [...new Set([...prev, ...guestsUsingHIA])]);
    }
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    
    if (itemToRemove) {
      // Restore HIA credits for guests who used them in this item
      const guestsToRestore = itemToRemove.selectedGuests
        .filter(g => g.useHIACredit)
        .map(g => g.id);
      
      if (guestsToRestore.length > 0) {
        setUsedHIAGuestIds((prev) => prev.filter(id => !guestsToRestore.includes(id)));
      }
    }
    
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const checkout = () => {
    setReservations((prev) => [...prev, ...cartItems]);
    setCartItems([]);
  };

  const cancelReservation = (id: string) => {
    const reservationToCancel = reservations.find(item => item.id === id);
    
    if (reservationToCancel) {
      // Restore HIA credits for guests who used them in this reservation
      const guestsToRestore = reservationToCancel.selectedGuests
        .filter(g => g.useHIACredit)
        .map(g => g.id);
      
      if (guestsToRestore.length > 0) {
        setUsedHIAGuestIds((prev) => prev.filter(id => !guestsToRestore.includes(id)));
      }
    }
    
    setReservations((prev) => prev.filter((item) => item.id !== id));
  };

  const updateDiscountConfig = (config: DiscountConfig) => {
    setDiscountConfig(config);
  };

  const isEligibleForDiscount = () => {
    // Check if user has booked first meal with HIA credit
    const hasFirstMealWithCredit = 
      cartItems.some((item) => item.usedHIACredit) ||
      reservations.some((item) => item.usedHIACredit);
    
    return hasFirstMealWithCredit;
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        reservations,
        addToCart,
        removeFromCart,
        checkout,
        cancelReservation,
        discountConfig,
        updateDiscountConfig,
        isEligibleForDiscount,
        usedHIAGuestIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}