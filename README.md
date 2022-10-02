## DESCRIPTION

Hi there!. This repo is mean for the solution for the deel backend task, considering the following:

- Used typescript on new and added modules to improve code quality and readability.
- Typical MVC architecture, with Routes, Controllers, Services.
- Classes are structured using DDD (Domain driven design) (Job, Admin, Contracts, etc). This help to separate the layers.

## TIME TRACKING (AROUND 4 HOURS IN TOTAL)

- 30/06 - setting app initial skeleton of app and config - 20 minutes
- 30/06 - Job and Contracts API - 90 minutes
- 01/07 - Testing - 60 minutes
- 01/07 - Write balances API - 30 minutes
- 01/07 - Write Admin API - 30 minutes
## SETUP

- clone this repo
- npm install

## TESTING

- npm start
- npm run test (in another terminal)

## DEPLOYMENT

- docker build -t deel .
- docker run -dp 3000:3001 deel
- optional: run tests against docker with changing the port for testing to 3000
# DEEL BACKEND TASK DESCRIPTION

[See description](TASK.md)
