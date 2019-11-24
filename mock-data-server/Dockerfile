# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:12.13.0

# Set the working directory to /mock-data-server
WORKDIR /mock-data-server

# copy package.json into the container at /mock-data-server
COPY package*.json /mock-data-server/

# install dependencies
RUN npm install --production

# Copy the current directory contents into the container at /mock-data-server
COPY . /mock-data-server/

# Make port 8484 available to the world outside this container
EXPOSE 8484

# Run the app when the container launches
CMD ["npm", "start"]
