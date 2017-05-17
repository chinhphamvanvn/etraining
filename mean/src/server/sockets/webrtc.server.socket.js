'use strict';
var Publisher = require('./webrtc/publisher.js');
var Subscriber = require('./webrtc/subscriber.js');
var CHANNEL_ID = 'webrtc';
var channels = {};

function publishOffer(socket, publisherId, sdpOffer) {
  try {
    var channel = channels[publisherId];
    var publisher;
    if (channel) {
      publisher = channels[publisherId]
      publisher.release();
      _.each(channel.subscribers, function(sub) {
        sub.release();
      });
      publisher = new Publisher(publisherId);
      channels[publisherId] = { publisher: publisher, subscribers: {}}
    }
    else {
      publisher = new Publisher(publisherId);
      channels[publisherId] = { publisher: publisher, subscribers: {}}
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
    console.log('Publish offer error ', exc, publisherId);
  }
}


function publishCandidate(socket, publisherId, candidate) {
  try {
    var channel = channels[publisherId];
    var publisher = channel.publisher;
    publisher.processCandidate(candidate);

  } catch (exc) {
    console.log('Publish candidate error ', exc, publisherId);
  }
}

function subscribeOffer(socket, publisherId, subscriberId, sdpOffer) {
  try {
    var channel = channels[publisherId];
    if (!channel) {
      console.log('Channel not exist', publisherId);
      return;
    }
    var publisher = channel.publisher;
    var subscriber = channel.subscribers[subscriberId];
    if (subscriber)
      subscriber.release();
    subscriber = new Subscriber(subscriberId, publisher);
    channel.subscribers[subscriberId] =  subscriber;
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
    subscriber.processOffer( sdpOffer, onSubscribeCandidate, onSubscribeResponse);
  } catch (exc) {
    console.log('Subscribe offer error ', exc, sessionId, channelId, subscriberId);
  }
}

function subscribeCandidate(socket, publisherId, subscriberId, candidate) {
  try {
    var channel = channels[publisherId];
    if (!channel) {
      console.log('Channel not exist', publisherId);
      return;
    }
    var subscriber = channel.subscribers[subscriberId];
    subscriber.processCandidate(candidate);
  } catch (exc) {
    console.log('Subscribe candidate error ', exc, subscriberId);
  }
}

module.exports = function(io, socket) {

  socket.on(CHANNEL_ID, function(message) {
    console.log(CHANNEL_ID, ' receive: ', message);

    switch (message.id) {
      case 'publishOffer':
        publishOffer(socket, message.publisherId, message.sdpOffer);
        break;
      case 'publishCandidate':
        publishCandidate(socket, message.publisherId, message.candidate);
        break;
      case 'subscribeOffer':
        subscribeOffer(socket, message.publisherId, message.subscriberId, message.sdpOffer);
        break;
      case 'subscribeCandidate':
        subscribeCandidate(socket, message.publisherId, message.subscriberId, message.candidate);
        break;
      default:
        console.log('Error to parse');
        break;
      }
    });

};
