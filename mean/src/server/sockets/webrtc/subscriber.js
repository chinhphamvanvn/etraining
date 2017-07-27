var kurento = require('kurento-client');
var _ = require('underscore');
var path = require('path');
var config = require(path.resolve('./config/config'));
var kurentoClient = null


function Subscriber(subscriberId, publisher) {
  this.subscriberId = subscriberId;
  this.subCandidateRecvQueue = [];
  this.subWebRtcEndpoint = null;
  this.sdpOffer = null;
  this.publisher = publisher;
}

Subscriber.prototype.release = function() {
  try {
    if (this.subWebRtcEndpoint)
      this.subWebRtcEndpoint.release();
  } catch (exc) {
    console.log('Release resource for sub', this.subscriberId);
  }

}

function getKurentoClient(callback) {
  if (kurentoClient !== null) {
    console.log('Reuse existing client');
    return callback(null, kurentoClient);
  }
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

Subscriber.prototype.processCandidate = function(_candidate) {
  var self = this;
  var candidate = kurento.getComplexType('IceCandidate')(_candidate);
  self.subCandidateRecvQueue.push(candidate);
  if (self.sdpOffer && self.subWebRtcEndpoint) {
    self.subWebRtcEndpoint.addIceCandidate(candidate);
  } else
    self.subCandidateRecvQueue.push(candidate);
}

Subscriber.prototype.processOffer = function(sdpOffer, onSubscribeCandidate, onSubscribeResponse) {
  var self = this;
  getKurentoClient(function(error, kurentoClient) {
    if (error) {
      console.log(error);
      return;
    }
    if (!self.publisher.pipeline) {
      console.log(error);
      return;
    }
    self.publisher.pipeline.create('WebRtcEndpoint', function(error, subWebRtcEndpoint) {
      if (error) {
        console.log(error);
        return;
      }
      self.subWebRtcEndpoint = subWebRtcEndpoint;
      self.subWebRtcEndpoint.on('OnIceCandidate', function(event) {
        var candidate = kurento.getComplexType('IceCandidate')(event.candidate);
        onSubscribeCandidate(candidate);
      });
      self.subWebRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
        if (error) {
          console.log(error);
          return;
        }
        self.sdpOffer = sdpOffer;
        while (self.subCandidateRecvQueue.length) {
          var candidate = self.subCandidateRecvQueue.shift();
          self.subWebRtcEndpoint.addIceCandidate(candidate);
        }
        self.subWebRtcEndpoint.gatherCandidates(function(error) {
          if (error) {
            console.log(error);
            return;
          }
          onSubscribeResponse(sdpAnswer);
        });
      });
    });
  })
}

module.exports = Subscriber
