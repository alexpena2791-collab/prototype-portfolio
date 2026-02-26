import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ShoppingCart, Trash2, Tag, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function Cart() {
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get("scenario");
  const navigate = useNavigate();
  const { cartItems, removeFromCart, checkout, isEligibleForDiscount, discountConfig, usedHIAGuestIds } = useApp();

  // Demo scenarios - pre-populate cart
  useEffect(() => {
    if (scenario === "first-meal" && cartItems.length === 0) {
      // Simulate adding first meal with HIA credit
      const demoData = {
        id: "demo-first-meal",
        name: "La Cucina Italiana",
        description: "Authentic Italian cuisine featuring handmade pasta",
        price: 75,
        usedHIACredit: true,
        date: "2026-03-15",
        time: "19:00",
      };
      // We can't call addToCart here in the demo, but we'll show the UI
    } else if (scenario === "with-discount" && cartItems.length === 0) {
      // Show scenario with both first and discounted meal
    }
  }, [scenario, cartItems.length]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Calculate price per guest
      const itemTotal = item.selectedGuests.reduce((guestTotal, guest) => {
        if (guest.useHIACredit) {
          return guestTotal + 0; // Free with HIA credit
        }
        return guestTotal + (item.price / item.selectedGuests.length); // Split price evenly if no individual pricing
      }, 0);
      return total + itemTotal;
    }, 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((savings, item) => {
      // Calculate savings from HIA credits
      const hiaCreditsUsed = item.selectedGuests.filter(g => g.useHIACredit).length;
      const hiaSavings = hiaCreditsUsed * (item.price / item.selectedGuests.length);
      
      // Calculate savings from discounts
      let discountSavings = 0;
      if (item.isDiscounted && item.discountedPrice) {
        discountSavings = item.price - item.discountedPrice;
      }
      
      return savings + hiaSavings + discountSavings;
    }, 0);
  };

  const handleCheckout = () => {
    checkout();
    toast.success("Reservations confirmed!");
    navigate("/reservations");
  };

  const hasFirstMealInCart = cartItems.some((item) => item.usedHIACredit);
  const showDiscountNotification = hasFirstMealInCart && isEligibleForDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/browse">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            <h1>Your Cart</h1>
          </div>
        </div>

        {/* Demo Scenario Badges */}
        {scenario && (
          <div className="mb-6">
            {scenario === "first-meal" && (
              <Badge className="bg-blue-600">Demo: First Meal Added</Badge>
            )}
            {scenario === "with-discount" && (
              <Badge className="bg-purple-600">Demo: With Discounted Meal</Badge>
            )}
          </div>
        )}

        {/* Discount Notification - Requirement 2 */}
        {showDiscountNotification && (
          <Alert className="mb-6 border-green-600 bg-green-50">
            <Tag className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-900">Great News! You've Unlocked a Discount</AlertTitle>
            <AlertDescription className="text-green-700">
              Since you've used your HIA dining credit, you're now eligible for{" "}
              <strong>
                {discountConfig.discountValue}
                {discountConfig.discountType === "percentage" ? "%" : "$"} off
              </strong>{" "}
              all additional specialty meals! Add another dinner to your cart to save.
            </AlertDescription>
            <div className="mt-3">
              <Link to="/browse?step=second">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Add Another Dinner
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 && scenario === "first-meal" ? (
              // Demo scenario for first meal
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>La Cucina Italiana</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          HIA Credit
                        </Badge>
                      </div>
                      <CardDescription>
                        Authentic Italian cuisine featuring handmade pasta
                      </CardDescription>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p>March 15, 2026 at 7:00 PM • 2 Guests</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold text-blue-600">$0.00</p>
                        <p className="text-sm text-muted-foreground line-through">$75.00</p>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">Free with HIA credit</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : cartItems.length === 0 && scenario === "with-discount" ? (
              // Demo scenario with discount
              <>
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>La Cucina Italiana</CardTitle>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            HIA Credit
                          </Badge>
                        </div>
                        <CardDescription>
                          Authentic Italian cuisine featuring handmade pasta
                        </CardDescription>
                        <div className="mt-3 text-sm text-muted-foreground">
                          <p>March 15, 2026 at 7:00 PM • 2 Guests</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-bold text-blue-600">$0.00</p>
                          <p className="text-sm text-muted-foreground line-through">$75.00</p>
                        </div>
                        <p className="text-xs text-blue-600 font-medium">Free with HIA credit</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirement 3: Show original and discounted price */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>Prime Steakhouse</CardTitle>
                          <Badge className="bg-green-600">20% OFF</Badge>
                        </div>
                        <CardDescription>
                          Premium cuts of beef with classic sides and fine wine
                        </CardDescription>
                        <div className="mt-3 text-sm text-muted-foreground">
                          <p>March 16, 2026 at 8:00 PM • 2 Guests</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-green-700">$68.00</p>
                          <p className="text-sm text-muted-foreground line-through">$85.00</p>
                        </div>
                        <p className="text-xs text-green-600 font-medium">
                          You save $17.00 with HIA discount
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : cartItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Link to="/browse?step=first">
                    <Button>Browse Specialty Dining</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              // Actual cart items
              cartItems.map((item) => (
                <Card 
                  key={item.id}
                  className={item.isDiscounted ? "border-green-200 bg-green-50/50" : ""}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{item.name}</CardTitle>
                          {item.usedHIACredit && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              HIA Credit
                            </Badge>
                          )}
                          {item.isDiscounted && (
                            <Badge className="bg-green-600">
                              {discountConfig.discountValue}
                              {discountConfig.discountType === "percentage" ? "%" : "$"} OFF
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                        <div className="mt-3 text-sm text-muted-foreground space-y-1">
                          <p>{item.date} at {item.time}</p>
                          <div className="mt-2">
                            <p className="font-medium text-slate-700">Guests:</p>
                            <div className="ml-2 space-y-1 mt-1">
                              {item.selectedGuests.map((guest) => {
                                // Calculate price for this guest
                                const isUsingHIAFirstTime = guest.useHIACredit && !usedHIAGuestIds.includes(guest.id);
                                const hasUsedHIAPreviously = usedHIAGuestIds.includes(guest.id) && !guest.useHIACredit;
                                
                                let guestPrice = item.price;
                                let originalGuestPrice = item.price;
                                
                                if (isUsingHIAFirstTime) {
                                  guestPrice = 0;
                                } else if (hasUsedHIAPreviously) {
                                  // Apply discount
                                  const discountAmount = discountConfig.discountType === "percentage"
                                    ? (item.price * discountConfig.discountValue) / 100
                                    : discountConfig.discountValue;
                                  guestPrice = item.price - discountAmount;
                                }
                                
                                return (
                                  <div key={guest.id} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2">
                                      <span>{guest.name}</span>
                                      {guest.useHIACredit && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                          <Tag className="w-2.5 h-2.5 mr-1" />
                                          HIA
                                        </Badge>
                                      )}
                                      {hasUsedHIAPreviously && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                          {discountConfig.discountType === "percentage" ? `${discountConfig.discountValue}%` : `$${discountConfig.discountValue}`} off
                                        </Badge>
                                      )}
                                    </span>
                                    {isUsingHIAFirstTime ? (
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground line-through text-xs">${originalGuestPrice.toFixed(2)}</span>
                                        <span className="text-blue-600 font-semibold">$0.00</span>
                                      </div>
                                    ) : hasUsedHIAPreviously ? (
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground line-through text-xs">${originalGuestPrice.toFixed(2)}</span>
                                        <span className="text-green-600 font-semibold">${guestPrice.toFixed(2)}</span>
                                      </div>
                                    ) : (
                                      <span className="font-semibold">${guestPrice.toFixed(2)}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {(() => {
                          // Calculate total for this dinner
                          const dinnerTotal = item.selectedGuests.reduce((total, guest) => {
                            const isUsingHIAFirstTime = guest.useHIACredit;
                            
                            if (isUsingHIAFirstTime) {
                              return total + 0;
                            }
                            return total + item.price;
                          }, 0);
                          
                          const dinnerOriginalTotal = item.selectedGuests.length * item.price;
                          const hasSavings = dinnerTotal < dinnerOriginalTotal;
                          
                          return (
                            <>
                              <p className="text-xs text-slate-600 mb-1">Total for this dinner:</p>
                              <div className="flex items-center gap-3">
                                {hasSavings && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${dinnerOriginalTotal.toFixed(2)}
                                  </span>
                                )}
                                <span className={`text-2xl font-bold ${dinnerTotal === 0 ? 'text-blue-600' : hasSavings ? 'text-green-600' : ''}`}>
                                  ${dinnerTotal.toFixed(2)}
                                </span>
                              </div>
                              {dinnerTotal === 0 && (
                                <p className="text-xs text-blue-600 font-medium">Free with HIA credit</p>
                              )}
                              {hasSavings && dinnerTotal > 0 && (
                                <p className="text-xs text-green-600 font-medium">
                                  You save ${(dinnerOriginalTotal - dinnerTotal).toFixed(2)}
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scenario === "first-meal" || (cartItems.length === 0 && !scenario) ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>$75.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>HIA Credit Applied</span>
                      <span>-$75.00</span>
                    </div>
                  </>
                ) : scenario === "with-discount" && cartItems.length === 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal (2 meals)</span>
                      <span>$160.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>HIA Credit Applied</span>
                      <span>-$75.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>HIA Discount (20%)</span>
                      <span>-$17.00</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    {calculateSavings() > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Total Savings</span>
                        <span>-${calculateSavings().toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {scenario === "first-meal" || (cartItems.length === 0 && !scenario) 
                      ? "$0.00"
                      : scenario === "with-discount" && cartItems.length === 0
                      ? "$68.00"
                      : `$${calculateTotal().toFixed(2)}`}
                  </span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 && !scenario}
                >
                  Proceed to Checkout
                </Button>

                {isEligibleForDiscount() && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Add another specialty meal to use your available discount
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}