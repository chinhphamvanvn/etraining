(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = [ '$scope','$rootScope', '$state', '$stateParams', 'UsersService', '$location', '$window', 'Authentication', 'Notification','SettingsService', '$translate','localStorageService','utils'];

  function AuthenticationController( $scope, $rootScope, $state, $stateParams, UsersService, $location, $window, Authentication, Notification, SettingsService, $translate, localStorageService,utils) {
    var vm = this;
    vm.authentication = Authentication;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    vm.loginHelp = loginHelp;
    vm.backToLogin = backToLogin;
    vm.registerForm = registerForm;
    vm.passwordReset = passwordReset;
    vm.askForPasswordReset =  askForPasswordReset;
    SettingsService.registerMode().then(function(data) {
        vm.registerSetting = data;
    });
    
    vm.registerFormActive = $state.current.data.action == 'register';
    var $login_card = $('#login_card'),
    $login_form = $('#login_form'),
    $login_help = $('#login_help'),
    $register_form = $('#register_form'),
    $login_password_reset = $('#login_password_reset'),
    $loginValidate = $('#loginValidate'),
    $registerValidate = $('#registerValidate');
    
    $loginValidate
        .parsley()
        .on('form:validated',function() {
            $scope.$apply();
        })
        .on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    $registerValidate
        .parsley()
        .on('form:validated',function() {
            $scope.$apply();
        })
        .on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    
    if (!vm.registerFormActive) {
        utils.card_show_hide($login_card,undefined,login_form_show,undefined);
    } else {
        utils.card_show_hide($login_card,undefined,register_form_show,undefined);
    }

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    function signup() {
      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin() {
      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      localStorageService.set("userId", vm.authentication.user._id);
      Notification.success({ message: '<i class="uk-icon-check"></i> Signup successful!' });
      // And redirect to the previous or home page
      if ($state.previous.state.name=='home'|| !$state.previous.state) {
          if (_.contains(vm.authentication.user.roles,'admin'))
              $state.go('admin.workspace.dashboard');
          else
              $state.go('workspace.lms.courses.me');
      } else
          $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="uk-icon-ban"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      localStorageService.set("userId", vm.authentication.user._id);
      Notification.info({ message: 'Welcome ' + response.firstName });
      // And redirect to the previous or home page
      if ($state.previous.state.name=='home' || !$state.previous.state) {
          if (_.contains(vm.authentication.user.roles,'admin'))
              $state.go('admin.workspace.dashboard');
          else
              $state.go('workspace.lms.courses.me');
      } else
          $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="uk-icon-ban"></i> Signin Error!', delay: 6000 });
    }
    
    // show login form (hide other forms)
    function login_form_show() {
        $login_form
            .show()
            .siblings()
            .hide();
    };

    // show register form (hide other forms)
    function register_form_show() {
        $register_form
            .show()
            .siblings()
            .hide();
    };

    // show login help (hide other forms)
    function login_help_show() {
        $login_help
            .show()
            .siblings()
            .hide();
    };

    // show password reset form (hide other forms)
    function password_reset_show() {
        $login_password_reset
            .show()
            .siblings()
            .hide();
    };

    function loginHelp($event) {
        $event.preventDefault();
        utils.card_show_hide($login_card,undefined,login_help_show,undefined);
    };

    function backToLogin($event) {
        $event.preventDefault();
        vm.registerFormActive = false;
        utils.card_show_hide($login_card,undefined,login_form_show,undefined);
    };

    function registerForm($event) {
        $event.preventDefault();
        vm.registerFormActive = true;
        utils.card_show_hide($login_card,undefined,register_form_show,undefined);
    };

    function passwordReset($event) {
        $event.preventDefault();
        utils.card_show_hide($login_card,undefined,password_reset_show,undefined);
    };
    
    function askForPasswordReset() {
        UsersService.requestPasswordReset(vm.credentials)
          .then(function() {
              vm.alert = $translate.instant('PAGE.AUTHENTICATION.RESET_PASSWORD_PROMPT');
          })
      }
  }
}());
