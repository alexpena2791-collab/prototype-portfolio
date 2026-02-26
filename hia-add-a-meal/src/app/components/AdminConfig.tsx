import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Settings, Save, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function AdminConfig() {
  const { discountConfig, updateDiscountConfig } = useApp();
  
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(discountConfig.discountType);
  const [discountValue, setDiscountValue] = useState(discountConfig.discountValue.toString());
  const [voyageLevel, setVoyageLevel] = useState("voyage-2026-march");

  const handleSave = () => {
    const config = {
      discountType,
      discountValue: parseFloat(discountValue),
    };

    updateDiscountConfig(config);
    toast.success("Configuration saved successfully! Changes will be reflected across all channels.");
  };

  const handleReset = () => {
    const defaultConfig = {
      discountType: "percentage" as const,
      discountValue: 20,
    };
    
    setDiscountType(defaultConfig.discountType);
    setDiscountValue(defaultConfig.discountValue.toString());
    updateDiscountConfig(defaultConfig);
    toast.info("Configuration reset to defaults");
  };

  const calculateExampleDiscount = () => {
    const basePrice = 85;
    if (discountType === "percentage") {
      return basePrice - (basePrice * parseFloat(discountValue || "0")) / 100;
    } else {
      return basePrice - parseFloat(discountValue || "0");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4 text-white hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-white">Admin Configuration Panel</h1>
              <p className="text-slate-300">Manage HIA specialty dining discount settings</p>
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-900 border-blue-700">
          <AlertDescription className="text-blue-100">
            <strong>Requirement 4:</strong> Configure discount type, value, and maximum discounted meals.
            Changes apply at voyage level and take effect immediately across all channels (SF, Mobile App, Phone agents).
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Voyage Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Voyage Selection</CardTitle>
                <CardDescription className="text-slate-300">
                  Select the voyage to configure discount settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-white">Voyage</Label>
                  <Select value={voyageLevel} onValueChange={setVoyageLevel}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voyage-2026-march">March 2026 Caribbean Cruise</SelectItem>
                      <SelectItem value="voyage-2026-april">April 2026 Mediterranean</SelectItem>
                      <SelectItem value="voyage-2026-may">May 2026 Alaska Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Discount Type */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Discount Type</CardTitle>
                <CardDescription className="text-slate-300">
                  Choose how the discount is calculated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={discountType} onValueChange={(value) => setDiscountType(value as "percentage" | "fixed")}>
                  <div className="flex items-center space-x-2 p-4 bg-slate-700 rounded-lg mb-3">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex-1 cursor-pointer text-white">
                      <div className="font-medium">Percentage Discount</div>
                      <div className="text-sm text-slate-300">Apply a percentage off the original price</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-slate-700 rounded-lg">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex-1 cursor-pointer text-white">
                      <div className="font-medium">Fixed Amount Discount</div>
                      <div className="text-sm text-slate-300">Apply a fixed dollar amount off the original price</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Discount Value */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Discount Value</CardTitle>
                <CardDescription className="text-slate-300">
                  Set the {discountType === "percentage" ? "percentage" : "amount"} to discount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-white">
                    {discountType === "percentage" ? "Percentage (%)" : "Amount ($)"}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white pr-8"
                        min="0"
                        max={discountType === "percentage" ? "100" : undefined}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {discountType === "percentage" ? "%" : "$"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    {discountType === "percentage" 
                      ? "Enter a value between 0-100"
                      : "Enter a dollar amount to discount"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
              <Button onClick={handleReset} variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Configuration Preview</CardTitle>
                <CardDescription className="text-slate-300">
                  How the discount will appear to guests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Current Settings</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Type:</span>
                      <span className="text-white font-medium">
                        {discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Value:</span>
                      <span className="text-white font-medium">
                        {discountType === "percentage" ? `${discountValue}%` : `$${discountValue}`}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div>
                  <p className="text-sm text-slate-400 mb-3">Example Pricing</p>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Prime Steakhouse</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-400">
                        ${calculateExampleDiscount().toFixed(2)}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        $85.00
                      </span>
                    </div>
                    <p className="text-xs text-green-400 mt-1">
                      Save ${(85 - calculateExampleDiscount()).toFixed(2)} with HIA discount
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div>
                  <p className="text-sm text-slate-400 mb-2">Guest Journey</p>
                  <ol className="space-y-2 text-xs text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-blue-400">1.</span>
                      <span>Guest books 1st meal FREE with HIA credit</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">2.</span>
                      <span>Guest becomes eligible for discount</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">3.</span>
                      <span>
                        Guest can book unlimited additional meals with {discountValue}
                        {discountType === "percentage" ? "%" : "$"} off
                      </span>
                    </li>
                  </ol>
                </div>

                <Alert className="bg-slate-900 border-slate-700">
                  <AlertDescription className="text-xs text-slate-300">
                    Changes apply immediately to all booking channels: SF, Mobile App, and Phone agents
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}