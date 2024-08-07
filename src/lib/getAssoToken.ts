export const getAssoToken = async (
  clientId: string,
  clientSecret: string,
  tokenUrl: string
): Promise<{
  success: boolean;
  data?: any;
  error?: any;
}> => {
  const tokenHeaders = new Headers();
  tokenHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", clientId);
  urlencoded.append("client_secret", clientSecret);

  const tokenRequestOptions: RequestInit = {
    method: "POST",
    headers: tokenHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const res = await fetch(tokenUrl, tokenRequestOptions);
    const resBody = await res.json();

    if (!res.ok) {
      throw new Error(resBody.error_description);
    }

    return { success: true, data: resBody };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};
