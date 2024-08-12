import { db } from "@/db/client";

import {
  markingRunResults,
  MarkingRunResults,
  InsertMarkingRunResults,
} from "@/db/schemas/markingRunResults";
import { markingRun } from "@/db/schemas/markingRun";
import { document } from "@/db/schemas/document";
import { eq, and, count } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const markingRunId = params.runId;

    const [results, totalResultCount, markingRunResult] = await Promise.all([
      db.query.markingRunResults.findMany({
        with: {
          markingScheme: {
            columns: {
              name: true,
            },
          },
          documentGroup: {
            columns: {
              name: true,
            },
          },
        },
      }),
      db
        .select({ count: count() })
        .from(markingRunResults)
        .where(eq(markingRunResults.markingRunId, markingRunId)),
      db.select().from(markingRun).where(eq(markingRun.id, markingRunId)),
    ]);

    console.log(results);

    const groupByMarkingScheme = (data) => {
      return data.reduce((acc, current) => {
        const { markingSchemeId, category } = current;

        // Find or create the markingScheme entry
        let markingScheme = acc.find(
          (item) => item.markingSchemeId === markingSchemeId
        );
        if (!markingScheme) {
          markingScheme = {
            markingSchemeId,
            markingSchemeName: current.markingSchemeName, // Assuming markingSchemeName is in the data
            categories: {},
          };
          acc.push(markingScheme);
        }

        // Add the current item to the appropriate category
        if (!markingScheme.categories[category]) {
          markingScheme.categories[category] = [];
        }
        markingScheme.categories[category].push(current);

        return acc;
      }, []);
    };

    const groupedResults = groupByMarkingScheme(
      results.map((result) => {
        const newObj = { ...result };
        newObj.markingSchemeName = result.markingScheme.name;
        delete newObj.markingScheme;
        newObj.documentGroupName = result.documentGroup.name;
        delete newObj.documentGroup;
        return newObj;
      })
    );

    console.log(groupedResults);

    return Response.json({
      status: 200,
      data: groupedResults,
      pagination: { totalResultCount: totalResultCount[0].count },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
