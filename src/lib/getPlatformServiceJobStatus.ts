export const getPlatformServiceJobStatus = async (
  accessToken: string,
  jobId: string,
  serviceUrl: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  const jobHeaders = new Headers();
  jobHeaders.append("Authorization", `Bearer ${accessToken}`);
  jobHeaders.append("Content-Type", "application/json");

  //console.log(`Headers: ${jobHeaders}`);

  const jobRequestOptions: RequestInit = {
    method: "GET",
    headers: jobHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${serviceUrl}${jobId}`, jobRequestOptions);

    if (!response.ok) {
      //console.log(`Request URL: ${serviceUrl}${jobId}`);
      //console.error(`Response status: ${response.status}`);

      throw new Error(`Failed to get job: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.jobId) {
      throw new Error("No jobId in response");
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating platform service job:", error);
    return { success: false, error: error.message };
  }
};
