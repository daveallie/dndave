window.Spell = {}

Spell.init = function() {
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
      , 11: {sorter: false}
      , 12: {sorter: false}
      , 13: {sorter: false}
    }
  })

  $full_table.on('sortEnd', function(e) {
    Spell.Helpers.update_headers()
  })

  $('.expand').click(function() {
    var details = $(this).parent().next('.details')
    Spell.Helpers.toggle_details_row(details)
  })

  $('.level-checkbox').click(function() {
    var ok_levels = $('.level-checkbox').map(function() { return $(this).is(':checked') })
      , has_true = $.inArray(true, ok_levels) != -1
      , has_false = $.inArray(false, ok_levels) != -1

    if (!has_true) {
      Spell.Helpers.setToggleState($('#toggle-level'), true)
      Spell.Filters.filter_all()
    } else if ($(this).is(':checked')) {
      if (!has_false) Spell.Helpers.setToggleState($('#toggle-level'), false)
      Spell.Filters.filter_all()
    } else {
      $('.summary-visible').each(function () {
        if (!ok_levels[$(this).data('level')])
          Spell.Helpers.toggle_summary_row(this)
      })
      Spell.Helpers.update_spell_count()
    }
  })

  $('.school-checkbox').click(function() {
    var ok_schools = {}
      , has_true = false
      , has_false = false
    $('.school-checkbox').each(function() {
      var checked = $(this).is(':checked')
      ok_schools[$(this).attr('value')] = checked
      if (checked) {
        has_true = true
      } else {
        has_false = true
      }
    })

    if (!has_true) {
      Spell.Helpers.setToggleState($('#toggle-school'), true)
      Spell.Filters.filter_all()
    } else if ($(this).is(':checked')) {
      if (!has_false) setToggleState($('#toggle-school'), false)
      Spell.Filters.filter_all()
    } else {
      $('.summary-visible').each(function () {
        if (!ok_schools[$(this).data('school')])
          Spell.Helpers.toggle_summary_row(this)
      })
      Spell.Helpers.update_spell_count()
    }
  })

  $('.class-checkbox').click(function() {
    var ok_classes = {}
      , has_true = false
      , has_false = false

    $('.class-checkbox').each(function() {
      var checked = $(this).is(':checked')
      ok_classes[$(this).attr('value')] = checked
      if (checked) {
        has_true = true
      } else {
        has_false = true
      }
    })

    if (!has_true) {
      Spell.Helpers.setToggleState($('#toggle-class'), true)
      Spell.Filters.filter_all()
    } else if ($(this).is(':checked')) {
      if (!has_false) Spell.Helpers.setToggleState($('#toggle-class'), false)
      Spell.Filters.filter_all()
    } else {
      $('.summary-visible').each(function () {
        if (!Spell.Filters.any_in_map($(this).data('classes'), ok_classes))
          Spell.Helpers.toggle_summary_row(this)
      })
      Spell.Helpers.update_spell_count()
    }
  })

  $('.vsmrc-checkbox').click(function() {
    var ok_vsmrc = $('.vsmrc-checkbox').map(function() { return $(this).is(':checked') })
      , vsmrc_data
      , has_true = $.inArray(true, ok_vsmrc) != -1
      , has_false = $.inArray(false, ok_vsmrc) != -1

    if (!has_true) {
      Spell.Helpers.setToggleState($('#toggle-vsmrc'), true)
      Spell.Filters.filter_all()
    } else if ($(this).is(':checked')) {
      if (!has_false) Spell.Helpers.setToggleState($('#toggle-vsmrc'), false)
      Spell.Filters.filter_all()
    } else {
      $('.summary-visible').each(function () {
        vsmrc_data = $(this).data('vsmrc')
        if ((!ok_vsmrc[0] || ok_vsmrc[0] && !vsmrc_data[0])
          && (!ok_vsmrc[1] || ok_vsmrc[1] && !vsmrc_data[1])
          && (!ok_vsmrc[2] || ok_vsmrc[2] && !vsmrc_data[2])
          && (!ok_vsmrc[3] || ok_vsmrc[3] && !vsmrc_data[3])
          && (!ok_vsmrc[4] || ok_vsmrc[4] && !vsmrc_data[4]))
          Spell.Helpers.toggle_summary_row(this)
      })
      Spell.Helpers.update_spell_count()
    }
  })

  $('.ref-checkbox').click(function() {
    var ok_ref = {}
      , has_true = false
      , has_false = false

    $('.ref-checkbox').each(function() {
      var checked = $(this).is(':checked')
      ok_ref[$(this).attr('value')] = checked
      if (checked) {
        has_true = true
      } else {
        has_false = true
      }
    })

    if (!has_true) {
      Spell.Helpers.setToggleState($('#toggle-ref'), true)
      Spell.Filters.filter_all()
    } else if ($(this).is(':checked')) {
      if (!has_false) Spell.Helpers.setToggleState($('#toggle-ref'), false)
      Spell.Filters.filter_all()
    } else {
      $('.summary-visible').each(function () {
        if (!ok_ref[$(this).data('ref')])
          Spell.Helpers.toggle_summary_row(this)
      })
      Spell.Helpers.update_spell_count()
    }
  })

  var search_box = $('.search-box')

  $(search_box).on('input', function() {
    Spell.Filters.filter_all()
  })

  $('.menu-toggle').click(function(e) {
    e.preventDefault()
    Spell.Menu.toggleMenu()
  })

  $('.details').each(function() {
    this.addEventListener("transitionend", function () {
      if ($(this).hasClass('details-invisible')) {
        $(this).addClass('details-display-none')
        $(this).removeClass('details-invisible')
      }
    }, true);
  })

  $('.toggle-all').click(function() {
    var $i = $(this).children('i')
      , toggle_class = $(this).data('toggle-class')
      , new_checked = $i.hasClass('fa-plus-square')

    $('.'+toggle_class).prop('checked', new_checked)

    $i.toggleClass('fa-plus-square')
    $i.toggleClass('fa-minus-square')
    Spell.Filters.filter_all()
  })

  if (findBootstrapEnvironment() == 'xs') {
    Spell.Menu.toggleMenu()
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
        if (password != null) {
          Spell.Saving.save(spells_ids, spell_code, password)
        }
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

  $('[data-toggle="tooltip"]').tooltip();
  Spell.Helpers.update_spell_count()

  $(window).trigger('cover-ready')
}

