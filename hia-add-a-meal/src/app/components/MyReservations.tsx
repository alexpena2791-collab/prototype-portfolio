import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calendar, CheckCircle2, XCircle, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function MyReservations() {
  const { reservations, cancelReservation, discountConfig } = useApp();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showReeligibilityMessage, setShowReeligibilityMessage] = useState(false);
  const [demoReservations, setDemoReservations] = useState([
    {
      id: "demo-1",
      name: "La Cucina Italiana",
      description: "Authentic Italian cuisine featuring handmade pasta",
      price: 75,
      usedHIACredit: true,
      date: "Day 1 - Sunday, March 15",
      time: "7:00 PM",
      selectedGuests: [
        { id: "g1", name: "Sarah Johnson", type: "adult" as const, useHIACredit: true },
        { id: "g2", name: "Michael Johnson", type: "adult" as const, useHIACredit: false },
      ],
    },
    {
      id: "demo-2",
      name: "Prime Steakhouse",
      description: "Premium cuts of beef with classic sides",
      price: 85,
      discountedPrice: 68,
      isDiscounted: true,
      date: "Day 2 - Monday, March 16",
      time: "8:00 PM",
      selectedGuests: [
        { id: "g1", name: "Sarah Johnson", type: "adult" as const, useHIACredit: false },
        { id: "g2", name: "Michael Johnson", type: "adult" as const, useHIACredit: false },
        { id: "g3", name: "Emma Johnson", type: "child" as const, useHIACredit: false },
      ],
    },
  ]);

  const allReservations = [...reservations, ...demoReservations];

  const handleCancelReservation = (id: string) => {
    const reservation = reservations.find((r) => r.id === id);
    
    if (reservation) {
      // Check if any guest used HIA credit
      const guestsWithHIA = reservation.selectedGuests.filter(g => g.useHIACredit);
      
      cancelReservation(id);
      setCancellingId(null);
      
      if (guestsWithHIA.length > 0) {
        const guestNames = guestsWithHIA.map(g => g.name).join(", ");
        toast.success(`Reservation cancelled! HIA credit restored for: ${guestNames}`);
      } else if (reservation.isDiscounted) {
        toast.success(`Reservation cancelled! You're eligible for the HIA discount again.`);
        setShowReeligibilityMessage(true);
      } else {
        toast.success("Reservation cancelled!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <h1>My Reservations</h1>
          </div>
        </div>

        {/* Re-eligibility Message - Requirement 5 */}
        {showReeligibilityMessage && (
          <Alert className="mb-6 border-green-600 bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-900">Discount Re-activated!</AlertTitle>
            <AlertDescription className="text-green-700">
              Since you've cancelled your discounted specialty dinner, you're now eligible again to receive a{" "}
              <strong>
                {discountConfig.discountValue}
                {discountConfig.discountType === "percentage" ? "%" : "$"} discount
              </strong>{" "}
              on another specialty meal. Browse dining options to book again!
            </AlertDescription>
            <div className="mt-3">
              <Link to="/browse?step=second">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Browse Specialty Dining
                </Button>
              </Link>
            </div>
          </Alert>
        )}

        {/* Demo Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Demo Scenario</CardTitle>
            <CardDescription>
              This shows a guest with one HIA credit meal and one discounted meal. 
              Try cancelling the discounted meal to see the refund and re-eligibility flow.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Reservations List */}
        <div className="space-y-4">
          {allReservations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No reservations yet</p>
                <Link to="/browse?step=first">
                  <Button>Browse Specialty Dining</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            allReservations.map((reservation) => (
              <Card 
                key={reservation.id}
                className={reservation.isDiscounted ? "border-green-200" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{reservation.name}</CardTitle>
                        {reservation.usedHIACredit && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            HIA Credit
                          </Badge>
                        )}
                        {reservation.isDiscounted && (
                          <Badge className="bg-green-600">
                            Discounted
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{reservation.description}</CardDescription>
                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <p>{reservation.date} at {reservation.time}</p>
                        <div className="mt-2">
                          <p className="font-medium text-slate-700">Guests:</p>
                          <div className="ml-2 space-y-1 mt-1">
                            {reservation.selectedGuests.map((guest) => (
                              <div key={guest.id} className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2">
                                  <span>{guest.name}</span>
                                  {guest.useHIACredit && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      <Tag className="w-2.5 h-2.5 mr-1" />
                                      HIA
                                    </Badge>
                                  )}
                                </span>
                                {guest.useHIACredit ? (
                                  <span className="text-blue-600 font-semibold">$0.00</span>
                                ) : (
                                  <span>${reservation.price.toFixed(2)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Confirmed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{reservation.date} at {reservation.time}</span>
                      </div>
                      
                      <div className="space-y-1">
                        {reservation.usedHIACredit ? (
                          <>
                            <div className="flex items-center gap-3">
                              <p className="text-2xl font-bold text-blue-600">$0.00</p>
                              <p className="text-sm text-muted-foreground line-through">
                                ${reservation.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-blue-600">Free with HIA credit</p>
                          </>
                        ) : reservation.isDiscounted && reservation.discountedPrice ? (
                          <>
                            <div className="flex items-center gap-3">
                              <p className="font-bold text-green-700">
                                ${reservation.discountedPrice.toFixed(2)} paid
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                ${reservation.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-green-600">
                              HIA discount applied • Saved ${(reservation.price - reservation.discountedPrice).toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium">${reservation.price.toFixed(2)}</p>
                        )}
                      </div>

                      {/* Refund information */}
                      {reservation.isDiscounted && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Refund amount if cancelled: ${(reservation.discountedPrice ?? reservation.price).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setCancellingId(reservation.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Cancellation Confirmation Dialog */}
        <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
              <AlertDialogDescription>
                {(() => {
                  const reservation = allReservations.find((r) => r.id === cancellingId);
                  if (!reservation) return null;

                  const refundAmount = reservation.discountedPrice ?? reservation.price;

                  return (
                    <div className="space-y-3 mt-2">
                      <p>
                        You're about to cancel your reservation for <strong>{reservation.name}</strong> on {reservation.date}.
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 text-blue-900">
                          <CheckCircle2 className="w-4 h-4" />
                          <p className="font-medium">Refund: ${refundAmount.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-blue-700">
                          {reservation.isDiscounted 
                            ? "You'll be refunded the discounted amount you paid."
                            : "You'll be refunded the full amount."}
                        </p>
                      </div>

                      {reservation.isDiscounted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-green-900">
                            <CheckCircle2 className="w-4 h-4" />
                            <p className="font-medium">Discount Re-activated</p>
                          </div>
                          <p className="text-sm text-green-700">
                            You'll become eligible for the HIA discount again and can apply it to another specialty meal.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => cancellingId && handleCancelReservation(cancellingId)}
              >
                Cancel Reservation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}