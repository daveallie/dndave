var SAVE_SUCCESS_MESSAGE = 'Successfully saved your spell list.'
  , UPDATE_SUCCESS_MESSAGE = 'Successfully updated your spell list.'
  , SAVE_FAIL_MESSAGE = 'Failed to save your spell list.'
  , UPDATE_FAIL_MESSAGE = 'Failed to update your spell list.'
  , UPDATE_AUTH_FAIL_MESSAGE = 'Password incorrect! Spell list was not updated.'

$(document).ready(function() {
  var $full_table = $('.full-table')

  $.tablesorter.addParser({
    id: 'truefalse',
    is: function (s) {
      return false;
    },
    format: function (s, table, cell) {
      var $cell = $(cell);
      return $cell.children('i').attr('class') || s;
    },
    type: 'text'
  });

  $full_table.tablesorter({
      cssChildRow: 'details'
    , sortList: [[1, 0]]
    , sortForce: [[1, 0]]
    , headers: {
        0: {sorter: false}
      , 1: {sorter: 'truefalse'}
      }
  })

  $full_table.on('sortEnd', function(e) {
    update_headers()
  })

  $('.expand').click(function() {
    var details = $(this).parent().next('.details')
    toggle_details_row(details)
  })

  $('.level-checkbox').click(function() {
    var ok_levels = $('.level-checkbox').map(function() { return $(this).is(':checked') })

    if ($(this).is(':checked'))
      filter_all()
    else
      $('.summary-visible').each(function() {
        if (!ok_levels[$(this).data('level')])
          toggle_summary_row(this)
      })
    update_spell_count()
  })

  $('.school-checkbox').click(function() {
    var ok_schools = {}
    $('.school-checkbox').each(function() { ok_schools[$(this).attr('value')] = $(this).is(':checked')})

    if ($(this).is(':checked'))
      filter_all()
    else
      $('.summary-visible').each(function() {
        if (!ok_schools[$(this).data('school')])
          toggle_summary_row(this)
      })
    update_spell_count()
  })

  $('.class-checkbox').click(function() {
    var ok_classes = {}
    $('.class-checkbox').each(function() { ok_classes[$(this).attr('value')] = $(this).is(':checked')})

    if ($(this).is(':checked'))
      filter_all()
    else
      $('.summary-visible').each(function() {
        if (!any_in_map($(this).data('classes'), ok_classes))
          toggle_summary_row(this)
      })
    update_spell_count()
  })

  $('.vsm-checkbox').click(function() {
    var ok_vsm = $('.vsm-checkbox').map(function() { return $(this).is(':checked') })
      , vsm_data

    if ($(this).is(':checked'))
      filter_all()
    else
      $('.summary-visible').each(function() {
        vsm_data = $(this).data('vsm')
        if ((!ok_vsm[0] && vsm_data[0]) || (!ok_vsm[1] && vsm_data[1]) || (!ok_vsm[2] && vsm_data[2]))
          toggle_summary_row(this)
      })
    update_spell_count()
  })

  var search_box = $('.search-box')

  $(search_box).on('input', function() {
    filter_all()
  })

  $('.menu-toggle').click(function(e) {
    e.preventDefault();
    toggleMenu();
  });

  $('.details').each(function() {
    this.addEventListener("transitionend", function () {
      if ($(this).hasClass('details-invisible')) {
        $(this).addClass('details-display-none')
        $(this).removeClass('details-invisible')
      }
    }, true);
  })

  if (findBootstrapEnvironment() == 'xs') {
    toggleMenu();
  }

  $('.save-button').click(function() {
    var is_update = $(this).attr('id') == 'save-update'
      , spell_code = (is_update ? $('#spell-code').html() : null) || 'new'
      , spells_ids = $('.fa-star.starable').map(function() { return $(this).parent().parent().data('id')}).toArray()
      , password = null
      , message = is_update ?
          "Password for Spell List:<br/>" +
          "<span style='font-size: small'>(leave blank if no password was set when the spell list was created)</span>"
        : "Password for Spell List:<br/>" +
          "<span style='font-size: small'>(setting a password will prevent others from changing your list, leave blank for no password)</span>"

    bootbox.prompt({
      title: message,
      inputType: "password",
      callback: function(password) {
        ajax_save(save_update_success, save_update_fail, spells_ids, spell_code, password)
      }
    });
  })

  $('.starable').click(function() {
    $(this).toggleClass('fa-star')
    $(this).toggleClass('fa-star-o')
    $full_table.trigger('update')

    var $save_button = $('#save-new')
    if ($(this).hasClass('fa-star') || $('.fa-star.starable').length > 0)
      $save_button.show()
    else
      $save_button.hide()
  })

  $('[data-hide]').on("click", function(){
    $(this).closest("." + $(this).attr("data-hide")).hide(300);
  });

  update_spell_count()
  $('#cover').fadeOut(1000);
})

function any_in_map(keys, map) {
  var found = false
  for (var i = 0; i < keys.length; i++) {
    if (map[keys[i]]) {
      found = true
      break
    }
  }
  return found
}