Spell.Filters = {
  any_in_map: function (keys, map) {
    var found = false
    for (var i = 0; i < keys.length; i++) {
      if (map[keys[i]]) {
        found = true
        break
      }
    }
    return found
  },

  filter_all: function () {
    var ok_levels = $('.level-checkbox').map(function () {
        return $(this).is(':checked')
      })
      , ok_vsmrc = $('.vsmrc-checkbox').map(function () {
        return $(this).is(':checked')
      })
      , vsmrc_data
      , ok_schools = {}
      , schools_en = false
      , ok_classes = {}
      , classes_en = false
      , ok_ref = {}
      , ref_en = false
      , name = $('.search-box').val().toLowerCase().trim()

    $('.school-checkbox').each(function () {
      var checked = $(this).is(':checked')
      ok_schools[$(this).attr('value')] = checked
      schools_en = schools_en || checked
    })
    $('.class-checkbox').each(function () {
      var checked = $(this).is(':checked')
      ok_classes[$(this).attr('value')] = checked
      classes_en = classes_en || checked
    })
    $('.ref-checkbox').each(function () {
      var checked = $(this).is(':checked')
      ok_ref[$(this).attr('value')] = checked
      ref_en = ref_en || checked
    })

    if ($.inArray(true, ok_vsmrc) == -1) {
      ok_vsmrc = [true, true, true, true]
    }
    if ($.inArray(true, ok_levels) == -1) {
      ok_levels = [true, true, true, true, true, true, true, true, true, true]
    }
    if (!schools_en) {
      for (var school in ok_schools)
        ok_schools[school] = true
    }
    if (!classes_en) {
      for (var class_name in ok_classes)
        ok_classes[class_name] = true
    }
    if (!ref_en) {
      for (var reference in ok_ref)
        ok_ref[reference] = true
    }

    $('.summary').each(function () {
      vsmrc_data = $(this).data('vsmrc')
      if (ok_levels[$(this).data('level')]
        && ((ok_vsmrc[0] && vsmrc_data[0])
        || (ok_vsmrc[1] && vsmrc_data[1])
        || (ok_vsmrc[2] && vsmrc_data[2])
        || (ok_vsmrc[3] && vsmrc_data[3])
        || (ok_vsmrc[4] && vsmrc_data[4]))
        && ok_schools[$(this).data('school')]
        && Spell.Filters.any_in_map($(this).data('classes'), ok_classes)
        && ok_ref[$(this).data('ref')]
        && (name.length == 0 || $(this).data('name').toLowerCase().indexOf(name) >= 0)) {
        if ($(this).hasClass('summary-invisible'))
          Spell.Helpers.toggle_summary_row(this)
      } else {
        if ($(this).hasClass('summary-visible'))
          Spell.Helpers.toggle_summary_row(this)
      }
    })
    Spell.Helpers.update_spell_count()
  }
}

