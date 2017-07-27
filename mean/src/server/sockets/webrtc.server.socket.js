'use strict';
var Publisher = require('./webrtc/publisher.js');
var Subscriber = require('./webrtc/subscriber.js');
var CHANNEL_ID = 'webrtc';
var _ = require('underscore');
var channels = {};

function publishOffer(socket, sdpOffer) {
  try {
    var publisherId = socket.request.user._id;
    var channel = channels[publisherId];
    var publisher;
    if (channel) {
      publisher = channels[publisherId];
      if (publisher) {
        publisher.release();
        _.each(publisher.subscribers, function(sub) {
          sub.release();
        });
      }
      publisher = new Publisher(publisherId);
      channels[publisherId] = publisher;
    } else {
      publisher = new Publisher(publisherId);
      channels[publisherId] = publisher;
    }
    var onPublishCandidate = function(candidate) {
      socket.emit(CHANNEL_ID, JSON.stringify({
        id: 'publishCandidate',
        publisherId: publisherId,
        candidate: candidate
      }));
    }
    var onPublishResponse = function(sdpAnswer) {
      socket.emit(CHANNEL_ID, JSON.stringify({
        id: 'publishAnswer',
        publisherId: publisherId,
        sdpAnswer: sdpAnswer
      }));
    };
    publisher.processOffer(sdpOffer, onPublishCandidate, onPublishResponse);
  } catch (exc) {
    console.log('Publish offer error ', exc);
  }
}


function publishCandidate(socket, candidate) {
  try {
    var publisherId = socket.request.user._id;
    var publisher = channels[publisherId];
    publisher.processCandidate(candidate);

  } catch (exc) {
    console.log('Publish candidate error ', exc);
  }
}

function unpublish(socket) {
  try {
    var publisherId = socket.request.user._id;
    var publisher = channels[publisherId];
    if (publisher) {
      publisher.release();
      _.each(publisher.subscribers, function(sub) {
        sub.release();
      });
    }
  } catch (exc) {
    console.log('Publish offer error ', exc);
  }
}

function unsubscribe(socket, publisherId) {
  try {
    var subscriberId = socket.request.user._id;
    var publisher = channels[publisherId];
    if (publisher) {
      var subscriber = publisher.subscribers[subscriberId];
      if (subscriber)
        subscriber.release();
    }
  } catch (exc) {
    console.log('Publish offer error ', exc);
  }
}

function subscribeOffer(socket, publisherId, sdpOffer) {
  try {
    var subscriberId = socket.request.user._id;
    var publisher = channels[publisherId];
    if (!publisher) {
      console.log('publisher not exist', publisherId);
      return;
    }
    var subscriber = publisher.subscribers[subscriberId];
    if (subscriber)
      subscriber.release();
    subscriber = new Subscriber(subscriberId, publisher);
    publisher.subscribers[subscriberId] = subscriber;
    var onSubscribeCandidate = function(candidate) {
      socket.emit(CHANNEL_ID, JSON.stringify({
        id: 'subscribeCandidate',
        publisherId: publisherId,
        subscriberId: subscriberId,
        candidate: candidate
      }));
    }
    var onSubscribeResponse = function(sdpAnswer) {
      socket.emit(CHANNEL_ID, JSON.stringify({
        id: 'subscribeAnswer',
        publisherId: publisherId,
        subscriberId: subscriberId,
        sdpAnswer: sdpAnswer
      }));
      publisher.connect(subscriber);
    };
    console.log('Subscribe to ', subscriber.subscriberId, ' publisher ', publisher.publisherId);
    subscriber.processOffer(sdpOffer, onSubscribeCandidate, onSubscribeResponse);
  } catch (exc) {
    console.log('Subscribe offer error ', exc);
  }
}

function subscribeCandidate(socket, publisherId, candidate) {
  try {
    var subscriberId = socket.request.user._id;
    var publisher = channels[publisherId];
    if (!publisher) {
      console.log('publisher not exist', publisherId);
      return;
    }
    var subscriber = publisher.subscribers[subscriberId];
    subscriber.processCandidate(candidate);
  } catch (exc) {
    console.log('Subscribe candidate error ', exc);
  }
}

module.exports = function(io, socket) {

  socket.on(CHANNEL_ID, function(message) {
    console.log(CHANNEL_ID, ' receive: ', message);

    switch (message.id) {
      case 'publishOffer':
        publishOffer(socket, message.sdpOffer);
        break;
      case 'publishCandidate':
        publishCandidate(socket, message.candidate);
        break;
      case 'subscribeOffer':
        subscribeOffer(socket, message.publisherId, message.sdpOffer);
        break;
      case 'subscribeCandidate':
        subscribeCandidate(socket, message.publisherId, message.candidate);
        break;
      case 'unpublish':
        unpublish(socket);
        break;
      case 'unsubscribe':
        unsubscribe(socket);
        break;
      default:
        console.log('Error to parse');
        break;
    }
  });

};
