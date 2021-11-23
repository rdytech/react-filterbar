FROM ruby:2.6-slim-buster
WORKDIR /code

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  nodejs \
  npm

RUN npm install -g npm@7.24.2
COPY package* ./
RUN npm install

