// (function ($, window, document, undefined) {
'use strict';
var fdf = fdf || {};
$(function () {
  $(document).on('click', '#sidebarCollapse', function (e) {
    $('aside, main').toggleClass('active');
  });

  $(document).on('click', '#dashboarsCollapse', function () {
    $('.tabsGroup').toggleClass('active');
  });
  $(document).on('click', '.form-submit', function () {
      var $form = $(this).closest('.form-validate');
      var valid = fdf.form.validateForm($(this).closest('.form-validate'));
      
      if (!valid || $form.find('.email-error-box').hasClass('visible')) {
          formIsValid = false;
          return false;
      }
      else {
          formIsValid = true;
      }
  });

  //$(document).on('change', "#MDFreq", function () {
  //  if (parseInt($(this).children('option:selected').val()) >= 4) {
  //    $('.disabledDate').hide();
  //  } else {
  //    $('.disabledDate').show();
  //  }
  //});

  $(document).on('change', "#MeasureType", function () {
    switch ($(this).children('option:selected').val()) {
        case 'organization': {
        $('.disabledMType').hide();
        $('.disabledMType').eq(0).show();
        break;
      }
        case 'employee': {
        $('.disabledMType').hide();
        $('.disabledMType').eq(1).show();
        break;
      }
      default:
        $('.disabledMType').hide();
        break;
    }
  });

  $(window).load(function () {
    $(".filterSide").mCustomScrollbar({
      scrollbarPosition: "outside"
    });

  });


  });

// })(jQuery, window, document);