function toggle_details_row(row) {
  var icon = $(row).prev('.summary').children('.expand').children()
  $(icon).toggleClass('glyphicon-resize-small')
  $(icon).toggleClass('glyphicon-resize-full')
  if ($(row).hasClass('details-visible')) {
    $(row).removeClass('details-visible')
    $(row).addClass('details-invisible')
  } else {
    $(row).removeClass('details-display-none details-invisible')
    $(row).addClass('details-visible')
  }
}

function toggle_summary_row(row) {
  $(row).toggleClass('summary-visible')
  $(row).toggleClass('summary-invisible')
  if ($(row).hasClass('summary-invisible') && ($(row).next('.details').hasClass('details-visible'))) {
    toggle_details_row($(row).next('.details'))
  }
}

function filter_all() {
  var ok_levels = $('.level-checkbox').map(function() { return $(this).is(':checked') })
    , ok_schools = {}
    , ok_classes = {}
    , name = $('.search-box').val().toLowerCase().trim()
  $('.school-checkbox').each(function() { ok_schools[$(this).attr('value')] = $(this).is(':checked')})
  $('.class-checkbox').each(function() { ok_classes[$(this).attr('value')] = $(this).is(':checked')})

  $('.summary').each(function() {
    if (ok_levels[$(this).data('level')] && ok_schools[$(this).data('school')] && any_in_map($(this).data('classes'), ok_classes) && (name.length == 0 || $(this).data('name').toLowerCase().indexOf(name) >= 0)) {
      if ($(this).hasClass('summary-invisible'))
        toggle_summary_row(this)
    } else {
      if ($(this).hasClass('summary-visible'))
        toggle_summary_row(this)
    }
  })
  update_spell_count()
}

function update_spell_count() {
  var len = $('.summary-visible').length
    , message = len + ' spell'
  if (len != 1)
    message += 's'
  $('.spell-count').html(message)
}

function toggleMenu() {
  var $menu = $('#side-menu')
    , $content = $('#main-content')
    , $menu_toggle = $('.menu-toggle')
    , $i = $menu_toggle.children('i')
  $menu.toggleClass("hide-menu");
  if ($menu.hasClass("hide-menu")) {
    $content.stop().animate({"margin-left" : 20}, 500);
    $menu.stop().animate({"margin-left": -240}, 500);
    $menu_toggle.stop().animate({"margin-left": -15}, 500)
  } else {
    $content.stop().animate({"margin-left" : 260}, 500);
    $menu.stop().animate({"margin-left": 0}, 500);
    $menu_toggle.stop().animate({"margin-left": 225}, 500)
  }
  $i.toggleClass('fa-chevron-left')
  $i.toggleClass('fa-chevron-right')
}

function update_headers() {
  $('.sort-icon').each(function() {
    var $i = $(this)
      , $header = $i.parent()
    $i.removeClass('glyph-grey')
    $i.removeClass('fa-sort')
    $i.removeClass('fa-sort-asc')
    $i.removeClass('fa-sort-desc')

    if ($header.hasClass('headerSortDown'))
      $i.addClass('fa-sort-asc')
    else if ($header.hasClass('headerSortUp'))
      $i.addClass('fa-sort-desc')
    else {
      $i.addClass('glyph-grey')
      $i.addClass('fa-sort')
    }
  })
}

function save_update_success(data, update) {
  var new_key = data['key']
    , $spell_code = $('#spell-code')
    , $success_flash = $('#save-update-success-message')

  $('.save-update-message').hide()
  if (update) {
    $success_flash.children('span').html(UPDATE_SUCCESS_MESSAGE)
  } else {
    $success_flash.children('span').html(SAVE_SUCCESS_MESSAGE)
    history.pushState('', '', '/spells/' + new_key)
  }
  $success_flash.show(300);

  $spell_code.html(new_key)
  $spell_code.show()
  $('#save-new').html('Save as new')
  $('.save-button').show()
}

function save_update_fail(jqXHR, textStatus, update) {
  var $fail_flash = $('#save-update-fail-message')

  $('.save-update-message').hide()
  if (update) {
    if (jqXHR.status == 403) {
      $fail_flash.children('span').html(UPDATE_AUTH_FAIL_MESSAGE)
    } else {
      $fail_flash.children('span').html(UPDATE_FAIL_MESSAGE)
    }
  } else {
    $fail_flash.children('span').html(SAVE_FAIL_MESSAGE)
  }
  $fail_flash.show(300)
}

function ajax_save(success_funct, fail_funct, data, key, password) {
  key = key || 'new'
  var update = key != 'new'

  $.ajax({
    url: "/spells",
    type: "POST",
    data: {
      key: key,
      spells: data,
      password: password
    },
    dataType: "json"
  }).done(function( data ) {
    success_funct(data, update)
  }).fail(function( jqXHR, textStatus ) {
    fail_funct(jqXHR, textStatus, update)
  });
}