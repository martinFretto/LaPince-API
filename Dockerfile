FROM node:20-alpine
RUN mkdir -p /app
WORKDIR /app
EXPOSE 3000 
CMD ["npm", "run", "dev"]