# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:12.13.0

# Set the working directory to /wallet-service
WORKDIR /wallet-service

# copy package.json into the container at /wallet-service
COPY package*.json /wallet-service/

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /wallet-service
COPY . /wallet-service/

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the app when the container launches
CMD ["npm", "start"]
