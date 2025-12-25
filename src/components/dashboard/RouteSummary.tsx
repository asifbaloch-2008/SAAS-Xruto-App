import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";

interface RouteSummaryData {
  driver: number;
  stops: number;
  driving: string;
  servicing: string;
  total: string;
}

interface RouteSummaryProps {
  data: RouteSummaryData[];
}

export const RouteSummary = ({ data }: RouteSummaryProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-2 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-1.5 text-[11px] h-auto">Driver</TableHead>
                <TableHead className="py-1.5 text-[11px] h-auto">Stops</TableHead>
                <TableHead className="py-1.5 text-[11px] h-auto">Driving</TableHead>
                <TableHead className="py-1.5 text-[11px] h-auto">Servicing</TableHead>
                <TableHead className="py-1.5 text-[11px] h-auto">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.driver}>
                  <TableCell className="py-1 text-xs font-medium">{row.driver}</TableCell>
                  <TableCell className="py-1 text-xs">{row.stops}</TableCell>
                  <TableCell className="py-1 text-xs">{row.driving}</TableCell>
                  <TableCell className="py-1 text-xs">{row.servicing}</TableCell>
                  <TableCell className="py-1 text-xs">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
