import OverviewCard from "./OverviewCard";
import CategoryCard from "./CategoryCard";

import type { MarkingScheme } from "@/db/schemas/markingScheme";
import type { TestCriteria } from "@/db/schemas/testCriteria";

type ExtendedMarkingScheme = MarkingScheme & {
  testCriteria: TestCriteria[];
};

const MarkingSchemeViewer = ({
  selectedMarkingScheme,
}: {
  selectedMarkingScheme: ExtendedMarkingScheme;
}) => {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between w-full border-b border-slate-500 items-center">
        {selectedMarkingScheme ? (
          <h4 className="p-2 font-medium">{selectedMarkingScheme?.name}</h4>
        ) : (
          <h4 className="p-2 font-medium">No Marking Scheme Selected</h4>
        )}
      </div>
      {selectedMarkingScheme ? (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 p-2 h-[calc(100%-41px)]">
          <OverviewCard testCriteria={selectedMarkingScheme.testCriteria} />
          <CategoryCard
            categoryName="Summary"
            testCriteria={selectedMarkingScheme.testCriteria.filter(
              (criteria: TestCriteria) => {
                if (criteria.category === "summary") return criteria;
              }
            )}
          />
          <CategoryCard
            categoryName="Urgency"
            testCriteria={selectedMarkingScheme.testCriteria.filter(
              (criteria: TestCriteria) => {
                if (criteria.category === "urgency") return criteria;
              }
            )}
          />
          <CategoryCard
            categoryName="Key Diagnosis"
            testCriteria={selectedMarkingScheme.testCriteria.filter(
              (criteria: TestCriteria) => {
                if (criteria.category === "keyDiagnosis") return criteria;
              }
            )}
          />
          <CategoryCard
            categoryName="Medication"
            testCriteria={selectedMarkingScheme.testCriteria.filter(
              (criteria: TestCriteria) => {
                if (criteria.category === "anyNewMedication") return criteria;
              }
            )}
          />
          <CategoryCard
            categoryName="Next Actions"
            testCriteria={selectedMarkingScheme.testCriteria.filter(
              (criteria: TestCriteria) => {
                if (criteria.category === "nextActions") return criteria;
              }
            )}
          />
        </div>
      ) : (
        <p className="p-2">No Marking Scheme Selected</p>
      )}
    </div>
  );
};
export default MarkingSchemeViewer;
