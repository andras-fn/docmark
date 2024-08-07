import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { markingCriteria, category, description } from "@/db/schema";

export async function POST(request: Request) {
  const res = await request.json();

  // Save the marking criteria to the database
  console.log(res);

  // need to insert the marking criteria first, then category and then descriptions, this is because the descriptions need an id from the category and the category needs an id from the marking criteria

  // then save the marking criteria
  const markingCriteriaId = randomUUID();
  const markingCriteriaResult = await db.insert(markingCriteria).values({
    id: markingCriteriaId,
    markingCriteriaName: res.name,
  });

  console.log(markingCriteriaResult);

  // then save each category
  const categories = Object.keys(res).map((category: any) => {
    return {
      id: randomUUID(),
      categoryName: category,
      markingCriteriaId: markingCriteriaId,
    };
  });

  console.log(categories);

  const categoryResults = await db.insert(category).values(categories);

  console.log(categoryResults);

  // save all the descriptions first
  console.log(
    Object.keys(res).filter((category) => {
      if (category !== "name") {
        return category;
      }
    })
  );
  const descriptions = Object.keys(res)
    .filter((category) => {
      if (category !== "name") {
        return category;
      }
    })
    .map((category: any) => {
      console.log(category);
      return res[category].map((description: any) => {
        console.log(description);
        return {
          id: randomUUID(),
          description: description.description,
          categoryId: categories.find((c) => c.categoryName === category)?.id,
        };
      });
    });

  const flattenedDescriptions = descriptions.flat();

  const descriptionResults = await db
    .insert(description)
    .values(flattenedDescriptions);

  console.log(descriptionResults);

  return Response.json({ id: markingCriteriaId }, { status: 201 });
}
