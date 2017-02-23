'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Stat = mongoose.model('Stat'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  stat;

/**
 * Stat routes tests
 */
describe('Stat CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Stat
    user.save(function () {
      stat = {
        name: 'Stat name'
      };

      done();
    });
  });

  it('should be able to save a Stat if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Stat
        agent.post('/api/stats')
          .send(stat)
          .expect(200)
          .end(function (statSaveErr, statSaveRes) {
            // Handle Stat save error
            if (statSaveErr) {
              return done(statSaveErr);
            }

            // Get a list of Stats
            agent.get('/api/stats')
              .end(function (statsGetErr, statsGetRes) {
                // Handle Stats save error
                if (statsGetErr) {
                  return done(statsGetErr);
                }

                // Get Stats list
                var stats = statsGetRes.body;

                // Set assertions
                (stats[0].user._id).should.equal(userId);
                (stats[0].name).should.match('Stat name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Stat if not logged in', function (done) {
    agent.post('/api/stats')
      .send(stat)
      .expect(403)
      .end(function (statSaveErr, statSaveRes) {
        // Call the assertion callback
        done(statSaveErr);
      });
  });

  it('should not be able to save an Stat if no name is provided', function (done) {
    // Invalidate name field
    stat.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Stat
        agent.post('/api/stats')
          .send(stat)
          .expect(400)
          .end(function (statSaveErr, statSaveRes) {
            // Set message assertion
            (statSaveRes.body.message).should.match('Please fill Stat name');

            // Handle Stat save error
            done(statSaveErr);
          });
      });
  });

  it('should be able to update an Stat if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Stat
        agent.post('/api/stats')
          .send(stat)
          .expect(200)
          .end(function (statSaveErr, statSaveRes) {
            // Handle Stat save error
            if (statSaveErr) {
              return done(statSaveErr);
            }

            // Update Stat name
            stat.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Stat
            agent.put('/api/stats/' + statSaveRes.body._id)
              .send(stat)
              .expect(200)
              .end(function (statUpdateErr, statUpdateRes) {
                // Handle Stat update error
                if (statUpdateErr) {
                  return done(statUpdateErr);
                }

                // Set assertions
                (statUpdateRes.body._id).should.equal(statSaveRes.body._id);
                (statUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Stats if not signed in', function (done) {
    // Create new Stat model instance
    var statObj = new Stat(stat);

    // Save the stat
    statObj.save(function () {
      // Request Stats
      request(app).get('/api/stats')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Stat if not signed in', function (done) {
    // Create new Stat model instance
    var statObj = new Stat(stat);

    // Save the Stat
    statObj.save(function () {
      request(app).get('/api/stats/' + statObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', stat.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Stat with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stats/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Stat is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Stat which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Stat
    request(app).get('/api/stats/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Stat with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Stat if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Stat
        agent.post('/api/stats')
          .send(stat)
          .expect(200)
          .end(function (statSaveErr, statSaveRes) {
            // Handle Stat save error
            if (statSaveErr) {
              return done(statSaveErr);
            }

            // Delete an existing Stat
            agent.delete('/api/stats/' + statSaveRes.body._id)
              .send(stat)
              .expect(200)
              .end(function (statDeleteErr, statDeleteRes) {
                // Handle stat error error
                if (statDeleteErr) {
                  return done(statDeleteErr);
                }

                // Set assertions
                (statDeleteRes.body._id).should.equal(statSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Stat if not signed in', function (done) {
    // Set Stat user
    stat.user = user;

    // Create new Stat model instance
    var statObj = new Stat(stat);

    // Save the Stat
    statObj.save(function () {
      // Try deleting Stat
      request(app).delete('/api/stats/' + statObj._id)
        .expect(403)
        .end(function (statDeleteErr, statDeleteRes) {
          // Set message assertion
          (statDeleteRes.body.message).should.match('User is not authorized');

          // Handle Stat error error
          done(statDeleteErr);
        });

    });
  });

  it('should be able to get a single Stat that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Stat
          agent.post('/api/stats')
            .send(stat)
            .expect(200)
            .end(function (statSaveErr, statSaveRes) {
              // Handle Stat save error
              if (statSaveErr) {
                return done(statSaveErr);
              }

              // Set assertions on new Stat
              (statSaveRes.body.name).should.equal(stat.name);
              should.exist(statSaveRes.body.user);
              should.equal(statSaveRes.body.user._id, orphanId);

              // force the Stat to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Stat
                    agent.get('/api/stats/' + statSaveRes.body._id)
                      .expect(200)
                      .end(function (statInfoErr, statInfoRes) {
                        // Handle Stat error
                        if (statInfoErr) {
                          return done(statInfoErr);
                        }

                        // Set assertions
                        (statInfoRes.body._id).should.equal(statSaveRes.body._id);
                        (statInfoRes.body.name).should.equal(stat.name);
                        should.equal(statInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Stat.remove().exec(done);
    });
  });
});
