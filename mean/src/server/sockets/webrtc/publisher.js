var kurento = require('kurento-client');
var _ = require('underscore');
var kurentoClient = null;
var path = require('path');
var config = require(path.resolve('./config/config'));
var channelId = 0;

function Publisher(publisherId) {
  this.publisherId = publisherId;
  this.pipeline = null;
  this.pubWebRtcEndpoint = null;
  this.sdpOffer = null;
  this.pubCandidateRecvQueue = [];
  this.subscribers = {};
}


function getKurentoClient(callback) {
  if (kurentoClient !== null) {
    console.log('Reuse existing client');
    return callback(null, kurentoClient);
  }
  console.log(config.mediaServerUrl);
  kurento(config.mediaServerUrl, function(error, _kurentoClient) {
    if (error) {
      var message = 'Coult not find media server at address ';
      return callback(message + ". Exiting with error " + error);
    }
    console.log('Create new client');
    kurentoClient = _kurentoClient;
    callback(null, kurentoClient);
  });
}

Publisher.prototype.connect = function(subscriber, callback) {
  this.pubWebRtcEndpoint.connect(subscriber.subWebRtcEndpoint, function(error) {
    if (error) {
      console.log(error);
      return;
    }
    if (callback)
      callback();
  });
}


Publisher.prototype.release = function() {
  try {
    if (this.pipeline)
      this.pipeline.release();
    if (this.pubWebRtcEndpoint)
      this.pubWebRtcEndpoint.release();
  } catch (exc) {
    console.log("Release resoure for publisher" + this.id);
  }
}

Publisher.prototype.processCandidate = function(_candidate) {
  var self = this;
  var candidate = kurento.getComplexType('IceCandidate')(_candidate);
  if (self.sdpOffer && self.pubWebRtcEndpoint) {
    self.pubWebRtcEndpoint.addIceCandidate(candidate);
  } else
    self.pubCandidateRecvQueue.push(candidate);
}

Publisher.prototype.processOffer = function(sdpOffer, onPublishCandidate, onPublishResponse) {
  var self = this;
  getKurentoClient(function(error, kurentoClient) {
    if (error) {
      console.log(error)
      return;
    }
    kurentoClient.create('MediaPipeline', function(error, pipeline) {
      if (error) {
        console.log(error);
        return;
      }
      pipeline.create('WebRtcEndpoint', function(error, pubWebRtcEndpoint) {
        if (error) {
          console.log(error);
          return;
        }
        self.pipeline = pipeline;
        self.pubWebRtcEndpoint = pubWebRtcEndpoint;
        self.pubWebRtcEndpoint.on('OnIceCandidate', function(event) {
          var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
          onPublishCandidate(candidate);
        });
        self.pubWebRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
          if (error) {
            console.log(error)
            return;
          }
          self.sdpOffer = sdpOffer;
          console.log('Channel' + self.publisherId + ' answer', sdpAnswer);
          while (self.pubCandidateRecvQueue.length) {
            var candidate = self.pubCandidateRecvQueue.shift();
            self.pubWebRtcEndpoint.addIceCandidate(candidate);
          }
          self.pubWebRtcEndpoint.gatherCandidates(function(error) {
            if (error) {
              console.log(error)
              return;
            }
            onPublishResponse(sdpAnswer);
          });

        });
      });
    });
  });
}

module.exports = Publisher
