import { type MarkingScheme } from "@/db/schemas/markingScheme";

type NewTestCriteria = {
  testDescription: string;
  category: string;
  testCriteriaId: string;
} | null;

interface MarkingSchemeWithCriteria extends MarkingScheme {
  testCriteria: NewTestCriteria[];
}

// GET - get all documents

export function reduceMarkingSchemeResults(
  results: {
    markingScheme: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date | null;
    };
    testCriteria: {
      testDescription: string;
      category: string;
      testCriteriaId: string;
    } | null;
  }[]
): Promise<MarkingSchemeWithCriteria[]> {
  const result: MarkingSchemeWithCriteria[] = results.reduce(
    (acc: MarkingSchemeWithCriteria[], item) => {
      const { markingScheme, testCriteria } = item;
      const existingScheme = acc.find(
        (scheme: MarkingSchemeWithCriteria) => scheme.id === markingScheme?.id
      );

      if (existingScheme && testCriteria) {
        existingScheme.testCriteria.push(testCriteria as NewTestCriteria);
      } else if (testCriteria) {
        acc.push({
          ...(markingScheme as MarkingScheme),
          testCriteria: [testCriteria],
        });
      }

      return acc;
    },
    []
  );

  return Promise.resolve(result);
}