Spell.Helpers = {
  toggle_details_row: function(row) {
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
  },

  toggle_summary_row: function(row) {
    $(row).toggleClass('summary-visible')
    $(row).toggleClass('summary-invisible')
    if ($(row).hasClass('summary-invisible') && ($(row).next('.details').hasClass('details-visible'))) {
      Spell.Helpers.toggle_details_row($(row).next('.details'))
    }
  },

  setToggleState: function (element, plus) {
    var $i = $(element).children('i')

    if (plus && $i.hasClass('fa-minus-square') || !plus && $i.hasClass('fa-plus-square')) {
      $i.toggleClass('fa-minus-square')
      $i.toggleClass('fa-plus-square')
    }
  },

  update_spell_count: function () {
    var len = $('.summary-visible').length
      , message = len + ' spell'
    if (len != 1)
      message += 's'
    $('.spell-count').html(message)
  },

  update_headers: function () {
    $('.sort-icon').each(function () {
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
}

Spell.Menu = {
  toggleMenu: function () {
    var $menu = $('#side-menu')
      , $content = $('#main-content')
      , $menu_toggle = $('.menu-toggle')
      , $i = $menu_toggle.children('i')
    $menu.toggleClass("hide-menu");
    if ($menu.hasClass("hide-menu")) {
      $content.stop().animate({"margin-left": 20}, 500);
      $menu.stop().animate({"margin-left": -240}, 500);
      $menu_toggle.stop().animate({"margin-left": -15}, 500)
    } else {
      $content.stop().animate({"margin-left": 260}, 500);
      $menu.stop().animate({"margin-left": 0}, 500);
      $menu_toggle.stop().animate({"margin-left": 225}, 500)
    }
    $i.toggleClass('fa-chevron-left')
    $i.toggleClass('fa-chevron-right')
  }
}

Spell.Saving = {
  Consts: {
    SAVE_SUCCESS_MESSAGE: 'Successfully saved your spell list.',
    UPDATE_SUCCESS_MESSAGE: 'Successfully updated your spell list.',
    SAVE_FAIL_MESSAGE: 'Failed to save your spell list.',
    UPDATE_FAIL_MESSAGE: 'Failed to update your spell list.',
    UPDATE_AUTH_FAIL_MESSAGE: 'Password incorrect! Spell list was not updated.'
  },
  save_update_success: function (data, update) {
    var new_key = data['key']
      , $spell_code = $('#spell-code')
      , $success_flash = $('#save-update-success-message')

    $('.save-update-message').hide()
    if (update) {
      $success_flash.children('span').html(Spell.Saving.Consts.UPDATE_SUCCESS_MESSAGE)
    } else {
      $success_flash.children('span').html(Spell.Saving.Consts.SAVE_SUCCESS_MESSAGE)
      history.pushState('', '', '/spells/' + new_key)
    }
    $success_flash.show(300);

    $spell_code.html(new_key)
    $spell_code.show()
    $('#save-new').html('Save as new')
    $('.save-button').show()
  },

  save_update_fail: function (jqXHR, textStatus, update) {
    var $fail_flash = $('#save-update-fail-message')

    $('.save-update-message').hide()
    if (update) {
      if (jqXHR.status == 403) {
        $fail_flash.children('span').html(Spell.Saving.Consts.UPDATE_AUTH_FAIL_MESSAGE)
      } else {
        $fail_flash.children('span').html(Spell.Saving.Consts.UPDATE_FAIL_MESSAGE)
      }
    } else {
      $fail_flash.children('span').html(Spell.Saving.Consts.SAVE_FAIL_MESSAGE)
    }
    $fail_flash.show(300)
  },

  save: function (data, key, password) {
    Spell.Saving.ajax_save(Spell.Saving.save_update_success, Spell.Saving.save_update_fail, data, key, password)
  },

  ajax_save: function (success_funct, fail_funct, data, key, password) {
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
    }).done(function (data) {
      success_funct(data, update)
    }).fail(function (jqXHR, textStatus) {
      fail_funct(jqXHR, textStatus, update)
    });
  }
}