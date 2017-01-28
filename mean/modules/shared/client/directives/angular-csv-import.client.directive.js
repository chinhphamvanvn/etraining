(function() {
    'use strict';

 angular.module('shared.csvImport', []).directive('csvImport', function() {
    return {
        restrict: 'E',
        scope:{
            content:'=?',
            header: '=?',
            headerVisible: '=?',
            separator: '=?',
            separatorVisible: '=?',
            result: '=?',
            encoding: '=?',
            encodingVisible: '=?',
            accept: '=?',
            acceptSize: '=?',
            acceptSizeExceedCallback: '=?',
            callback: '=?',
            mdButtonClass: '@?',
            mdInputClass: '@?',
            mdButtonTitle: '@?',
            mdSvgIcon: '@?',
            uploadButtonLabel: '='
        },
        template:  '<div>'+
                        '<div class="uk-form-row">'+
                        '<input type="checkbox"  ng-model="header" icheck />'+
                        '<label> {{"DIALOG.IMPORT.CSV_FORMAT.HEADER"| translate}} </label>' +
                     '</div>' +
                    ' <div class="uk-form-row">'+
                     '<label for="seprator">{{"DIALOG.IMPORT.CSV_FORMAT.SEPARATOR"|translate}}</label>'+
                     '<input id="seprator" type="text"  class="md-input uk-form-width-small" ng-model="separator"  md-input />'+
                     '</div>'+
                     '<div class="uk-form-row">'+
                     '<div id="input-container" class="uk-form-file md-btn md-btn-primary" >'+
                      '{{"DIALOG.IMPORT.CSV_FORMAT.SELECT_FILE" | translate}}'+
                        '<input id="form-file" type="file" accept="{{accept}}">'+
                        '</div>'+
                        '</div>'+
                        '<div class="uk-form-row">'+
                        'File: {{filename}}' +
                        '</div>'+
                       '</div>',
        
        link: function(scope, element, attrs) {
            scope.separatorVisible = !!scope.separatorVisible;
            scope.headerVisible = !!scope.headerVisible;
            scope.acceptSize = scope.acceptSize || Number.POSITIVE_INFINITY;

            element.on('change', function(onChangeEvent) {
                if (!onChangeEvent.target.files.length){
                    return;
                }

                if (onChangeEvent.target.files[0].size > scope.acceptSize){
                    if ( typeof scope.acceptSizeExceedCallback === 'function' ) {
                        scope.acceptSizeExceedCallback(onChangeEvent.target.files[0]);
                    }
                    return;
                }

                scope.filename = onChangeEvent.target.files[0].name;
                var reader = new FileReader();
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        var content = {
                            csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
                            header: scope.header,
                            separator: scope.separator
                        };
                        scope.content = content.csv;
                        scope.result = csvToJSON(content);
                        scope.result.filename = scope.filename;
                        scope.$$postDigest(function(){
                            if ( typeof scope.callback === 'function' ) {
                                scope.callback(scope.result);
                            }
                        });
                    });
                };

                if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0], scope.encoding);
                } else {
                    if ( scope.content != null ) {
                        var content = {
                            csv: scope.content,
                            header: !scope.header,
                            separator: scope.separator
                        };
                        scope.result = csvToJSON(content);
                        scope.$$postDigest(function(){
                            if ( typeof scope.callback === 'function' ) {
                                scope.callback(scope.result);
                            }
                        });
                    }
                }
            });

            var csvToJSON = function(content) {
                var lines=content.csv.split(new RegExp('\n(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                var result = [];
                var start = 0;
                var columnCount = lines[0].split(content.separator).length;

                var headers = [];
                if (content.header) {
                    headers=lines[0].split(content.separator);
                    start = 1;
                }
                
                var rows = [];
                for (var i=start; i<lines.length; i++) {
                    var obj = {};
                    var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                    if ( currentline.length === columnCount ) {
                            for (var k=0; k<currentline.length; k++) {
                                obj[k] = cleanCsvValue(currentline[k]);
                        }
                        rows.push(obj);
                    }
                }
                result.columnCount = columnCount;
                result.headers = headers;
                result.rows = rows;
                return result;
            };

            var cleanCsvValue = function(value) {
                return value
                    .replace(/^\s*|\s*$/g,"") // remove leading & trailing space
                    .replace(/^"|"$/g,"") // remove " on the beginning and end
                    .replace(/""/g,'"'); // replace "" with "
            };
        }
    };
});

}());
