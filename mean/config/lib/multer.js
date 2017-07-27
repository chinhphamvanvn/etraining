'use strict';

module.exports.imageFileFilter = function(req, file, callback) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.videoFileFilter = function(req, file, callback) {
  console.log(file);
  if (file.mimetype !== 'video/webm' && file.mimetype !== 'audio/webm' && file.mimetype !== 'video/avi' && file.mimetype !== 'video/mov' && file.mimetype !== 'video/mp4' && file.mimetype !== 'video/flv' && file.mimetype !== 'video/mpeg') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.audioFileFilter = function(req, file, callback) {
  console.log(file);
  if (file.mimetype !== 'audio/webm' && file.mimetype !== 'audio/wav' && file.mimetype !== 'audio/mp3' && file.mimetype !== 'audio/mp4' && file.mimetype !== 'audio/wma') {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};

module.exports.pdfFileFilter = function(req, file, callback) {
  console.log(file);
  if (file.mimetype !== 'application/pdf' ) {
    var err = new Error();
    err.code = 'UNSUPPORTED_MEDIA_TYPE';
    return callback(err, false);
  }
  callback(null, true);
};
