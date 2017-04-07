'use strict';

var fs = require('fs');

module.exports = {
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  port: process.env.PORT || 12345,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/etraining',
    options: {
      user: '',
      pass: ''
    /**
      * Uncomment to enable ssl certificate based authentication to mongodb
      * servers. Adjust the settings below for your specific certificate
      * setup.
    server: {
      ssl: true,
      sslValidate: false,
      checkServerIdentity: false,
      sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
      sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
      sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
      sslPass: '1234'
    }
    */
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 20,
      json: false
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    username: '@TWITTER_USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
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
      ]
    }
  }
};
