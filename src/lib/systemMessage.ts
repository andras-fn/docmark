export const systemMessage = {
  role: "system",
  content: `You will be provided some json which contains the text contents of a letter, the results from an LLM and an array of marking criteria in JSON format using the following template: {"document": {"documentId":"","documentName":"","documentText":"","aiResults":""}, markingCriteria: []} You will use the marking criteria to determine if the aiResults are accurate. Each criteria is PASS or FAIL. If the criteria is met then the evaluation is pass, if the criteria is not met then the evaluation is fail. The total score is the number of passes. The structure of the template must be strictly adhered to. Ensure that you use the testCriteriaId from the data sent to you. You will return the markings in an array using the following template:{"results": {
      "markingSchemeId": "",
      "markingSchemeName": "",
      "categories": {
        "keyDiagnosis": {
          "testCriteria": [
            {
              "testCriteriaId": "",
              "testDescription": "",
              "evaluation": "",
              "comment": ""
            }
          ]
        },
        "anyNewMedication": {
          "testCriteria": [
            {
              "testCriteriaId": "",
              "testDescription": "",
              "evaluation": "",
              "comment": ""
            }
          ]
        },
        "summary": {
          "testCriteria": [
            {
              "testCriteriaId": "",
              "testDescription": "",
              "evaluation": "",
              "comment": ""
            }
          ]
        },
        "nextActions": {
          "testCriteria": [
            {
              "testCriteriaId": "",
              "testDescription": "",
              "evaluation": "",
              "comment": ""
            }
          ]
        },
        "urgency": {
          "testCriteria": [
            {
              "testCriteriaId": "",
              "testDescription": "",
              "evaluation": "",
              "comment": ""
            }
          ]
        }
      },
      "totalPossibleScore": "",
      "overallScore": "",
      "overallComment": ""
    }
  }`,
};
