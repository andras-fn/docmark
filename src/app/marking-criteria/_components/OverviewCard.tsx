import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TestCriteria } from "@/db/schemas/testCriteria";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OverviewCard = ({ testCriteria }: { testCriteria: TestCriteria[] }) => {
  const categories = [
    {
      category: "summary",
      displayName: "Summary",
    },
    {
      category: "urgency",
      displayName: "Urgency",
    },
    {
      category: "keyDiagnosis",
      displayName: "Key Diagnosis",
    },
    {
      category: "anyNewMedication",
      displayName: "Any New Medication",
    },
    {
      category: "nextActions",
      displayName: "Next Actions",
    },
  ];
  return (
    <Card className="border-gray-400">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[calc(100%-40px)] min-h-[calc(100%-40px)] h-[calc(100%-40px)]">
        <ScrollArea className="max-h-[calc(100%-40px)] min-h-[calc(100%-40px)] h-[calc(100%-40px)]">
          {testCriteria.length > 0 ? (
            <div className="border border-gray-300 rounded">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-black">Category</TableHead>
                    <TableHead className="text-right text-black">#</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell>{category.displayName}</TableCell>
                      <TableCell className="text-right">
                        {
                          testCriteria.filter(
                            (criteria) =>
                              criteria.category === category.category
                          ).length
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100">
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="font-semibold text-right">
                      {testCriteria.length}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <></>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
export default OverviewCard;
