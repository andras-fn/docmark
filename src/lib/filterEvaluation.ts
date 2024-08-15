export function filterEvaluation(
  documents: any[],
  documentId: string,
  filter: string
) {
  // loop over documents
  const filteredDocument = documents.find((document) => {
    // loop over results
    if (document.documentId === documentId) {
      return true;
    }
  });

  if (filter === "NONE") {
    return filteredDocument.results.length;
  }

  const filteredResults = filteredDocument.results.filter((result: any) => {
    if (result.evaluation === filter) {
      return true;
    }
    return false;
  });

  return filteredResults.length;
}
