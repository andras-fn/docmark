# Welcome to DocMarkAI!

DocMarkAI is a tool designed to test the results from Docman Workflow Assistant. Documents are uploaded which consist of the original letters text and the AI results as JSON. Marking Schemes consist of a bunch of Marking Criteria for each category (Summary, Key Diagnosis, Any New Medication, Urgency and Next Actions.

## Getting Started
These instructions assume you have Node.js 22 already installed.

### Install Packages
To get started locally, clone the repo, run the following to install all of the packages:
```bash
npm  i
```
### Configure your .env file
Next take a copy of the ".env.example", rename the copy to ".env" and then populate it with your own values. The ".env.example" file includes descriptions of what the different values are. The only values that are 100% required to start the application are:

 - POSTGRES_URI 
 - GITHUB_CLIENT_ID 
 - GITHUB_CLIENT_SECRET
 - ALLOWED_GITHUB_IDS

 > **Note:** You can find your Github user id easily by going here and entering your Github username: https://caius.github.io/github_id
### Set up your database
Ensure that you have set up your Postgres Container with a database called "docmarkai". To set up the database with the proper tables you'll want to run the SQL migrate command:
```bash
npm run db:migrate
```

Our ORM comes with a tool to view our database called Drizzle-Studio. To open Drizzle-Studio run:
```bash
npm run db:studio
```

If you make changes to the database schema then you'll need to generate new SQL migrations:
```bash
npm run db:generate
```
You'll then need to apply them with the migrate command shown earlier:
```bash
npm run db:migrate
```
To seed the database with some sample data you can run:
```bash
npm run db:seed
```
 > **Note:** Before you can seed your database with data you'll need to have at least run the DB Migrate command

### Run the development server
To run the dev server run:
```bash
npm  run  dev
```
This will start the app running on port 3000. If you already have something running on that port then it'll try the next port eg 3001.
While the dev server is running you can make changes to any of the application files (including the .env file) and the changes will be reflected immediately.

## Production Build
If you want try out a production build locally then first you need to build it:
```bash
npm  run  build
```
After the build has completed, to run the application you do:
```bash
npm  run  start
```
The application will use the values from .env when running.

## Docker build
This step assumes you already have Docker installed and configured.
To create a Docker image locally run:
```bash
docker buildx build -t docmarkai .
```
This will created a docker image locally called "docmarkai". 

## Running the Postgres database and Application locally
To allow the docmarkai container to talk to the Postgres container you need to set up a Docker network and then connect the two containers to it.
### Creating the network
To create a Docker network named "my-network" run:
```bash
docker network create my-network
```
### Connecting an already existing Postgres container to the new network
Assuming your Docker network is called "my-network" and your Postgres container is called "sharp_hawking" then run the following command to connect your Postgres container to the network:
```bash
docker network connect my-network sharp_hawking
```
### Creating and starting your DocMarkAI container
First ensure than in your .env file your Postgres connection string has been altered to include the name of your Postgres container as the Postgres server name (in this example my Postgres container is called "sharp_hawking"):
```bash
POSTGRES_URI=postgresql://postgres:postgres@sharp_hawking:5432/docmarkai
```
To create and run the DocMarkAI container use the following command (assuming the network you previously created is called "my-network" and the Docker image created is called "docmarkai"):
```bash
docker run --network my-network --env-file .env -p 3000:3000 docmarkai
```
Your DocMarkAI container should now be started, connected to your database and be working.
### TODO
 - Add bulk import from S3
 - Create Github Action to build and deploy container image to registry
 - Update CDK to deploy container from ECR/Advanced Artefacts
 - Show prompt ID on the /documents page
    - Update Docman AI Connector to include the Prompt ID in the metadata sent to the Platform Service
 - ~~Update readme to include DB scripts~~ - DONE
 - ~~Add button to /documents page to show the System and User Prompts used in the AI Results~~ - DONE
 - ~~Add Pass/Fail filter buttons to /marking-runs/:id screen~~ - DONE
- ~~Clear selected document on /marking-runs/:id screen when Document Group or Marking Scheme changes~~ - DONE
 - ~~Remove Config button from Navbar~~ - DONE
 - ~~Rename Marking Criteria to Marking Schemes~~ - DONE
