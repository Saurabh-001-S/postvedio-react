# Stage 1
FROM node:14 as react-build
WORKDIR /app
COPY . ./
RUN npm install
EXPOSE 5173
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev"]
