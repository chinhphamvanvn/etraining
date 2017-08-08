'use strict';

var s = module.exports = {
  app: {
    title: 'e-Training',
    description: 'Corporate Learning Management System',
    keywords: 'Training, LMS, CMS, Enterprise',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 12345,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: 'localhost',
  mediaServerUrl: 'ws://training.demo.vietinterview.com:8888/kurento',
  defaultPassword: '123456',
  whitelistEnabled: false,
  whitelistIP: '1.1.1.1',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 1 hours
    maxAge: 1 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: true
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'ETRAINING',
  // sessionKey is the cookie session name
  sessionKey: 'VietInterview',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  bodyClass: '{"sidebar_main_active": primarySidebarActive && !miniSidebarActive && !topMenuActive && (!$state.includes("authentication") && !$state.includes("error")),"sidebar_main_open": primarySidebarOpen && !miniSidebarActive && !slimSidebarActive && !topMenuActive && largeScreen && (!$state.includes("authentication") && !$state.includes("error")), "sidebar_mini": miniSidebarActive && largeScreen && !topMenuActive && (!$state.includes("authentication") && !$state.includes("error")), "sidebar_slim sidebar_slim_inactive": slimSidebarActive && largeScreen && !topMenuActive && (!$state.includes("authentication") && !$state.includes("error")), "sidebar_main_hiding": primarySidebarHiding, "sidebar_secondary_active": secondarySidebarActive && (!$state.includes("authentication") && !$state.includes("error")), "top_bar_active": toBarActive && (!$state.includes("authentication") && !$state.includes("error")), "page_heading_active": pageHeadingActive && (!$state.includes("authentication") && !$state.includes("error")), "header_double_height": headerDoubleHeightActive && (!$state.includes("authentication") && !$state.includes("error")), "main_search_active": mainSearchActive && (!$state.includes("authentication") && !$state.includes("error")), "header_full": fullHeaderActive && (!$state.includes("authentication") && !$state.includes("error")), "boxed_layout": boxedLayoutActive && (!$state.includes("authentication") && !$state.includes("error")), "login_page": $state.includes("authentication"), "error_page": $state.includes("error"), "uk-height-1-1": page_full_height, "footer_active": footerActive, "main_search_persistent": mainSearchPersistent}',
  appClass: 'default_theme',
  logoFile: 'public/assets/img/brand/logo.png',
  logoUrl: '/assets/img/brand/logo.png',
  faviconFile: 'public/assets/img/brand/favicon.ico',
  faviconUrl: 'assets/img/brand/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  uploads: {
    user: {
      base: 'public/files/user/',
      image: {
        dest: 'public/files/user/$USER_ID/',
        urlPath: '/files/user/$USER_ID/',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      audio: {
        dest: 'public/files/user/$USER_ID/',
        urlPath: '/files/user/$USER_ID/',
        limits: {
          fileSize: 8 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      video: {
        dest: 'public/files/user/$USER_ID/',
        urlPath: '/files/user/$USER_ID/',
        limits: {
          fileSize: 16 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      document: {
        dest: 'public/files/user/$USER_ID/',
        urlPath: '/files/user/$USER_ID/',
        limits: {
          fileSize: 8 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    },
    course: {
      base: 'public/files/course/',
      image: {
        dest: 'public/files/course/image/',
        urlPath: '/files/course/image/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      audio: {
        dest: 'public/files/course/audio/',
        urlPath: '/files/course/audio/',
        limits: {
          fileSize: 16 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      video: {
        dest: 'public/files/course/video/',
        urlPath: '/files/course/video/',
        limits: {
          fileSize: 256 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      document: {
        dest: 'public/files/course/document/',
        urlPath: '/files/course/document/',
        limits: {
          fileSize: 8 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      scorm: {
          dest: 'public/files/course/scorm/',
          urlPath: '/files/course/scorm/',
          limits: {
            fileSize: 512 * 1024 * 1024 // Max file size in bytes (1 MB)
          }
        }
    },
    question: {
      image: {
        dest: 'public/files/question/image/',
        urlPath: '/files/question/image/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      audio: {
        dest: 'public/files/question/audio/',
        urlPath: '/files/question/audio/',
        limits: {
          fileSize: 16 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      video: {
        dest: 'public/files/question/video/',
        urlPath: '/files/question/video/',
        limits: {
          fileSize: 256 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      document: {
        dest: 'public/files/question/document/',
        urlPath: '/files/question/document/',
        limits: {
          fileSize: 8 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    },
    library: {
      image: {
        dest: 'public/files/library/image/',
        urlPath: '/files/library/image/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      document: {
        dest: 'public/files/library/document/',
        urlPath: '/files/library/document/',
        limits: {
          fileSize: 128 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 6,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  },
  secure: {
    ssl: true,
    privateKey: process.env.ETRAINING_PRIVATE_KEY || 'config/sslcerts/key.pem',
    certificate: process.env.ETRAINING_CERTIFICATE || 'config/sslcerts/cert.pem'
  },
  seedDB: {
    seed: true,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      },
      settings: [
        {
          name: 'contactEmail',
          edit: true,
          type: 'String',
          valueString: '',
          code: 'CONTACT_EMAIL',
          category: 'system'
        },
        {
          name: 'registerMode',
          edit: true,
          type: 'String',
          valueString: 'open',
          code: 'REGISTER_MODE',
          category: 'system'
        },
        {
          name: 'registerGroup',
          edit: true,
          type: 'String',
          valueString: '',
          code: 'REGISTER_GROUP',
          category: 'system'
        },
        {
          name: 'maxLoginAttempt',
          edit: true,
          type: 'Number',
          valueNumber: 6,
          code: 'MAX_LOGIN_ATTEMPT',
          category: 'system'
        },
        {
          name: 'concurrentLogin',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'CONCURRENT_LOGIN',
          category: 'system'
        },
        {
          name: 'whitelistIP',
          edit: true,
          type: 'String',
          valueString: '0.0.0.0',
          code: 'WHITELIST_IP',
          category: 'system'
        },
        {
          name: 'whitelistIPEnabled',
          edit: true,
          type: 'Boolean',
          valueBoolean: false,
          code: 'WHITELIST_IP_ENABLE',
          category: 'system'
        },
        {
          name: 'apiPermissionEnabled',
          edit: true,
          type: 'Boolean',
          valueBoolean: false,
          code: 'API_PERMISSION_ENABLE',
          category: 'system'
        },
        {
          name: 'vietInterviewConferenceApiUrl',
          edit: true,
          type: 'String',
          valueString: '',
          code: 'BUILT_INT_CONFERENCE_API',
          category: 'conference'
        },
        {
          name: 'vietInterviewConferenceApiSalt',
          edit: true,
          type: 'String',
          valueString: '',
          code: 'BUILT_INT_CONFERENCE_API_SALT',
          category: 'conference'
        },
        {
          name: 'vietInterviewConferenceRoomUrl',
          edit: true,
          type: 'String',
          valueString: '',
          code: 'BUILT_INT_CONFERENCE_ROOM_URL',
          category: 'conference'
        },
        {
          name: 'alertUserCreate',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_USER_CREATE',
          category: 'alert'
        },
        {
          name: 'alertUserUpdated',
          edit: true,
          type: 'Boolean',
          valueBoolean: false,
          code: 'ALERT_USER_UPDATE',
          category: 'alert'
        },
        {
          name: 'alertUserDelete',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_USER_DELETE',
          category: 'alert'
        },
        {
          name: 'alertCandidateEnroll',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_CANDIDATE_ENROLL',
          category: 'alert'
        },
        {
          name: 'alertMemberEnroll',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_MEMBER_ENROLL',
          category: 'alert'
        },
        {
          name: 'alertMemberWithdraw',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_MEMBER_WIDTHDRAW',
          category: 'alert'
        },
        {
          name: 'alertMemberComplete',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_MEMBER_COMPLETE',
          category: 'alert'
        },
        {
          name: 'alertCourseUpdate',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_COURSE_UPDATE',
          category: 'alert'
        },
        {
          name: 'alertThreadNew',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_THREAD_NEW',
          category: 'alert'
        },
        {
          name: 'alertReplyNew',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_REPLY_NEW',
          category: 'alert'
        },
        {
          name: 'alertCourseMaterialUpdate',
          edit: true,
          type: 'Boolean',
          valueBoolean: true,
          code: 'ALERT_COURSE_MATERIAL_UPDATE',
          category: 'alert'
        }
      ],
      certificateTemplates: [
        {
          name: 'certificate',
          urlImage: '/assets/img/certificate/certi1.png',
          pathHtml: 'src/server/shared/templates/certificate'
        },
        {
          name: 'certificate2',
          urlImage: '/assets/img/certificate/certi2.png',
          pathHtml: 'src/server/shared/templates/certificate2'
        },
        {
          name: 'certificate3',
          urlImage: '/assets/img/certificate/certi3.png',
          pathHtml: 'src/server/shared/templates/certificate3'
        },
        {
          name: 'certificate4',
          urlImage: '/assets/img/certificate/certi4.png',
          pathHtml: 'src/server/shared/templates/certificate4'
        }
      ]
    }
  }
};
