# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app/provafe

# Copy only package.json first to leverage Docker cache
COPY package.json ./

# Install dependencies
RUN npm install --production --silent && mv node_modules ../

# Copy the rest of the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]