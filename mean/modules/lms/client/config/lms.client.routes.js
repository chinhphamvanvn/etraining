(function () {
  'use strict';

  angular
    .module('cms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workspace.lms', {
        abstract: true,
        url: '/lms',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.me', {
        url: '/me',
        templateUrl: '/modules/lms/client/views/my-courses.client.view.html',
        controller: 'MyCoursesListController',
        controllerAs: 'vm',
        data: {
            roles: [ 'user'],
            courseRoles: [ 'teacher','student']
        }
      })
      .state('workspace.lms.courses.list', {
        url: '/list',
        templateUrl: '/modules/lms/client/views/list-courses.client.view.html',
        controller: 'LmsCoursesListController',
        controllerAs: 'vm',
        data: {
            roles: [ 'user'],
            courseRoles: [ 'teacher','student']
        }
      })
      .state('workspace.lms.courses.outline', {
        url: '/outline/:courseId/:editionId',
        templateUrl: '/modules/lms/client/views/teacher/outline-course.client.view.html',
        controller: 'CoursesOutlineController',
        controllerAs: 'vm',
        resolve: {
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.outline.edit', {
        url: '/edit',
        templateUrl: '/modules/lms/client/views/teacher/edit-outline-course.client.view.html',
        controller: 'CoursesOutlineEditController',
        controllerAs: 'vm',
        resolve: {
            editionResolve: getEdition,
            courseResolve: getCourse
          },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.outline.preview', {
        url: '/preview',
        templateUrl: '/modules/lms/client/views/teacher/preview-outline-course.client.view.html',
        controller: 'CoursesOutlinePreviewController',
        controllerAs: 'vm',
        resolve: {
            editionResolve: getEdition,
            courseResolve: getCourse
          },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
       .state('workspace.lms.courses.outline.preview.html', {
            url: '/html/:sectionId',
            templateUrl: '/modules/lms/client/views/teacher/preview-html-course.client.view.html',
            controller: 'CoursesPreviewHtmlController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.outline.preview.quiz', {
            url: '/quiz/:sectionId',
            templateUrl: '/modules/lms/client/views/teacher/preview-quiz-course.client.view.html',
            controller: 'CoursesPreviewQuizController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.outline.preview.survey', {
            url: '/survey/:sectionId',
            templateUrl: '/modules/lms/client/views/teacher/preview-survey-course.client.view.html',
            controller: 'CoursesPreviewSurveyController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.outline.preview.video', {
            url: '/video/:sectionId',
            templateUrl: '/modules/lms/client/views/teacher/preview-video-course.client.view.html',
            controller: 'CoursesPreviewVideoController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
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
        templateUrl: '/modules/lms/client/views/teacher/view-html.section-course.client.view.html',
        controller: 'CoursesHTMLSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          htmlResolve: getHtml
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.view.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/view-quiz.section-course.client.view.html',
        controller: 'CoursesQuizSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          quizResolve: getQuiz
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.view.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/view-survey.section-course.client.view.html',
        controller: 'CoursesSurveySectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          surveyResolve: getSurvey
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.view.video', {
        url: '/video/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/view-video.section-course.client.view.html',
        controller: 'CoursesVideoSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          videoResolve: getVideo
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.edit', {
        abstract: true,
        url: '/edit',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.edit.html', {
        url: '/html/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/form-html.section-course.client.view.html',
        controller: 'CoursesHTMLSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          htmlResolve: getHtml
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.quiz', {
        url: '/quiz/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/form-quiz.section-course.client.view.html',
        controller: 'CoursesQuizSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          quizResolve: getQuiz
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.survey', {
        url: '/survey/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/form-survey.section-course.client.view.html',
        controller: 'CoursesSurveySectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          surveyResolve: getSurvey
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.edit.video', {
        url: '/video/:sectionId',
        templateUrl: '/modules/lms/client/views/teacher/form-video.section-course.client.view.html',
        controller: 'CoursesVideoSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          editionResolve: getEdition,
          courseResolve: getCourse,
          videoResolve: getVideo
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.grade', {
        url: '/grade/:courseId/:editionId',
        templateUrl: '/modules/lms/client/views/teacher/grade-course.client.view.html',
        controller: 'CoursesGradeController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          schemeResolve: getGradescheme,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.join', {
        url: '/join/:courseId/:editionId',
        templateUrl: '/modules/lms/client/views/course-board/join-course.client.view.html',
        controller: 'CoursesJoinController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          editionResolve: getEdition
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'student','teacher']
        }
      })
      .state('workspace.lms.courses.join.intro', {
        url: '/intro',
        templateUrl: '/modules/lms/client/views/course-board/intro-course.client.view.html',
        controller: 'CoursesIntroController',
        controllerAs: 'vm',
        resolve: {
            userResolve: getUser,
          },
        data: {
          roles: ['user'],
          courseRoles: [ 'student','teacher']
        }
      })
      .state('workspace.lms.courses.join.study', {
        url: '/study',
        templateUrl: '/modules/lms/client/views/course-board/study-course.client.view.html',
        controller: 'CoursesStudyController',
        controllerAs: 'vm',
        resolve: {
            editionResolve: getEdition,
            memberResolve: getMember
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'student']
        }
      })
        .state('workspace.lms.courses.join.study.html', {
            url: '/html/:sectionId',
            templateUrl: '/modules/lms/client/views/course-board/study-html-course.client.view.html',
            controller: 'CoursesStudyHtmlController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                memberResolve: getMember,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.join.study.quiz', {
            url: '/quiz/:sectionId',
            templateUrl: '/modules/lms/client/views/course-board/study-quiz-course.client.view.html',
            controller: 'CoursesStudyQuizController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                memberResolve: getMember,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.join.study.survey', {
            url: '/survey/:sectionId',
            templateUrl: '/modules/lms/client/views/course-board/study-survey-course.client.view.html',
            controller: 'CoursesStudySurveyController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                memberResolve: getMember,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
        })
        .state('workspace.lms.courses.join.study.video', {
            url: '/video/:sectionId',
            templateUrl: '/modules/lms/client/views/course-board/study-video-course.client.view.html',
            controller: 'CoursesStudyVideoController',
            controllerAs: 'vm',
            resolve: {
                sectionResolve: getSection,
                memberResolve: getMember,
                editionResolve: getEdition
            },
            data: {
              roles: ['user'],
              courseRoles: [ 'student']
            }
      }).state('workspace.lms.courses.join.material', {
          url: '/material',
          templateUrl: '/modules/lms/client/views/course-board/material-course.client.view.html',
          controller: 'CoursesMaterialController',
          controllerAs: 'vm',
          resolve: {
              memberResolve: getMember,
              editionResolve: getEdition,
              courseResolve: getCourse
          },
          data: {
            roles: ['user'],
            courseRoles: [ 'student']
          }
        })
      .state('workspace.lms.courses.join.forum', {
        url: '/forum',
        templateUrl: '/modules/lms/client/views/course-board/forum-course.client.view.html',
        controller: 'CoursesForumController',
        controllerAs: 'vm',
        resolve: {
            memberResolve: getMember,
            courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'student']
        }
      })
      .state('workspace.lms.courses.join.gradebook', {
        url: '/gradebook',
        templateUrl: '/modules/lms/client/views/course-board/gradebook-course.client.view.html',
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
          courseRoles: [ 'student']
        }
      })
      .state('workspace.lms.courses.join.gradeboard', {
        url: '/gradeboard',
        templateUrl: '/modules/lms/client/views/teacher/gradeboard-course.client.view.html',
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
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.join.survey', {
        url: '/survey',
        templateUrl: '/modules/lms/client/views/teacher/survey-course.client.view.html',
        controller: 'CoursesSurveyController',
        controllerAs: 'vm',
        resolve: {
            editionResolve: getEdition,
            courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.join.gradeboard.member', {
        url: '/:memberId',
        templateUrl: '/modules/lms/client/views/teacher/gradebook-course.client.view.html',
        controller: 'CoursesGradeboardMemberController',
        controllerAs: 'vm',
        resolve: {
            memberResolve: getMember,
            editionResolve: getEdition,
            courseResolve: getCourse,
            gradeResolve: getGradescheme,
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.join.stats', {
        url: '/stats',
        templateUrl: '/modules/lms/client/views/course-board/stats-course.client.view.html',
        controller: 'CoursesStatsController',
        controllerAs: 'vm',
        resolve: {
            memberResolve: getMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher']
        }
      });
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
          return CourseEditionsService.get({editionId:$stateParams.editionId}).$promise;
      return  CourseEditionsService.byCourse({courseId:$stateParams.courseId}).$promise;
  }
  
  getGradescheme.$inject = ['$stateParams', 'GradeSchemesService', '$q'];

  function getGradescheme($stateParams, GradeSchemesService, $q) {
      if ($stateParams.schemeId)
          return GradeSchemesService.get({schemeId:$stateParams.schemeId}).$promise;
      return $q(function(resolve, reject) {
          var scheme = GradeSchemesService.byEdition({editionId:$stateParams.editionId},function(data) {
          resolve(data);
      }, function(err) {
          var scheme = new GradeSchemesService();
          scheme.edition = $stateParams.editionId;
          scheme.$save(function() {
              resolve(scheme);
          },function(errorResponse) {
              reject();
          });
      });
      });
      
  }
  
  getHtml.$inject = ['$stateParams', 'EditionSectionsService','HtmlsService', '$q'];

  function getHtml($stateParams, EditionSectionsService, HtmlsService, $q) {
      if ($stateParams.htmlId)
          return HtmlsService.get({htmlId:$stateParams.htmlId}).$promise;
      return $q(function(resolve, reject) {
          EditionSectionsService.get({sectionId:$stateParams.sectionId},function(section) {
              if (section.html) {
                  HtmlsService.get({htmlId:section.html},function(html) {
                      resolve(html);
                  },function() {
                      reject();
                  })
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
  
  getQuiz.$inject = ['$stateParams', 'EditionSectionsService','ExamsService', '$q'];

  function getQuiz($stateParams, EditionSectionsService, ExamsService, $q) {
      if ($stateParams.examId)
          return ExamsService.get({examId:$stateParams.examId}).$promise;
      return $q(function(resolve, reject) {
          EditionSectionsService.get({sectionId:$stateParams.sectionId},function(section) {
              if (section.quiz) {
                  ExamsService.get({examId:section.quiz},function(quiz) {
                      resolve(quiz);
                  },function() {
                      reject();
                  })
              } else {
                  var quiz = new ExamsService();
                  quiz.type='quiz';
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
  
  getSurvey.$inject = ['$stateParams', 'EditionSectionsService','ExamsService', '$q'];

  function getSurvey($stateParams, EditionSectionsService, ExamsService, $q) {
      if ($stateParams.examId)
          return ExamsService.get({examId:$stateParams.examId}).$promise;
      return $q(function(resolve, reject) {
          EditionSectionsService.get({sectionId:$stateParams.sectionId},function(section) {
              if (section.survey) {
                  ExamsService.get({examId:section.survey},function(survey) {
                      resolve(survey);
                  },function() {
                      reject();
                  })
              } else {
                  var survey = new ExamsService();
                  survey.type='survey';
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
  
  getVideo.$inject = ['$stateParams', 'EditionSectionsService','VideosService', '$q'];

  function getVideo($stateParams, EditionSectionsService, VideosService, $q) {
      if ($stateParams.videoId)
          return VideosService.get({videoId:$stateParams.videoId}).$promise;
      return $q(function(resolve, reject) {
          EditionSectionsService.get({sectionId:$stateParams.sectionId},function(section) {
              if (section.video) {
                  VideosService.get({videoId:section.video},function(video) {
                      resolve(video);
                  },function() {
                      reject();
                  })
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
  
  getMember.$inject = ['$stateParams', 'CourseMembersService','localStorageService'];

  function getMember($stateParams, CourseMembersService,localStorageService) {
      if ($stateParams.memberId)
          return CourseMembersService.get({memberId:$stateParams.memberId}).$promise;
    return CourseMembersService.byUserAndCourse({courseId:$stateParams.courseId,userId:localStorageService.get('userId')}).$promise;
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
  
  getUser.$inject = [ 'UsersService'];

  function getUser( UsersService) {
      return UsersService.me().$promise;
  }
}());
