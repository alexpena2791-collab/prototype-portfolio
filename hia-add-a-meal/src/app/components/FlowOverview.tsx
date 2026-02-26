import { Link } from "react-router";
import { ArrowRight, ShoppingCart, Utensils, Settings, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function FlowOverview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-600">HIA Specialty Dining Flow</Badge>
          <h1 className="mb-4">HIA Specialty Dining Discount User Flow</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            An interactive demonstration of the guest journey for specialty dining discounts with HIA credits.
            Explore each step to see how guests discover, book, and manage their discounted specialty meals.
          </p>
        </div>

        {/* Requirements Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-12">
          {[
            { num: 1, title: "Discount Eligibility", desc: "After booking first meal with HIA credit" },
            { num: 2, title: "Discount Notification", desc: "Informed when discount becomes available" },
            { num: 3, title: "Price Transparency", desc: "See original and discounted prices" },
            { num: 4, title: "Business Controls", desc: "Configurable discount settings" },
            { num: 5, title: "Cancellation & Re-eligibility", desc: "Refund and regain discount eligibility" },
          ].map((req) => (
            <Card key={req.num} className="bg-white/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-2">
                  {req.num}
                </div>
                <CardTitle className="text-sm">{req.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{req.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Journey Flow */}
        <div className="space-y-6">
          <h2 className="text-center">Guest Journey</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Browse Dining */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <Utensils className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>Browse Specialty Dining</CardTitle>
                <CardDescription>
                  Guest explores specialty dining options and selects first meal using HIA credit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/browse?step=first">
                  <Button className="w-full" variant="outline">
                    View Flow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 2: First Meal in Cart */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>Cart with Notification</CardTitle>
                <CardDescription>
                  Guest sees discount notification after adding first meal to cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/cart?scenario=first-meal">
                  <Button className="w-full" variant="outline">
                    View Flow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 3: Discounted Meal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle>Discounted Pricing</CardTitle>
                <CardDescription>
                  Guest adds discounted meal and sees original vs. discounted price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/cart?scenario=with-discount">
                  <Button className="w-full" variant="outline">
                    View Flow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 4: Manage Reservations */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle>Cancellation Flow</CardTitle>
                <CardDescription>
                  Guest cancels discounted meal and regains discount eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/reservations">
                  <Button className="w-full" variant="outline">
                    View Flow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-6 h-6" />
                <CardTitle className="text-white">Business Configuration Panel</CardTitle>
              </div>
              <CardDescription className="text-slate-200">
                Configure discount type, value, and maximum discounted meals per voyage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">
                  Open Admin Panel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Multi-Channel Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consistent experience across Salesforce, Mobile App, and Phone Agent tools
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Real-time Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dynamic tracking of discount usage and eligibility across all touchpoints
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Voyage-level Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Business users can adjust discount settings without code changes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}