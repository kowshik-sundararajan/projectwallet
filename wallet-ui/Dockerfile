# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:12.13.0

# Set the working directory to /wallet-ui
WORKDIR /wallet-ui

# copy package.json into the container at /wallet-ui
COPY package*.json /wallet-ui/

# install dependencies
RUN npm install --production

# Copy the current directory contents into the container at /wallet-ui
COPY . /wallet-ui/

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["yarn", "start"]
