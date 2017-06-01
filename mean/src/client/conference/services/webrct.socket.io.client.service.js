(function(kurentoUtils) {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('webrtcSocket', webrtcSocket);

  webrtcSocket.$inject = ['localStorageService', '$state', '$timeout', 'Socket'];

  function webrtcSocket(localStorageService, $state, $timeout, Socket) {
    var CHANNEL_ID = 'webrtc';
    var publisher = {},
      subscribers = {};

    function send(data) {
      Socket.emit(CHANNEL_ID, data);
    }

    // Wrap the Socket.io 'removeListener' method
    function removeListener() {
      Socket.removeListener(CHANNEL_ID);
    }

    function publishAnswer(message) {
      publisher.webRtcEndpoint.processAnswer(message.sdpAnswer, function(err) {
        console.log('Process answer');
        if (!err) {
          publisher.sdpAnswer = message.sdpAnswer;
          console.log('Process queuing candidate');
          while (publisher.candidateRecvQueue.length)
          publisher.webRtcEndpoint.addIceCandidate(publisher.candidateRecvQueue.shift());
          publisher.callback();
        }
      });
    }

    function publishCandidate(message) {
      if (publisher.sdpAnswer) {
        console.log('Process candidate');
        publisher.webRtcEndpoint.addIceCandidate(message.candidate);
      } else {
        console.log('Queue candidate');
        publisher.candidateRecvQueue.push(message.candidate);
      }
    }

    function subscribeAnswer(message) {
      var subscriber = subscribers[message.publisherId];
      subscriber.webRtcEndpoint.processAnswer(message.sdpAnswer, function(err) {
        if (!err) {
          subscriber.sdpAnswer = message.sdpAnswer;
          console.log('Process queuing candidate');
          while (subscriber.candidateRecvQueue.length)
          subscriber.webRtcEndpoint.addIceCandidate(subscriber.candidateRecvQueue.shift());
          subscriber.candidateRecvQueue = [];
          subscriber.callback();
        }
      });
    }

    function subscribeCandidate(message) {
      var subscriber = subscribers[message.publisherId];
      if (subscriber.sdpAnswer) {
        console.log('Process candidate');
        subscriber.webRtcEndpoint.addIceCandidate(message.candidate);
      } else {
        console.log('Queue candidate');
        subscriber.candidateRecvQueue.push(message.candidate);
      }
    }

    Socket.on(CHANNEL_ID, function(data) {
      var parsedMessage = JSON.parse(data);
      console.info('Received message: ' + data);
      switch (parsedMessage.id) {
        case 'publishAnswer':
          publishAnswer(parsedMessage);
          break;
        case 'publishCandidate':
          publishCandidate(parsedMessage);
          break;
        case 'subscribeAnswer':
          subscribeAnswer(parsedMessage);
          break;
        case 'subscribeCandidate':
          subscribeCandidate(parsedMessage);
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    });

    return {
      unpublish: function() {
        var message = {
          id: 'unpublish'
        }
        send(message);
        if (publisher && publisher.webRtcEndpoint)
          publisher.webRtcEndpoint.dispose();
      },
      unsubscribe: function(publisherId) {
        var message = {
          id: 'unsubscribe',
          publisherId: publisherId
        }
        send(message);
        var subscriber = subscribers[publisherId];
        if (subscriber) {
          if (subscriber && subscriber.webRtcEndpoint)
            subscriber.webRtcEndpoint.dispose();
        }
      },
      publishWebcam: function(localVideo, callback) {
        publisher.id = localStorageService.get('userId');
        publisher.callback = callback;
        publisher.sdpAnswer = null;
        publisher.candidateRecvQueue = [];
        var onIceCandidate = function(candidate) {
          var message = {
            id: 'publishCandidate',
            candidate: candidate,
          }
          send(message);
        }
        var options = {
          localVideo: localVideo,
          onicecandidate: onIceCandidate,
        };
        publisher.webRtcEndpoint = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
          if (error) {
            console.log(error);
            return;
          }
          this.generateOffer(function(error, sdpOffer) {
            if (error) {
              console.log(error);
              return;
            }
            publisher.sdpOffer = sdpOffer;
            var message = {
              id: 'publishOffer',
              sdpOffer: publisher.sdpOffer,
            }
            send(message);
          });
        });
      },
      subscribe: function(remoteVideo, publisherId, callback) {
        subscribers[publisherId] = {
          callback: callback,
          sdpAnswer: null,
          candidateRecvQueue: []
        };
        var onIceCandidate = function(candidate) {
          var message = {
            id: 'subscribeCandidate',
            candidate: candidate,
            publisherId: publisherId
          }
          send(message);
        }
        var options = {
          remoteVideo: remoteVideo,
          onicecandidate: onIceCandidate,
        }
        subscribers[publisherId].webRtcEndpoint = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
          if (error) {
            console.log(error);
            return;
          }
          this.generateOffer(function(error, sdpOffer) {
            if (error) {
              console.log(error);
              return;
            }
            subscribers[publisherId].sdpOffer = sdpOffer
            var message = {
              id: 'subscribeOffer',
              publisherId: publisherId,
              sdpOffer: sdpOffer
            }
            send(message);
          });
        });
      },
      getPublish: function(){
        return publisher;
      }
    }
  }
}(window.kurentoUtils));
