import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import type { Order } from "@/lib/api";

interface AddressUploadProps {
  addresses: string[];
  orders: Order[];
  onAddressesChange: (addresses: string[]) => void;
  onOrdersChange?: (orders: Order[]) => void;
}

export const AddressUpload = ({ addresses, orders, onAddressesChange, onOrdersChange }: AddressUploadProps) => {
  const [textInput, setTextInput] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) return;

        // Check if first line is a CSV header
        const firstLine = lines[0];
        const isCSV = firstLine.includes(',');
        
        if (isCSV) {
          // Parse CSV with headers
          const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
          const hasCoordinates = headers.includes('lat') && headers.includes('lng');
          
          const parsedOrders: Order[] = lines.slice(1).map((line, idx) => {
            const values = line.split(',').map(v => v.trim());
            const record: Record<string, string> = {};
            headers.forEach((header, i) => {
              record[header] = values[i] || '';
            });
            
            return {
              id: record['id'] || `order_${idx + 1}`,
              address: record['address'] || '',
              lat: hasCoordinates ? parseFloat(record['lat']) : 0,
              lng: hasCoordinates ? parseFloat(record['lng']) : 0,
            };
          }).filter(o => o.address); // Filter out empty rows
          
          if (hasCoordinates && parsedOrders.length > 0) {
            // CSV has coordinates - use Orders directly
            onOrdersChange?.(parsedOrders);
            onAddressesChange([...addresses, ...parsedOrders.map(o => o.address)]);
          } else {
            // CSV is just addresses - add as strings
            onAddressesChange([...addresses, ...lines.slice(1)]);
          }
        } else {
          // Plain text addresses
          onAddressesChange([...addresses, ...lines]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddFromText = () => {
    if (textInput.trim()) {
      const lines = textInput.split('\n').filter(line => line.trim());
      onAddressesChange([...addresses, ...lines]);
      setTextInput("");
    }
  };

  const handleRemoveAddress = (index: number) => {
    onAddressesChange(addresses.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    onAddressesChange([]);
  };

  return (
    <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Address Data</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">{addresses.length} addresses</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" className="w-full gap-2 cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Upload CSV/TXT
              </span>
            </Button>
          </label>
        </div>
        
        <div className="space-y-2">
          <Textarea
            placeholder="Or paste addresses (one per line)..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[80px] resize-none bg-secondary/50"
          />
          <Button onClick={handleAddFromText} size="sm" className="w-full">
            Add Addresses
          </Button>
        </div>

        {addresses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Loaded Addresses</span>
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-destructive hover:text-destructive">
                Clear All
              </Button>
            </div>
            <div className="max-h-[150px] overflow-y-auto space-y-1 pr-2">
              {addresses.slice(0, 10).map((addr, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-secondary/30 text-sm">
                  <span className="truncate flex-1 mr-2">{addr}</span>
                  <button onClick={() => handleRemoveAddress(idx)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {addresses.length > 10 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  +{addresses.length - 10} more addresses
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
