FROM debian:latest

RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
&& curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
&& NODE_MAJOR=20 \
&& echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
&& apt-get update && apt-get install nodejs -y \
&& apt-get clean -y

WORKDIR /home/docker/app/express-crud-template
COPY ./ ./

EXPOSE 8080
VOLUME /app/logs

RUN npm install \
&& npm run db--migrate | echo 'y' | echo "ExpressArosaje"

CMD ["npm", "run", "dev"]