# Step 1: Build the React app
FROM node:16 AS build

WORKDIR /app

# Create required directories and files
RUN mkdir -p public && \
    echo '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <meta name="theme-color" content="#000000" />\n  <meta name="description" content="Todo App" />\n  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />\n  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />\n  <title>Todo App</title>\n</head>\n<body>\n  <noscript>You need to enable JavaScript to run this app.</noscript>\n  <div id="root"></div>\n</body>\n</html>' > public/index.html && \
    echo '{\n  "short_name": "Todo App",\n  "name": "Todo App",\n  "start_url": ".",\n  "display": "standalone",\n  "theme_color": "#000000",\n  "background_color": "#ffffff"\n}' > public/manifest.json && \
    echo 'Todo App' > public/robots.txt

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the source code
COPY . ./

# Build the React app for production
RUN npm run build

# Step 2: Serve the React app
FROM nginx:alpine

# Copy the build from the first stage to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
