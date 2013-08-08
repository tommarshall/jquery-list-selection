(function($){
  $.listable = function (el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    
    // Add a reverse reference to the DOM object
    base.$el.data("listable", base);
    
    base.init = function () {
      
      // set the options
      base.options = $.extend({},$.listable.defaultOptions, options);

      // set the default state
      base.multiSelect = false;
      base.rangeSelect = false;
      base.$lastSelected = null;

      base.$items = base.$el.find(base.options.itemsSelector);

      // assign item click handler
      $(base.$el).on('click', 'li', itemClickHandler);

      // assign keyboard event handlers
      $(document).on('keydown', keydownHander);
      $(document).on('keyup',   keyupHander);
    };

    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    // 
    // };

    var itemClickHandler = function (event) {
      var $clickedItem = $(event.target);

      if ($clickedItem.hasClass(base.options.selectedClass)) {
        $clickedItem.removeClass(base.options.selectedClass);
        return;
      }

      // check for cmd/ctrl or shift modifiers
      if ( ! base.multiSelect && ! base.rangeSelect ) {
        base.$items.removeClass(base.options.selectedClass);
      }

      // select the range in between this element and the last
      if ( base.rangeSelect && base.$lastSelected ) {
        var rangeFloor = $clickedItem.index();
        var rangeCeiling = base.$lastSelected.index();
        selectRange(rangeFloor, rangeCeiling);
      }
      else { // for no modifer and ctrl/cmd
        $clickedItem.addClass(base.options.selectedClass);
      }

      base.$lastSelected = $clickedItem;
    };

    var keydownHander = function (event) {
      switch (event.which){
        case 91: // cmd
        case 17: // ctrl
          base.multiSelect = true;
          break;
        case 16: // shift
          base.rangeSelect = true;
          disableSelection();
          break;
        case 27: // esc
          base.$items.removeClass(base.options.selectedClass);
          break;
        case 13: // enter
          base.options.submitCallback(getSelectedUIDs());
          break;
        case 46: // delete
        case 8:  // backspace
          base.options.deleteCallback(getSelectedUIDs());
          break;
        case 38: // up
          navigateByKey('up');
          break;
        case 40: // down
          navigateByKey('down');
          break;
        default:
          return;
      }
    };

    var keyupHander = function (event) {
      switch (event.which){
        case 91: // cmd
        case 17: // ctrl
          base.multiSelect = false;
          break;
        case 16: // shift
          base.rangeSelect = false;
          enableSelection();
          break;
        default:
          return;
      }
    };

    var selectRange = function (rangeFloor, rangeCeiling) {
      // get the indecies the correct way around for slice
      if (rangeFloor > rangeCeiling) {
        var temp = rangeFloor;
        rangeFloor = rangeCeiling;
        rangeCeiling = temp;
      }
      base.$items.slice(rangeFloor, rangeCeiling + 1).addClass(base.options.selectedClass);
    };

    var getSelected = function () {
      return base.$items.filter('.'+base.options.selectedClass);
    };

    var getSelectedUIDs = function () {
      var uids = [];
      var $selected = getSelected();
      $selected.each(function () {
        uids.push($(this).data('uid'));
      });
      return uids;
    };

    var navigateByKey = function (direction) {
      var $selected = getSelected();
      if ($selected.size() === 1) { // single item selected
        if (direction === 'up') {
          var $prev = $selected.prev();
          if ($prev.size()) { // ensure we're not at the top
            $selected.removeClass(base.options.selectedClass);
            $prev.addClass(base.options.selectedClass);
          }
        }
        else if (direction === 'down') {
          var $next = $selected.next();
          if ($next.size()) { // ensure we're not at the bottom
            $selected.removeClass(base.options.selectedClass);
            $next.addClass(base.options.selectedClass);
          }
        }
      }
      else if ($selected.size() > 1) { // range or multi select in operation
        // TODO
      }
      // nothing to do if nothing selected.. let the browser scroll
      return;
    };

    var returnFalse = function () { return false; };

    var disableSelection = function () {
      base.$el.attr('unselectable','on')
        .css({'-moz-user-select':'none',
             '-o-user-select':'none',
             '-khtml-user-select':'none',
             '-webkit-user-select':'none',
             '-ms-user-select':'none',
             'user-select':'none'
        }).on('selectstart', returnFalse);
    };

    var enableSelection = function () {
      base.$el.removeAttr('unselectable')
        .css({'-moz-user-select':'',
               '-o-user-select':'',
               '-khtml-user-select':'',
               '-webkit-user-select':'',
               '-ms-user-select':'',
               'user-select':''
        }).off('selectstart', returnFalse);
    };
    
    // Run initializer
    base.init();
  };

  $.listable.defaultOptions = {
    itemsSelector: "li",
    selectedClass: "selected",
    submitCallback: function (uids) { alert('Submit callback fired with: ' + JSON.stringify(uids)); },
    deleteCallback: function (uids) { alert('Delete callback fired with: ' + JSON.stringify(uids)); }
  };

  $.fn.listable = function (options) {
    return this.each(function() {
      (new $.listable(this, options));
    });
  };

})(jQuery);