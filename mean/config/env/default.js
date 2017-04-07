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
    profile: {
      image: {
        dest: 'modules/users/client/img/profile/uploads/',
        urlPaath: '/modules/users/client/img/profile/uploads/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    },
    file: {
      image: {
        dest: 'public/files/logo/uploads/',
        urlPaath: '/files/logo/uploads/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      video: {
        dest: 'public/files/video/uploads/',
        urlPaath: '/files/video/uploads/',
        limits: {
          fileSize: 256 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      document: {
        dest: 'public/files/document/uploads/',
        urlPaath: '/files/document/uploads/',
        limits: {
          fileSize: 8 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    },
    media: {
      image: {
        dest: 'public/media/image/uploads/',
        urlPaath: '/media/image/uploads/',
        limits: {
          fileSize: 4 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      },
      content: {
        dest: 'public/media/content/uploads/',
        urlPaath: '/media/content/uploads/',
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
    privateKey: 'config/sslcerts/key.pem',
    certificate: 'config/sslcerts/cert.pem'
  }
};
