import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Clock, Users, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useApp } from "../context/AppContext";
import { BookingSelectionDialog } from "./BookingSelectionDialog";
import { Guest } from "../context/AppContext";
import { toast } from "sonner";

const SPECIALTY_MEALS = [
  {
    id: "italian-1",
    name: "La Cucina Italiana",
    description: "Authentic Italian cuisine featuring handmade pasta and fresh ingredients",
    originalPrice: 75,
    image: "🍝",
  },
  {
    id: "steakhouse-1",
    name: "Prime Steakhouse",
    description: "Premium cuts of beef with classic sides and fine wine selection",
    originalPrice: 85,
    image: "🥩",
  },
  {
    id: "seafood-1",
    name: "Ocean's Bounty",
    description: "Fresh seafood and coastal cuisine with stunning ocean views",
    originalPrice: 80,
    image: "🦞",
  },
  {
    id: "asian-1",
    name: "Zen Garden",
    description: "Contemporary Asian fusion with traditional flavors and modern presentation",
    originalPrice: 70,
    image: "🍱",
  },
];

export function BrowseDining() {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");
  const { addToCart, isEligibleForDiscount, discountConfig } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<typeof SPECIALTY_MEALS[0] | null>(null);
  const [useHIACredit, setUseHIACredit] = useState(false);

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (discountConfig.discountType === "percentage") {
      return originalPrice - (originalPrice * discountConfig.discountValue) / 100;
    } else {
      return originalPrice - discountConfig.discountValue;
    }
  };

  const handleOpenDialog = (meal: typeof SPECIALTY_MEALS[0], useCredit: boolean) => {
    setSelectedMeal(meal);
    setUseHIACredit(useCredit);
    setDialogOpen(true);
  };

  const handleConfirmBooking = (selectedGuests: Guest[], date: string, time: string) => {
    if (!selectedMeal) return;

    const eligible = isEligibleForDiscount();
    
    // Calculate total price based on individual guest HIA credits
    const totalGuestPrice = selectedGuests.reduce((total, guest) => {
      if (guest.useHIACredit) {
        return total + 0; // HIA credit = free
      }
      return total + selectedMeal.originalPrice;
    }, 0);

    // Check if any guest used HIA credit
    const anyGuestUsedHIA = selectedGuests.some(g => g.useHIACredit);
    
    addToCart({
      id: `${selectedMeal.id}-${Date.now()}`,
      name: selectedMeal.name,
      description: selectedMeal.description,
      price: totalGuestPrice,
      discountedPrice: eligible && !anyGuestUsedHIA ? calculateDiscountedPrice(totalGuestPrice) : undefined,
      isDiscounted: eligible && !anyGuestUsedHIA,
      usedHIACredit: anyGuestUsedHIA,
      date: date,
      time: time,
      selectedGuests: selectedGuests,
    });

    const guestsWithHIA = selectedGuests.filter(g => g.useHIACredit).length;
    
    if (guestsWithHIA > 0) {
      toast.success(`${selectedMeal.name} added to cart with ${guestsWithHIA} HIA credit${guestsWithHIA > 1 ? 's' : ''} applied`);
    } else if (eligible) {
      toast.success(`${selectedMeal.name} added to cart with HIA discount!`);
    } else {
      toast.success(`${selectedMeal.name} added to cart`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2">Specialty Dining</h1>
              <p className="text-muted-foreground">
                {step === "first" 
                  ? "Select your first specialty meal and use your HIA credit" 
                  : "Browse and select additional specialty dining options"}
              </p>
            </div>
            <Link to="/cart">
              <Button>
                View Cart
              </Button>
            </Link>
          </div>
        </div>

        {/* HIA Credit Notice */}
        {step === "first" && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <CardTitle>HIA Dining Credit Available</CardTitle>
              </div>
              <CardDescription>
                You have an HIA dining credit available. Book your first specialty meal FREE to unlock discounts on all additional meals!
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Discount Eligibility Notice */}
        {isEligibleForDiscount() && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                <CardTitle className="text-green-900">Discount Available!</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                You're eligible for {discountConfig.discountValue}
                {discountConfig.discountType === "percentage" ? "%" : "$"} off all additional specialty meals.
                Select a restaurant below to apply your discount.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Restaurant Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">March 15, 2026 at 7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">2 Guests</span>
            </div>
          </div>
        </div>

        {/* Specialty Restaurants */}
        <div className="grid md:grid-cols-2 gap-6">
          {SPECIALTY_MEALS.map((meal) => {
            const eligible = isEligibleForDiscount();
            const discountedPrice = eligible ? calculateDiscountedPrice(meal.originalPrice) : null;

            return (
              <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{meal.image}</div>
                    {eligible && (
                      <Badge className="bg-green-600">
                        {discountConfig.discountValue}
                        {discountConfig.discountType === "percentage" ? "%" : "$"} OFF
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{meal.name}</CardTitle>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {eligible && discountedPrice ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${meal.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-green-600">HIA Discount Applied</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold">
                          ${meal.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground"> per person</span>
                      </div>
                    )}
                  </div>

                  {step === "first" ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handleOpenDialog(meal, true)}
                    >
                      Book with HIA Credit
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      variant={eligible ? "default" : "outline"}
                      onClick={() => handleOpenDialog(meal, false)}
                    >
                      {eligible ? "Add with Discount" : "Add to Cart"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <BookingSelectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmBooking}
        meal={selectedMeal}
        useHIACredit={useHIACredit}
      />
    </div>
  );
}