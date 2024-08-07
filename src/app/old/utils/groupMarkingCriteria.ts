export const groupByMarkingCriteria = (results) => {
  return results.reduce((acc, currentItem) => {
    // Extract necessary properties
    const { id: markingCriteriaId, markingCriteriaName } =
      currentItem.marking_criteria;
    const { categoryName } = currentItem.categories;
    const description = currentItem.descriptions
      ? {
          descriptionId: currentItem.descriptions.id,
          description: currentItem.descriptions.description,
        }
      : null;

    // Find existing marking criteria object in the accumulator
    let markingCriteriaObj = acc.find(
      (mc) => mc.markingCriteriaId === markingCriteriaId
    );

    // If it doesn't exist, create it and push to accumulator
    if (!markingCriteriaObj) {
      markingCriteriaObj = {
        markingCriteriaId,
        markingCriteriaName,
        categories: {},
      };
      acc.push(markingCriteriaObj);
    }

    // Check if the category already exists within the marking criteria object, if not initialize it
    if (!markingCriteriaObj.categories[categoryName]) {
      markingCriteriaObj.categories[categoryName] = { descriptions: [] };
    }

    // If there is a description, add it to the category
    if (description) {
      markingCriteriaObj.categories[categoryName].descriptions.push(
        description
      );
    }

    return acc;
  }, []);
};
