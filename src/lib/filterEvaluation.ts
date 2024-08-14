export function filterEvaluation(documents, documentId, filter) {
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

  const filteredResults = filteredDocument.results.filter((result) => {
    if (result.evaluation === filter) {
      return true;
    }
    return false;
  });

  return filteredResults.length;
}
