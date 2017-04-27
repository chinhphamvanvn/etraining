# e-Training

Learning Management System for Enterprise

## Getting Started

Check out master branch from GitHub
```
git clone https://github.com/nngu6036/e-training
```
Intall dependancy
```
cd e-training/mean
npm install
bower install
```

### Prerequisites

* Node v6.x
* [MongoDB](https://mongodb.com/) - NoSQL database

### Installing

Start the MongoDB service
Then run the code
```
cd e-training/mean
gulp
```
## Running the tests




## Deployment

Set the environment variable NODE_ENV to 'production'
Set the database, port, and certificate in config/env/production.js

Build the distribution file
```
cd e-training/mean
npm install
npm install --dev
bower install
gulp build
```
Run the deloyment script
```
forever start server.js
```

## Deployment error
If the console log display

## Built With

* [MEAN stack](http://meanjs.org/) - The full stack framework used


## Add new question type

- Add question directive in LMS module
- Add question type to Question model
- Add answer field to Answer model
- Add translation
- Add to question-info directive
- Add to answer-sheet directive
- Add to performance / list / create /edit question
- Add to lms / list / create /edit /preview /study question (course-board, exam-board, teacher)

## Authors

* **Quang Nguyen** - *Initial work* - [e-Training](https://github.com/nngu6036)

## License

This project is licensed under the MIT License


