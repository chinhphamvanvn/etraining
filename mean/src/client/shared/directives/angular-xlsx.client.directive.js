'use strict';

angular.module('shared')
  .directive('jsXls', function () {
    return {
      restrict: 'E',
      template: '<div>' +
        '<div class="uk-form-row">' +
        '<div id="input-container" class="uk-form-file md-btn md-btn-primary" >' +
        '{{"DIALOG.IMPORT.EXCEL_FORMAT.SELECT_FILE" | translate}}' +
        '<input id="form-file" type="file" accept="{{accept}}">' +
        '</div>' +
        '</div>' +
        '<div class="uk-form-row">' +
        'File: {{filename}}' +
        '</div>' +
        '</div>',
      replace: true,
      link: function (scope, element, attrs) {

        function handleSelect(onChangeEvent) {
          var files = onChangeEvent.target.files;
          for (var i = 0, f = files[i]; i !== files.length; ++i) {
            var reader = new FileReader();
            var data;
            scope.filename = f.name;
            reader.onload = function (e) {
              if (!e) {
                data = reader.content;
              } else {
                data = e.target.result;
              }

              /* if binary string, read with type 'binary' */
              try {
                var workbook = XLS.read(data, { type: 'binary' });

                if (attrs.onread) {
                  var handleRead = scope[attrs.onread];
                  if (typeof handleRead === "function") {
                    var dataJson = excelToJson(workbook);
                    handleRead(dataJson);
                  }
                }
              } catch (e) {
                if (attrs.onerror) {
                  var handleError = scope[attrs.onerror];
                  if (typeof handleError === "function") {
                    handleError(e);
                  }
                }
              }

              // Clear input file
              element.val('');
            };

            // extend FileReader
            if (!FileReader.prototype.readAsBinaryString) {
              FileReader.prototype.readAsBinaryString = function (fileData) {
                var binary = "";
                var pt = this;
                var reader = new FileReader();
                reader.onload = function (e) {
                  var bytes = new Uint8Array(reader.result);
                  var length = bytes.byteLength;
                  for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                  }
                  // pt.result  - readonly so assign binary
                  pt.content = binary;
                  $(pt).trigger('onload');
                };
                reader.readAsArrayBuffer(fileData);
              };
            }

            reader.readAsBinaryString(f);

          }
        }

        function excelToJson(workbook) {
          var result = {};
          var sheetName = workbook.SheetNames[0];
          var data = workbook.Sheets[sheetName];
          var groupData = _.groupBy(Object.keys(data), function(key) {
            return parseInt(key.substring(1, key.length));
          });
          var headers = [];
          var rows = [];
          Object.keys(groupData).forEach(function(key) {
            if (key !== "NaN") {
              if (key === "1") {
                groupData[key].forEach(function(name) {
                  headers.push(data[name].h);
                });
              } else {
                var row = {};
                var i = 0;
                groupData[key].forEach(function(name) {
                  row[i] = data[name].h;
                  i++;
                });
                rows.push(row);
              }
            }
          });
          result.headers = headers;
          result.rows = rows;
          return result;
        }
        element.on('change', handleSelect);
      }
    };
  });
