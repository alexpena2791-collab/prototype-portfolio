import { useState } from "react";
import { X, Calendar, Clock, Users, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Guest } from "../context/AppContext";
import { useApp } from "../context/AppContext";

interface BookingSelectionDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  restaurantName?: string;
  meal: { id: string; name: string; description: string; originalPrice: number; image: string } | null;
  useHIACredit: boolean;
  onConfirm: (selectedGuests: Guest[], date: string, time: string) => void;
}

// Mock booking party data
const BOOKING_GUESTS: Guest[] = [
  { id: "g1", name: "Sarah Johnson", type: "adult" },
  { id: "g2", name: "Michael Johnson", type: "adult" },
  { id: "g3", name: "Emma Johnson", type: "child" },
  { id: "g4", name: "Oliver Johnson", type: "child" },
];

// Cruise dates (7-day cruise)
const CRUISE_DATES = [
  { value: "2026-03-15", label: "Day 1 - Sunday, March 15" },
  { value: "2026-03-16", label: "Day 2 - Monday, March 16" },
  { value: "2026-03-17", label: "Day 3 - Tuesday, March 17" },
  { value: "2026-03-18", label: "Day 4 - Wednesday, March 18" },
  { value: "2026-03-19", label: "Day 5 - Thursday, March 19" },
  { value: "2026-03-20", label: "Day 6 - Friday, March 20" },
  { value: "2026-03-21", label: "Day 7 - Saturday, March 21" },
];

const DINING_TIMES = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

