'use strict';

/**
 * Module dependencies
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function(app) {
  // Courses Routes
  app.route('/api/courses/content/convert').post(courses.convertToHtml);
  app.route('/api/courses/video/upload').post(courses.uploadCourseVideo);
  app.route('/api/courses/scorm/upload').post(courses.uploadCourseScorm);
  app.route('/api/courses/audio/upload').post(courses.uploadCourseAudio);
  app.route('/api/courses/file/upload').post(courses.uploadCourseFile);
  app.route('/api/courses/presentation/upload').post(courses.uploadCoursePresentation);
  app.route('/api/courses/image/upload').post(courses.uploadCourseImage);
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  app.route('/api/courses/public').all(coursesPolicy.isAllowed)
    .get(courses.listPublic);
  app.route('/api/courses/private').all(coursesPolicy.isAllowed)
    .get(courses.listPrivate);
  app.route('/api/courses/restricted').all(coursesPolicy.isAllowed)
    .get(courses.listRestricted);
  app.route('/api/courses/byGroup/:groupId').all(coursesPolicy.isAllowed)
    .get(courses.listByGroup);

  app.route('/api/courses/:courseId/logo').post(courses.changeCourseLogo);

  app.route('/api/courses/search').all(coursesPolicy.isAllowed)
    .get(courses.listByKeyword);

  app.route('/api/courses/:courseId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);

  // Finish by binding the Course middleware
  app.param('courseId', courses.courseByID);
};
