beforeEach(function() {

  this.addMatchers({
    
    toBeSelected: function() {
      this.message = function () {
        return "Expected " + $(this.actual).text() + " to be selected";
      };

      return $(this.actual).hasClass('selected');
    },
    
    toNotBeSelected: function() {
      this.message = function () {
        return "Expected " + $(this.actual).text() + " to not be selected";
      };

      return ! $(this.actual).hasClass('selected');
    },

    toHaveSelectionDisabled: function () {
      var $actual = $(this.actual);

      var unselectable = ($actual.attr('unselectable') === 'on');
      var userSelect = (($actual.css('user-select') === 'none') ||
        ($actual.css('-moz-user-select') === 'none') ||
        ($actual.css('-o-user-select') === 'none') ||
        ($actual.css('-khtml-user-select') === 'none') ||
        ($actual.css('-webkit-user-select') === 'none') ||
        ($actual.css('-ms-user-select') === 'none'));

      // should also check for 'return false' selectstart event handler

      return unselectable && userSelect; // && selectstartEvent
    }
  });
});

// pending polyfill
var pending = function () {
  expect('pending').toEqual('completed');
};

var keyMap = {
    'enter':     13,
    'esc':       27,
    'cmd':       91,
    'ctrl':      17,
    'shift':     16,
    'delete':    46,
    'backspace': 8,
    'tab':       9,
    'up':        38,
    'down':      40
  };

var pressKey = function (keycode) {
  var keyPress = $.Event('keydown');
  keyPress.which = keycode;
  $(document).trigger(keyPress);
};

var releaseKey = function (keycode) {
  var keyRelease = $.Event('keyup');
  keyRelease.which = keycode;
  $(document).trigger(keyRelease);
};