export function BookingSelectionDialog({
  open,
  onClose,
  restaurantName,
  meal,
  useHIACredit,
  onConfirm,
}: BookingSelectionDialogProps) {
  const { usedHIAGuestIds, discountConfig } = useApp();
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>(["g1", "g2"]);
  const [guestHIACredits, setGuestHIACredits] = useState<Record<string, boolean>>(() => {
    // Initialize with HIA credit enabled by default for guests who haven't used it
    const initial: Record<string, boolean> = {};
    BOOKING_GUESTS.forEach(guest => {
      initial[guest.id] = !usedHIAGuestIds.includes(guest.id);
    });
    return initial;
  });
  const [selectedDate, setSelectedDate] = useState(CRUISE_DATES[0].value);
  const [selectedTime, setSelectedTime] = useState("7:00 PM");

  const toggleGuest = (guestId: string) => {
    setSelectedGuestIds((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    );
  };

  const toggleHIACredit = (guestId: string) => {
    setGuestHIACredits((prev) => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  const handleConfirm = () => {
    const guests = BOOKING_GUESTS.filter((g) => selectedGuestIds.includes(g.id)).map(g => ({
      ...g,
      useHIACredit: guestHIACredits[g.id] || false,
    }));
    const dateLabel = CRUISE_DATES.find((d) => d.value === selectedDate)?.label || selectedDate;
    onConfirm(guests, dateLabel, selectedTime);
    onClose(false);
  };

  const selectedGuests = BOOKING_GUESTS.filter((g) => selectedGuestIds.includes(g.id));
  const guestsWithHIACredit = selectedGuests.filter(g => guestHIACredits[g.id]);
  
  // Calculate total price
  const totalPrice = meal ? selectedGuests.reduce((total, guest) => {
    const hasUsedCredit = usedHIAGuestIds.includes(guest.id);
    const usingHIACredit = guestHIACredits[guest.id];
    
    if (usingHIACredit && !hasUsedCredit) {
      return total + 0; // HIA credit = free
    } else if (hasUsedCredit) {
      // Apply discount for guests who already used their credit
      const discountAmount = discountConfig.discountType === "percentage"
        ? (meal.originalPrice * discountConfig.discountValue) / 100
        : discountConfig.discountValue;
      return total + (meal.originalPrice - discountAmount);
    }
    return total + meal.originalPrice;
  }, 0) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {meal && <div className="text-4xl">{meal.image}</div>}
            <div className="flex-1">
              <DialogTitle>Complete Your Reservation</DialogTitle>
              <DialogDescription>
                {meal ? meal.name : restaurantName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Pricing Summary */}
        {meal && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Price per person</p>
                {useHIACredit ? (
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-blue-600">$0.00</p>
                    <p className="text-sm text-muted-foreground line-through">
                      ${meal.originalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">${meal.originalPrice.toFixed(2)}</p>
                )}
              </div>
              {useHIACredit && (
                <Badge className="bg-blue-600">
                  <Tag className="w-3 h-3 mr-1" />
                  HIA Credit
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Guest Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              <Label className="text-base">Select Guests & HIA Credits</Label>
            </div>
            <div className="space-y-2 pl-7">
              {BOOKING_GUESTS.map((guest) => {
                const isSelected = selectedGuestIds.includes(guest.id);
                const hasHIACredit = guestHIACredits[guest.id];
                const hasUsedCredit = usedHIAGuestIds.includes(guest.id);
                
                // Calculate discount for guests who already used their credit
                const discountAmount = hasUsedCredit && meal
                  ? discountConfig.discountType === "percentage"
                    ? (meal.originalPrice * discountConfig.discountValue) / 100
                    : discountConfig.discountValue
                  : 0;
                
                const discountedPrice = hasUsedCredit && meal
                  ? meal.originalPrice - discountAmount
                  : meal?.originalPrice || 0;
                
                return (
                  <div
                    key={guest.id}
                    className={`rounded-lg border transition-colors ${
                      isSelected 
                        ? hasHIACredit
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-300 bg-slate-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3 p-3">
                      <Checkbox
                        id={guest.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleGuest(guest.id)}
                      />
                      <label
                        htmlFor={guest.id}
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{guest.name}</span>
                          {hasUsedCredit && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                              {discountConfig.discountType === "percentage"
                                ? `${discountConfig.discountValue}% off`
                                : `$${discountConfig.discountValue} off`}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 capitalize">
                          {guest.type}
                        </span>
                      </label>
                    </div>
                    
                    {/* HIA Credit Toggle - only show when guest is selected */}
                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {hasUsedCredit ? (
                              <div className="text-sm text-slate-600 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>HIA credit already used - {discountConfig.discountType === "percentage" ? `${discountConfig.discountValue}%` : `$${discountConfig.discountValue}`} discount applied</span>
                              </div>
                            ) : (
                              <>
                                <Checkbox
                                  id={`hia-${guest.id}`}
                                  checked={hasHIACredit}
                                  onCheckedChange={() => toggleHIACredit(guest.id)}
                                />
                                <label
                                  htmlFor={`hia-${guest.id}`}
                                  className="text-sm flex items-center gap-2 cursor-pointer"
                                >
                                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                                  Use HIA Credit
                                </label>
                              </>
                            )}
                          </div>
                          {meal && (
                            <div className="text-sm">
                              {hasUsedCredit ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground line-through text-xs">
                                    ${meal.originalPrice.toFixed(2)}
                                  </span>
                                  <span className="font-semibold text-green-600">${discountedPrice.toFixed(2)}</span>
                                </div>
                              ) : hasHIACredit ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground line-through text-xs">
                                    ${meal.originalPrice.toFixed(2)}
                                  </span>
                                  <span className="font-semibold text-blue-600">$0.00</span>
                                </div>
                              ) : (
                                <span className="font-medium">${meal.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="pl-7 space-y-1">
              <p className="text-sm text-slate-600">
                {selectedGuests.length} guest{selectedGuests.length !== 1 ? "s" : ""} selected
                {guestsWithHIACredit.length > 0 && (
                  <span className="text-blue-600 ml-1">
                    • {guestsWithHIACredit.length} using HIA credit
                  </span>
                )}
              </p>
              {meal && selectedGuests.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-xl font-bold">
                    ${totalPrice.toFixed(2)}
                  </span>
                  {guestsWithHIACredit.length > 0 && (
                    <span className="text-sm text-green-600">
                      (Saved ${(guestsWithHIACredit.length * meal.originalPrice).toFixed(2)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-600" />
              <Label className="text-base">Select Date</Label>
            </div>
            <RadioGroup value={selectedDate} onValueChange={setSelectedDate} className="pl-7">
              {CRUISE_DATES.map((date) => (
                <div key={date.value} className="flex items-center space-x-3 p-2">
                  <RadioGroupItem value={date.value} id={date.value} />
                  <Label htmlFor={date.value} className="cursor-pointer flex-1">
                    {date.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              <Label className="text-base">Select Time</Label>
            </div>
            <div className="grid grid-cols-3 gap-2 pl-7">
              {DINING_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedGuestIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add to Cart ({selectedGuests.length} guest{selectedGuests.length !== 1 ? "s" : ""})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}