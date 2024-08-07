type MetadataArray = Array<{ key: string; value: string }>;

export const createPlatformServiceJob = async (
  accessToken: string,
  text: string,
  promptId: string,
  metadata: MetadataArray,
  serviceUrl: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  const jobHeaders = new Headers();
  jobHeaders.append("Authorization", `Bearer ${accessToken}`);
  jobHeaders.append("Content-Type", "application/json");

  console.log(`Headers: ${jobHeaders}`);

  if (!promptId || promptId === "") {
    throw new Error("PromptId is required");
  }

  const body = JSON.stringify({
    text: text,
    promptId: promptId,
    metadata: metadata,
  });

  console.log(`Request body: ${body}`);

  const jobRequestOptions: RequestInit = {
    method: "POST",
    headers: jobHeaders,
    body: body,
    redirect: "follow",
  };

  try {
    const response = await fetch(serviceUrl, jobRequestOptions);

    if (!response.ok) {
      console.log(`Request URL: ${serviceUrl}`);
      console.log(jobRequestOptions);
      console.error(`Response status: ${response.status}`);
      console.log(response);
      console.log(await response.text());
      console.log(await response.json());
      console.log(await response.body);

      throw new Error(`Failed to create job: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.jobId) {
      throw new Error("No jobId in response");
    }
    return { success: true, data: { jobId: data.jobId } };
  } catch (error: any) {
    console.error("Error creating platform service job:", error);
    return { success: false, error: error.message };
  }
};
