(function(altair_forms) {
  'use strict';

  angular
    .module('shared')
    .directive('formDynamicFields', [
      '$window',
      '$timeout',
      function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, elem, attr, ngModel) {

            var $this = $(elem);
            // clone section
            $this.on('click', '.btnSectionClone', function(e) {
              e.preventDefault();
              var $this = $(this),
                section_to_clone = $this.attr('data-section-clone'),
                section_number = $(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added') ? parseInt($(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added'), 10) + 1 : 1,
                cloned_section = $(section_to_clone).clone();

              cloned_section
                .attr('data-section-added', section_number)
                .removeAttr('id')
                // inputs
                .find('.md-input').each(function(index) {
                  var $thisInput = $(this),
                    name = $thisInput.attr('name');
                  $thisInput
                    .val('')
                    .attr('name', name ? name + '[s_' + section_number + ':i_' + index + ']' : '[s_' + section_number + ':i_' + index + ']');
                //  altair_md.update_input($thisInput);
                })
                .end()
                // replace clone button with remove button
                .find('.btnSectionClone').replaceWith('<a href="#" class="btnSectionRemove"><i class="material-icons md-24">&#xE872;</i></a>')
                .end()
                // clear checkboxes
                .find('[data-md-icheck]:checkbox').each(function(index) {
                  var $thisInput = $(this),
                    name = $thisInput.attr('name'),
                    id = $thisInput.attr('id'),
                    $inputLabel = cloned_section.find('label[for="' + id + '"]'),
                    newName = name ? name + '-s' + section_number + ':cb' + index + '' : 's' + section_number + ':cb' + index,
                    newId = id ? id + '-s' + section_number + ':cb' + index + '' : 's' + section_number + ':cb' + index;
                  $thisInput
                    .attr('name', newName)
                    .attr('id', newId)
                    .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();
                  $inputLabel.attr('for', newId);
                })
                .end()
                // clear radio
                .find('.dynamic_radio').each(function(index) {
                  var $this = $(this),
                    thisIndex = index;
                  $this.find('[data-md-icheck]').each(function(index) {
                    var $thisInput = $(this),
                      name = $thisInput.attr('name'),
                      id = $thisInput.attr('id'),
                      $inputLabel = cloned_section.find('label[for="' + id + '"]'),
                      newName = name ? name + '-s' + section_number + ':cb' + thisIndex + '' : '[s' + section_number + ':cb' + thisIndex,
                      newId = id ? id + '-s' + section_number + ':cb' + index + '' : 's' + section_number + ':cb' + index;
                    $thisInput
                      .attr('name', newName)
                      .attr('id', newId)
                      .attr('data-parsley-multiple', newName)
                      .removeAttr('data-parsley-id')
                      .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();
                    $inputLabel.attr('for', newId);
                  });
                })
                .end()
                // switchery
                .find('[data-switchery]').each(function(index) {
                  var $thisInput = $(this),
                    name = $thisInput.attr('name'),
                    id = $thisInput.attr('id'),
                    $inputLabel = cloned_section.find('label[for="' + id + '"]'),
                    newName = name ? name + '-s' + section_number + ':sw' + index + '' : 's' + section_number + ':sw' + index,
                    newId = id ? id + '-s' + section_number + ':sw' + index + '' : 's' + section_number + ':sw' + index;
                  $thisInput
                    .attr('name', newName)
                    .attr('id', newId)
                    .removeAttr('style').removeAttr('checked').next('.switchery').remove();
                  $inputLabel.attr('for', newId);
                })
                .end()
                // selectize
                .find('[data-md-selectize]').each(function(index) {
                  var $thisSelect = $(this),
                    name = $thisSelect.attr('name'),
                    id = $thisSelect.attr('id'),
                    orgSelect = $('#' + id),
                    newName = name ? name + '-s' + section_number + ':sel' + index + '' : 's' + section_number + ':sel' + index,
                    newId = id ? id + '-s' + section_number + ':sel' + index + '' : 's' + section_number + ':sel' + index;
                  // destroy selectize
                  var selectize = orgSelect[0].selectize;
                  if (selectize) {
                    selectize.destroy();
                    orgSelect.val('').next('.selectize_fix').remove();
                    var clonedOptions = orgSelect.html();
                    altair_forms.select_elements(orgSelect.parent());
                    $thisSelect
                      .html(clonedOptions)
                      .attr('name', newName)
                      .attr('id', newId)
                      .removeClass('selectized')
                      .next('.selectize-control').remove()
                      .end()
                      .next('.selectize_fix').remove();
                  }
                });

              $(section_to_clone).before(cloned_section);
              var $newSection = $(section_to_clone).prev();
              if ($newSection.hasClass('form_section_separator')) {
                $newSection.after('<hr class="form_hr">');
              }

              // reinitialize checkboxes
              //  altair_md.checkbox_radio($newSection.find('[data-md-icheck]'));
              // reinitialize switches
              //  altair_forms.switches($newSection);
              // reinitialize selectize
              //  altair_forms.select_elements($newSection);

            });

            // remove section
            $this.on('click', '.btnSectionRemove', function(e) {
              e.preventDefault();
              var $this = $(this);
              $this
                .closest('.form_section')
                .next('hr').remove()
                .end()
                .remove();
            });
          }
        };
      }
    ]);
}(window.altair_forms));
