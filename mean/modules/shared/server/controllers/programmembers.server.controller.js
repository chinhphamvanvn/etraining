'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	ProgramMember = mongoose.model('ProgramMember'),
	CourseProgram = mongoose.model('CourseProgram'),
	User = mongoose.model('User'),
	CompetencyAchievement = mongoose.model('CompetencyAchievement'),
	Competency = mongoose.model('Competency'),
	Setting = mongoose.model('Setting'),
	Message = mongoose.model('Message'),
	config = require(path.resolve('./config/config')),
	nodemailer = require('nodemailer'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Create a Programmember
 */
exports.create = function(req, res) {
	var programmember = new ProgramMember(req.body);
	programmember.user = req.user;

	programmember.save(function(err) {
		if (err) {
			return res.status(422).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			ProgramMember.findOne(programmember).populate('member').exec(function(err, item) {
				res.json(item)
			});
			if (programmember.role=='member') {
				alertManager(programmember);
				sendMailToStudent(programmember);
			}
			
		}
	});
	
	function alertManager(student) {
		CourseProgram.findById(student.program).exce(function(err,program) {
			User.findById(student.member).exec(function(err, studentUser) {
				Setting.findOne({
					code : 'ALERT_MEMBER_ENROLL'
				}).exec(function(err, setting) {
					if (!err && setting && setting.valueBoolean) {
						ProgramMember.find({
							role : 'mânger',
							program : program._id,
							status : 'active'
						}).exec(function(err, managers) {
							_.each(managers, function(manager) {
								var alert = new Message({
									title : 'Program activity',
									content : 'User ' + studentUser.displayName + ' has enrolled program ' + program.name,
									level : 'success',
									type : 'alert',
									recipient : manager.member
								});
								alert.save();
							});
						});
					}
				});
			});
		});
		
	}

	function sendMailToStudent(student, course) {
		var httpTransport = 'http://';
		if (config.secure && config.secure.ssl === true) {
			httpTransport = 'https://';
		}
		var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
		CourseProgram.findById(student.program).exce(function(err,program) {
			User.findById(student.member).exec(function(err, studentUser) {
				res.render(path.resolve('modules/shared/server/templates/program-registeration-welcome-email'), {
					name : studentUser.displayName,
					programName : program.name,
					appName : config.app.title
				}, function(err, emailHTML) {
					var mailOptions = {
						to : studentUser.email,
						from : config.mailer.from,
						subject : 'e-Training Program Notification',
						html : emailHTML
					};
					smtpTransport.sendMail(mailOptions);
				});
			});
		});
		

	}
};

/**
 * Show the current Programmember
 */
exports.read = function(req, res) {
	// convert mongoose document to JSON
	var programmember = req.programmember ? req.programmember.toJSON() : {};

	// Add a custom field to the Article, for determining if the current User is the "owner".
	// NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
	programmember.isCurrentUserOwner = req.user && programmember.user && programmember.user._id.toString() === req.user._id.toString();

	res.jsonp(programmember);
};

/**
 * Update a Programmember
 */
exports.update = function(req, res) {
	var programmember = req.programmember;

	programmember = _.extend(programmember, req.body);

	programmember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programmember);
		}
	});
};


exports.withdraw = function(req, res) {
	var member = req.member;
	member = _.extend(member, req.body);
	member.status = 'withdrawn';
	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
		}
	});

};


exports.complete = function(req, res) {
	var member = req.member;
	member = _.extend(member, req.body);
	member.enrollmentStatus = 'completed';
	member.save(function(err) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(member);
			sendMailToStudent(member);
			bindCompetency(member);
		}
	});


	function bindCompetency(student) {
		User.findById(student.member).exec(function(err, studentUser) {
			CourseProgram.findById(student.program).exec(function(err, program) {
				_.each(program.competencies, function(competency) {
					var achievement = new CompetencyAchievement();
					achievement.achiever = student.member._id;
					achievement.competency = competency;
					achievement.source = 'program';
					achievement.issueBy = new Date();
					achievement.granter = req.body.managerId;
					achievement.save();
				});
			});
		});
	}

	function sendMailToStudent(student) {
		var httpTransport = 'http://';
		if (config.secure && config.secure.ssl === true) {
			httpTransport = 'https://';
		}
		var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
		User.findById(student.member).exec(function(err, studentUser) {
			CourseProgram.findById(student.program).exec(function(err, program) {
				res.render(path.resolve('modules/shared/server/templates/program-completion-email'), {
					name : studentUser.displayName,
					programName : program.name,
					appName : config.app.title
				}, function(err, emailHTML) {
					var mailOptions = {
						to : studentUser.email,
						from : config.mailer.from,
						subject : 'e-Training Program Notification',
						html : emailHTML
					};
					smtpTransport.sendMail(mailOptions);
				});
			});
		});

	}
};

/**
 * Delete an Programmember
 */
exports.delete = function(req, res) {
	var programmember = req.programmember;

	programmember.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programmember);
		}
	});
};

/**
 * List of Programmembers
 */
exports.list = function(req, res) {
	ProgramMember.find().sort('-created').populate('user', 'displayName').exec(function(err, programmembers) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programmembers);
		}
	});
};

exports.memberByProgram = function(req, res) {
	ProgramMember.find({
		program : req.program._id
	}).sort('-created').populate('user', 'displayName').populate('member').populate('program').exec(function(err, members) {
		if (err) {
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};

exports.memberByUser = function(req, res) {
	ProgramMember.find({
		status : 'active',
		member : req.params.userId
	}).sort('-created').populate('member').populate('program').exec(function(err, members) {
		if (err) {
			return res.status(422).send({
				message : errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(members);
		}
	});
};

exports.memberByUserAndProgram = function(req, res) {
	ProgramMember.findOne({
		status : 'active',
		member : req.user._id,
		program : req.program._id
	}).sort('-created').populate('member').populate('program').exec(function(err, member) {
		if (err || !member) {
			return res.status(422).send({
				message : 'No member found'
			});
		} else {
			res.jsonp(member);
		}
	});
};

/**
 * Programmember middleware
 */
exports.programmemberByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message : 'Programmember is invalid'
		});
	}

	ProgramMember.findById(id).populate('user', 'displayName').exec(function(err, programmember) {
		if (err) {
			return next(err);
		} else if (!programmember) {
			return res.status(404).send({
				message : 'No Programmember with that identifier has been found'
			});
		}
		req.programmember = programmember;
		next();
	});
};