(function() {
  'use strict';

  angular
    .module('lms.routes.course')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workspace.lms.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.me', {
        url: '/me',
        templateUrl: '/src/client/lms/views/my-courses.client.view.html',
        controller: 'MyCoursesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.courses.list', {
        url: '/list',
        templateUrl: '/src/client/lms/views/list-courses.client.view.html',
        controller: 'LmsCoursesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.courses.search', {
        url: '/search/:keyword',
        templateUrl: '/src/client/lms/views/list-courses.client.view.html',
        controller: 'LmsCoursesSearchController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.courses.outline', {
        url: '/outline/:courseId/:editionId',
        templateUrl: '/src/client/lms/views/course-board/teacher/outline-course.client.view.html',
        controller: 'CoursesOutlineController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.outline.edit', {
        url: '/edit',
        templateUrl: '/src/client/lms/views/course-board/teacher/edit-outline-course.client.view.html',
        controller: 'CoursesOutlineEditController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.outline.preview', {
        url: '/preview',
        templateUrl: '/src/client/lms/views/course-board/teacher/preview-outline-course.client.view.html',
        controller: 'CoursesOutlinePreviewController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.outline.preview.html', {
        url: '/html/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/html/preview-html-course.client.view.html',
        controller: 'CoursesPreviewHtmlController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.outline.preview.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/test/preview-quiz-course.client.view.html',
        controller: 'CoursesPreviewQuizController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.outline.preview.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/survey/preview-survey-course.client.view.html',
        controller: 'CoursesPreviewSurveyController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.outline.preview.video', {
        url: '/video/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/video/preview-video-course.client.view.html',
        controller: 'CoursesPreviewVideoController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.outline.preview.exercise', {
        url: '/exercise/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/exercise/preview-exercise-course.client.view.html',
        controller: 'CoursesPreviewExerciseController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.section', {
        abstract: true,
        url: '/section/:courseId/:editionId',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.view', {
        abstract: true,
        url: '/view',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.view.html', {
        url: '/html/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/html/view-html.section-course.client.view.html',
        controller: 'CoursesHTMLSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          htmlResolve: getHtml
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.view.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/test/view-quiz.section-course.client.view.html',
        controller: 'CoursesQuizSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          quizResolve: getQuiz
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.view.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/survey/view-survey.section-course.client.view.html',
        controller: 'CoursesSurveySectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          surveyResolve: getSurvey
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.view.video', {
        url: '/video/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/video/view-video.section-course.client.view.html',
        controller: 'CoursesVideoSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          videoResolve: getVideo
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.view.exercise', {
        url: '/exercise/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/exercise/view-exercise.section-course.client.view.html',
        controller: 'CoursesExerciseSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          exerciseResolve: getExercise
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.edit', {
        abstract: true,
        url: '/edit',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.edit.html', {
        url: '/html/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/html/form-html.section-course.client.view.html',
        controller: 'CoursesHTMLSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          htmlResolve: getHtml
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/test/form-quiz.section-course.client.view.html',
        controller: 'CoursesQuizSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          quizResolve: getQuiz
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/survey/form-survey.section-course.client.view.html',
        controller: 'CoursesSurveySectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          surveyResolve: getSurvey
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.video', {
        url: '/video/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/video/form-video.section-course.client.view.html',
        controller: 'CoursesVideoSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          videoResolve: getVideo
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.exercise', {
        url: '/exercise/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/exercise/form-exercise.section-course.client.view.html',
        controller: 'CoursesExerciseSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          exerciseResolve: getExercise
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.grade', {
        url: '/grade/:courseId/:editionId',
        templateUrl: '/src/client/lms/views/course-board/teacher/grade-course.client.view.html',
        controller: 'CoursesGradeController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          schemeResolve: getGradescheme,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join', {
        url: '/join/:courseId/:editionId',
        templateUrl: '/src/client/lms/views/course-board/join-course.client.view.html',
        controller: 'CoursesJoinController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student', 'teacher']
        }
      })
      .state('workspace.lms.courses.join.intro', {
        url: '/intro',
        templateUrl: '/src/client/lms/views/course-board/intro-course.client.view.html',
        controller: 'CoursesIntroController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['user'],
          courseRoles: ['student', 'teacher']
        }
      })
      .state('workspace.lms.courses.join.study', {
        url: '/study',
        templateUrl: '/src/client/lms/views/course-board/study-course.client.view.html',
        controller: 'CoursesStudyController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          memberResolve: getMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.study.html', {
        url: '/html/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/html/study-html-course.client.view.html',
        controller: 'CoursesStudyHtmlController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          memberResolve: getMember,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.study.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/test/study-quiz-course.client.view.html',
        controller: 'CoursesStudyQuizController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          memberResolve: getMember,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.study.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/survey/study-survey-course.client.view.html',
        controller: 'CoursesStudySurveyController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          memberResolve: getMember,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.study.video', {
        url: '/video/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/video/study-video-course.client.view.html',
        controller: 'CoursesStudyVideoController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          memberResolve: getMember,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.study.exercise', {
        url: '/exercise/:sectionId',
        templateUrl: '/src/client/lms/views/course-board/course-unit/exercise/study-exercise-course.client.view.html',
        controller: 'CoursesStudyExerciseController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          memberResolve: getMember,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.material', {
        url: '/material',
        templateUrl: '/src/client/lms/views/course-board/material-course.client.view.html',
        controller: 'CoursesMaterialController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.forum', {
        url: '/forum',
        templateUrl: '/src/client/lms/views/course-board/forum-course.client.view.html',
        controller: 'CoursesForumController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.gradebook', {
        url: '/gradebook',
        templateUrl: '/src/client/lms/views/course-board/gradebook-course.client.view.html',
        controller: 'CoursesGradebookController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
          gradeResolve: getGradescheme
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.classroom', {
        abstract: true,
        url: '/classroom',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.join.classroom.student', {
        url: '/student/:classroomId',
        templateUrl: '/src/client/lms/views/course-board/classroom-course.client.view.html',
        controller: 'CoursesStudentClassroomController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
          classroomResolve: getClassroom
        },
        data: {
          roles: ['user'],
          courseRoles: ['student']
        }
      })
      .state('workspace.lms.courses.join.classroom.teacher', {
        url: '/teacher',
        templateUrl: '/src/client/lms/views/course-board/teacher/classroom-course.client.view.html',
        controller: 'CoursesTeacherClassroomController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.gradeboard', {
        url: '/gradeboard',
        templateUrl: '/src/client/lms/views/course-board/teacher/gradeboard-course.client.view.html',
        controller: 'CoursesGradeboardController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
          gradeResolve: getGradescheme
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.exercise', {
        url: '/exercise',
        templateUrl: '/src/client/lms/views/course-board/teacher/exercise-course.client.view.html',
        controller: 'CoursesExerciseController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.exercise.feedback', {
        url: '/feedback/:attemptId/:exerciseId',
        templateUrl: '/src/client/lms/views/course-board/teacher/feedback-course.client.view.html',
        controller: 'CoursesExerciseFeedbackController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
          exerciseResolve: getExercise,
          attemptResolve: getAttempt,
          feedbacksResolve: getFeedbacksForAttempt
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.survey', {
        url: '/survey',
        templateUrl: '/src/client/lms/views/course-board/teacher/survey-course.client.view.html',
        controller: 'CoursesSurveyController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.gradeboard-member', {
        url: '/gradeboard/member/:memberId',
        templateUrl: '/src/client/lms/views/course-board/teacher/gradebook-course.client.view.html',
        controller: 'CoursesGradeboardMemberController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: getMember,
          editionResolve: getEdition,
          courseResolve: getCourse,
          gradeResolve: getGradescheme
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      })
      .state('workspace.lms.courses.join.stats', {
        url: '/stats',
        templateUrl: '/src/client/lms/views/course-board/teacher/stats-course.client.view.html',
        controller: 'CoursesStatsController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      }) ;
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  getEdition.$inject = ['$stateParams', 'CourseEditionsService'];

  function getEdition($stateParams, CourseEditionsService) {
    if ($stateParams.editionId)
      return CourseEditionsService.get({
        editionId: $stateParams.editionId
      }).$promise;
    return CourseEditionsService.byCourse({
      courseId: $stateParams.courseId
    }).$promise;
  }

  getGradescheme.$inject = ['$stateParams', 'GradeSchemesService', '$q'];

  function getGradescheme($stateParams, GradeSchemesService, $q) {
    if ($stateParams.schemeId)
      return GradeSchemesService.get({
        schemeId: $stateParams.schemeId
      }).$promise;
    return $q(function(resolve, reject) {
      var scheme = GradeSchemesService.byEdition({
        editionId: $stateParams.editionId
      }, function(data) {
        resolve(data);
      }, function(err) {
        var scheme = new GradeSchemesService();
        scheme.edition = $stateParams.editionId;
        scheme.$save(function() {
          resolve(scheme);
        }, function(errorResponse) {
          reject();
        });
      });
    });

  }

  getHtml.$inject = ['$stateParams', 'EditionSectionsService', 'HtmlsService', '$q'];

  function getHtml($stateParams, EditionSectionsService, HtmlsService, $q) {
    if ($stateParams.htmlId)
      return HtmlsService.get({
        htmlId: $stateParams.htmlId
      }).$promise;
    return $q(function(resolve, reject) {
      EditionSectionsService.get({
        sectionId: $stateParams.sectionId
      }, function(section) {
        if (section.html) {
          HtmlsService.get({
            htmlId: section.html
          }, function(html) {
            resolve(html);
          }, function() {
            reject();
          });
        } else {
          var html = new HtmlsService();
          html.$save(function() {
            resolve(html);
          });
        }
      }, function(err) {
        reject();
      });
    });
  }

  getQuiz.$inject = ['$stateParams', 'EditionSectionsService', 'ExamsService', '$q'];

  function getQuiz($stateParams, EditionSectionsService, ExamsService, $q) {
    if ($stateParams.examId)
      return ExamsService.get({
        examId: $stateParams.examId
      }).$promise;
    return $q(function(resolve, reject) {
      EditionSectionsService.get({
        sectionId: $stateParams.sectionId
      }, function(section) {
        if (section.quiz) {
          ExamsService.get({
            examId: section.quiz
          }, function(quiz) {
            resolve(quiz);
          }, function() {
            reject();
          });
        } else {
          var quiz = new ExamsService();
          quiz.type = 'quiz';
          quiz.maxAttempt = 1;
          quiz.questionSelection = 'manual';
          quiz.$save(function() {
            resolve(quiz);
          });
        }

      }, function(err) {
        reject();
      });
    });
  }

  getSurvey.$inject = ['$stateParams', 'EditionSectionsService', 'ExamsService', '$q'];

  function getSurvey($stateParams, EditionSectionsService, ExamsService, $q) {
    if ($stateParams.examId)
      return ExamsService.get({
        examId: $stateParams.examId
      }).$promise;
    return $q(function(resolve, reject) {
      EditionSectionsService.get({
        sectionId: $stateParams.sectionId
      }, function(section) {
        if (section.survey) {
          ExamsService.get({
            examId: section.survey
          }, function(survey) {
            resolve(survey);
          }, function() {
            reject();
          });
        } else {
          var survey = new ExamsService();
          survey.type = 'survey';
          survey.maxAttempt = 1;
          survey.allowNavigate = true;
          survey.questionSelection = 'manual';
          survey.$save(function() {
            resolve(survey);
          });
        }

      }, function(err) {
        reject();
      });
    });
  }

  getVideo.$inject = ['$stateParams', 'EditionSectionsService', 'VideosService', '$q'];

  function getVideo($stateParams, EditionSectionsService, VideosService, $q) {
    if ($stateParams.videoId)
      return VideosService.get({
        videoId: $stateParams.videoId
      }).$promise;
    return $q(function(resolve, reject) {
      EditionSectionsService.get({
        sectionId: $stateParams.sectionId
      }, function(section) {
        if (section.video) {
          VideosService.get({
            videoId: section.video
          }, function(video) {
            resolve(video);
          }, function() {
            reject();
          });
        } else {
          var video = new VideosService();
          video.$save(function() {
            resolve(video);
          });
        }

      }, function(err) {
        reject();
      });
    });
  }
  
  getExercise.$inject = ['$stateParams', 'EditionSectionsService', 'ExercisesService', '$q'];
  function getExercise($stateParams, EditionSectionsService, ExercisesService, $q) {
    if ($stateParams.exerciseId)
      return ExercisesService.get({
        exerciseId: $stateParams.exerciseId
      }).$promise;
    return $q(function(resolve, reject) {
      EditionSectionsService.get({
        sectionId: $stateParams.sectionId
      }, function(section) {
        if (section.exercise) {
          ExercisesService.get({
            exerciseId: section.exercise
          }, function(exercise) {
            resolve(exercise);
          }, function() {
            reject();
          });
        } else {
          var exercise = new ExercisesService();
          exercise.$save(function() {
            resolve(exercise);
          });
        }

      }, function(err) {
        reject();
      });
    });
  }

  getMember.$inject = ['$stateParams', 'CourseMembersService', 'localStorageService'];

  function getMember($stateParams, CourseMembersService, localStorageService) {
    if ($stateParams.memberId)
      return CourseMembersService.get({
        memberId: $stateParams.memberId
      }).$promise;
    return CourseMembersService.byUserAndCourse({
      courseId: $stateParams.courseId,
      userId: localStorageService.get('userId')
    }).$promise;
  }
  
  getAttempt.$inject = ['$stateParams', 'AttemptsService'];

  function getAttempt($stateParams, AttemptsService) {
    return AttemptsService.get({
      attemptId: $stateParams.attemptId
    }).$promise;
  }

  getSection.$inject = ['$stateParams', 'EditionSectionsService'];

  function getSection($stateParams, EditionSectionsService) {
    return EditionSectionsService.get({
      sectionId: $stateParams.sectionId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }

  getUser.$inject = ['UsersService'];

  function getUser(UsersService) {
    return UsersService.me().$promise;
  }

  getClassroom.$inject = ['$stateParams', 'ClassroomsService'];

  function getClassroom($stateParams, ClassroomsService) {
    return ClassroomsService.get({
      classroomId: $stateParams.classroomId
    }).$promise;
  }
  
  getFeedbacksForAttempt.$inject = ['$stateParams', 'FeedbacksService'];

  function getFeedbacksForAttempt($stateParams, FeedbacksService) {
    return FeedbacksService.byAttempt({
      attemptId: $stateParams.attemptId
    }).$promise;
  }

}());
