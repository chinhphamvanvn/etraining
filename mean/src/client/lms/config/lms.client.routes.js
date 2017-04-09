(function() {
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
        templateUrl: '/src/client/lms/views/teacher/outline-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/edit-outline-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/preview-outline-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/preview-html-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/preview-quiz-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/preview-survey-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/preview-video-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/view-html.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/view-quiz.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/view-survey.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/view-video.section-course.client.view.html',
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
      .state('workspace.lms.courses.section.edit', {
        abstract: true,
        url: '/edit',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.edit.html', {
        url: '/html/:sectionId',
        templateUrl: '/src/client/lms/views/teacher/form-html.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/form-quiz.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/form-survey.section-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/form-video.section-course.client.view.html',
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
      .state('workspace.lms.courses.grade', {
        url: '/grade/:courseId/:editionId',
        templateUrl: '/src/client/lms/views/teacher/grade-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/course-board/study-html-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/course-board/study-quiz-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/course-board/study-survey-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/course-board/study-video-course.client.view.html',
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
      }).state('workspace.lms.courses.join.material', {
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
        templateUrl: '/src/client/lms/views/teacher/classroom-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/gradeboard-course.client.view.html',
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
      .state('workspace.lms.courses.join.survey', {
        url: '/survey',
        templateUrl: '/src/client/lms/views/teacher/survey-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/gradebook-course.client.view.html',
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
        templateUrl: '/src/client/lms/views/teacher/stats-course.client.view.html',
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
      })
      .state('workspace.lms.exams', {
        abstract: true,
        url: '/exams',
        template: '<ui-view/>'
      })
      .state('workspace.lms.exams.me', {
        url: '/me',
        templateUrl: '/src/client/lms/views/my-exams.client.view.html',
        controller: 'MyExamsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.edit', {
        url: '/edit/:scheduleId/:examId',
        templateUrl: '/src/client/lms/views/instructor/form-exam.client.view.html',
        controller: 'ExamsController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.view', {
        url: '/view/:scheduleId/:examId',
        templateUrl: '/src/client/lms/views/instructor/view-exam.client.view.html',
        controller: 'ExamViewController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.preview', {
        url: '/preview/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/instructor/preview-exam.client.view.html',
        controller: 'ExamsPreviewController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.grade', {
        url: '/grade/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/instructor/grade-exam.client.view.html',
        controller: 'ExamsGradeController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.scoreboard', {
        url: '/scoreboard/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/instructor/score.board-exam.client.view.html',
        controller: 'ExamsScoreboardController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          userResolve: getUser,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.scoreboard-candidate', {
        url: '/scoreboard-candidate/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/instructor/score.book-exam.client.view.html',
        controller: 'ExamsScoreboardCandidateController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.study', {
        url: '/study/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/exam-board/study-exam.client.view.html',
        controller: 'ExamsStudyController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.score', {
        url: '/score/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/exam-board/scorebook-exam.client.view.html',
        controller: 'ExamsScorebookController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.programs', {
        abstract: true,
        url: '/programs',
        template: '<ui-view/>'
      })
      .state('workspace.lms.programs.me', {
        url: '/me',
        templateUrl: '/src/client/lms/views/my-programs.client.view.html',
        controller: 'MyProgramsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join', {
        url: '/join/:programId',
        templateUrl: '/src/client/lms/views/program-board/join-program.client.view.html',
        controller: 'ProgramsJoinController',
        controllerAs: 'vm',
        resolve: {
          programResolve: getProgram
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'teacher']
        }
      })
      .state('workspace.lms.programs.join.progressboard', {
        url: '/progressboard',
        templateUrl: '/src/client/lms/views/program-board/progress.board-programs.client.view.html',
        controller: 'ProgramProgressboardController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser,
          programResolve: getProgram,
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join.progressboard-member', {
        url: '/progressboard-member/:memberId',
        templateUrl: '/src/client/lms/views/program-board/progress.book-programs.client.view.html',
        controller: 'ProgramProgressboardMemberController',
        controllerAs: 'vm',
        resolve: {
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join.intro', {
        url: '/intro',
        templateUrl: '/src/client/lms/views/program-board/intro-program.client.view.html',
        controller: 'ProgramIntroController',
        controllerAs: 'vm',
        resolve: {},
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join.progressbook', {
        url: '/progress',
        templateUrl: '/src/client/lms/views/program-board/progress.book-programs.client.view.html',
        controller: 'ProgramProgressController',
        controllerAs: 'vm',
        resolve: {
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
    ;
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

  getExam.$inject = ['$stateParams', 'ExamsService'];

  function getExam($stateParams, ExamsService) {
    return ExamsService.get({
      examId: $stateParams.examId
    }).$promise;
  }

  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
      scheduleId: $stateParams.scheduleId
    }).$promise;
  }

  getCandidate.$inject = ['$stateParams', 'ExamCandidatesService', 'localStorageService'];

  function getCandidate($stateParams, ExamCandidatesService, localStorageService) {
    if ($stateParams.candidateId)
      return ExamCandidatesService.get({
        candidateId: $stateParams.candidateId
      }).$promise;
    return ExamCandidatesService.byUserAndSchedule({
      scheduleId: $stateParams.scheduleId,
      userId: localStorageService.get('userId')
    }).$promise;
  }

  getProgram.$inject = ['$stateParams', 'CourseProgramsService'];

  function getProgram($stateParams, CourseProgramsService) {
    return CourseProgramsService.get({
      programId: $stateParams.programId
    }).$promise;
  }

  getProgramMember.$inject = ['$stateParams', 'ProgramMembersService', 'localStorageService'];

  function getProgramMember($stateParams, ProgramMembersService, localStorageService) {
    if ($stateParams.memberId)
      return ProgramMembersService.get({
        programmemberId: $stateParams.memberId
      }).$promise;
    return ProgramMembersService.byUserAndProgram({
      programId: $stateParams.programId,
      userId: localStorageService.get('userId')
    }).$promise;
  }

  getClassroom.$inject = ['$stateParams', 'ClassroomsService'];

  function getClassroom($stateParams, ClassroomsService) {
    return ClassroomsService.get({
      classroomId: $stateParams.classroomId
    }).$promise;
  }

}());