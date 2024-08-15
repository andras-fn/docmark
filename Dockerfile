# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.6.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Clear npm cache and set registry
RUN npm cache clean --force && npm config set registry https://registry.npmjs.org/

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package.json and package-lock.json to the Docker context
COPY package.json package-lock.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Build the application
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "run", "start"]
