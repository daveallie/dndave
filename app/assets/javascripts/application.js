// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require third_party
//= require dashboard
//= require spells

function uncover() {
  $('#cover').fadeOut(1000);
}

$(window).on('cover-ready', function() {
  uncover()
})

function uncover() {
  $('#cover').fadeOut(1000);
}

function findBootstrapEnvironment() {
  var envs = ['xs', 'sm', 'md', 'lg']
    , $el = $('<div>')

  $el.appendTo($('body'))

  for (var i = envs.length - 1; i >= 0; i--) {
    var env = envs[i]

    $el.addClass('hidden-'+env)
    if ($el.is(':hidden')) {
      $el.remove()
      return env
    }
  }
}

$(document).ready(function() {
  $('[data-hide]').on("click", function () {
    $(this).closest("." + $(this).attr("data-hide")).hide(300);
  })

  $('[data-toggle="tooltip"]').tooltip();
})