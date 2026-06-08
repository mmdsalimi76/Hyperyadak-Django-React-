# Stage 1: Create the React app (with mirror configured)
FROM docker.iranserver.com/node:20-alpine as setup

# Set npm to use RunFlare mirror FIRST
RUN npm config set registry https://mirror2.chabokan.net/npm/
RUN npm config set strict-ssl false

WORKDIR /temp

# Now create the app (will use the mirror)
RUN npm create vite@latest my-app -- --template react --yes
RUN mv my-app/* my-app/.* . 2>/dev/null || true

# Stage 2: Final image
FROM docker.iranserver.com/node:20-alpine

WORKDIR /app

# Set npm to use RunFlare mirror
RUN npm config set registry https://mirror2.chabokan.net/npm/
RUN npm config set strict-ssl false

# Copy from setup stage
COPY --from=setup /temp/package*.json ./
COPY --from=setup /temp/index.html ./
COPY --from=setup /temp/vite.config.js ./
COPY --from=setup /temp/src ./src

# Copy local files (will override if they exist)
COPY . .

# Install dependencies
RUN npm install


EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]