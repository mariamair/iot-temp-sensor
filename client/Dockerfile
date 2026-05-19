FROM node:24-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci --ignore-scripts --omit=dev

COPY . .
RUN npm run build

# Copy static files to standalone directory
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

CMD ["node", ".next/standalone/server.js"]