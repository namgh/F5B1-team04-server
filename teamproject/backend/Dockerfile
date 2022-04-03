FROM node:14

WORKDIR /myfolder/
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
COPY ./cu2project-4b09dba6a53d.json /myfolder/
RUN yarn install

COPY . /myfolder/
CMD yarn start:dev