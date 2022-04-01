FROM node
COPY . /root/To-Do-nodejs/
WORKDIR /root/To-Do-nodejs/
RUN npm install
CMD ["node", "index.js"]
#docker build -t todo-api-image .
# docker run --name todo-api-instance -d -p 8001:8001 todo-api-image
#docker stop todo-api-instance
