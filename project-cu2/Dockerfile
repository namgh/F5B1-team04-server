FROM node:14

WORKDIR /cu2_backend/
COPY ./package.json /cu2_backend/
COPY ./yarn.lock /cu2_backend/
RUN yarn install

COPY . /cu2_backend/
RUN yarn build
CMD yarn start:dev