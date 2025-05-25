# Base image
FROM mcr.microsoft.com/playwright:v1.30.0-focal

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install
RUN npm i

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Set the entry point to the Playwright test runner command
ENTRYPOINT ["npx", "playwright", "test"]

# Set the default command to use the Chromium project
CMD ["--project=Chromium"]