import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { TestCriteria } from "@/db/schemas/testCriteria";

const CategoryCard = ({
  categoryName,
  testCriteria,
}: {
  categoryName: string;
  testCriteria: TestCriteria[];
}) => {
  return (
    <Card className="border-gray-400">
      <CardHeader>
        <CardTitle>{categoryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[calc(100%-50px)] min-h-[calc(100%-50px)] h-[calc(100%-50px)]">
          {testCriteria.length > 0 ? (
            <div className="border border-gray-300 rounded divide-y divide-gray-300">
              {testCriteria &&
                testCriteria.map((criteria) => (
                  <p key={criteria.id} className="p-2">
                    {criteria.testDescription}
                  </p>
                ))}
            </div>
          ) : (
            <></>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
export default CategoryCard;
