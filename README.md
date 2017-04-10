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

Build the distribution file
```
cd e-training/mean
gulp build
```
Run the deloyment script
```
forever start server.js
```

## Built With

* [MEAN stack](http://meanjs.org/) - The full stack framework used


## Add new question type

- Add question directive in LMS module
- Add question type to Question model
- Add answer field to Answer model

## Authors

* **Quang Nguyen** - *Initial work* - [PurpleBooth](https://github.com/nngu6036)

## License

This project is licensed under the MIT License


