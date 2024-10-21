// GET - get all document groups

import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  _Object,
} from "@aws-sdk/client-s3";

import { validateRequest } from "@/auth/auth";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    console.log("getting url params");
    // get the url params
    const url = new URL(request.url);
    const params = {
      accessKey: url.searchParams.get("accessKey") || undefined,
      secretKey: url.searchParams.get("secretKey") || undefined,
      region: url.searchParams.get("region"),
      bucketName: url.searchParams.get("bucketName"),
      folder: url.searchParams.get("folder") || undefined,
    };

    console.log(params);

    if (!params.bucketName || !params.region) {
      console.log("Missing required S3 parameters");
      throw new Error("Missing required S3 parameters");
    }

    // send request to s3 bucket
    const fetchObjects = async (
      bucket: string,
      region: string,
      accessKey: string | undefined,
      secretKey: string | undefined,
      folder: string | undefined
    ) => {
      const objects: _Object[] = [];

      async function fetchObjectsWithPagination(
        bucket: string,
        region: string,
        accessKey: string | undefined,
        secretKey: string | undefined,
        folder: string | undefined,
        continuationToken?: ListObjectsV2CommandInput["ContinuationToken"]
      ): Promise<void> {
        const params: any = {
          region: region || "eu-west-2",
        };

        if (accessKey !== undefined) {
          console.log("using access key", accessKey);
          params.credentials = {
            ...params.credentials,
            accessKeyId: accessKey,
          };
        } else {
          params.credentials = {
            ...params.credentials,
            accessKeyId: "",
          };
        }

        if (secretKey !== undefined) {
          console.log("using secret key", secretKey);
          params.credentials = {
            ...params.credentials,
            secretAccessKey: secretKey,
          };
        } else {
          params.credentials = {
            ...params.credentials,
            secretAccessKey: "",
          };
        }

        if (process.env.S3_ENDPOINT) {
          console.log("using endpoint", process.env.S3_ENDPOINT);
          params.endpoint = process.env.S3_ENDPOINT;
          params.forcePathStyle = true;
        }

        console.log("s3 client params: ", params);
        const s3 = new S3Client(params);

        const commandParams: ListObjectsV2CommandInput = {
          Bucket: bucket,
        };

        if (folder) {
          commandParams.Prefix = folder;
        }

        if (continuationToken) {
          commandParams.ContinuationToken = continuationToken;
        }

        console.log("fetching objects with params: ", commandParams);

        const result = await s3.send(new ListObjectsV2Command(commandParams));
        console.log(result);

        objects.push(...(result.Contents || []));

        if (result.NextContinuationToken) {
          return fetchObjectsWithPagination(
            bucket,
            region,
            accessKey,
            secretKey,
            folder,
            result.NextContinuationToken
          );
        }

        return;
      }

      await fetchObjectsWithPagination(
        bucket,
        region,
        accessKey,
        secretKey,
        folder
      );

      return objects;
    };

    console.log("fetching objects");

    const results = await fetchObjects(
      params.bucketName,
      params.region,
      params.accessKey,
      params.secretKey,
      params.folder
    );

    console.log(results);

    return Response.json(
      {
        data: results,
        pagination: {
          totalResultCount: results.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching data:", (error as unknown as Error).message);
    return Response.json(
      { status: 400, issues: (error as unknown as Error).message },
      { status: 500 }
    );
  }
}
