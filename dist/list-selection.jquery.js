/*
 *  jQuery List Selection - v0.1.0
 *  File manager style rich selection for lists of elements
 *  https://github.com/tommarshall/jquery-list-selection
 *
 *  Made by Tom Marshall
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'listSelection',
    defaults = {
      itemsSelector: 'li',
      itemIDattribute: 'uid',
      selectClass: 'selected',
      contextSelectClass: 'context-selected',
      clearContextSelectEvent: pluginName+'-clearContextSelect',
      submitCallback: $.noop,
      deleteCallback: $.noop,
      contextCallback: $.noop,
    };

  // The actual plugin constructor
  function Plugin ( element, options ) {
    var self = this;

    self.el = element;
    self.$el = $(element);

    self.options = $.extend( {}, defaults, options);

    self._defaults = defaults;
    self._name = pluginName;

        // set the default state
    self.multiSelect = false;
    self.rangeSelect = false;
    self.$rangeRoot = null;
    self.$lastSelected = null;
    self.leftMouseDown = false;

    self.init();
  }

  Plugin.prototype = {

    // =========================================================================
    // Public methods
    // =========================================================================
    init: function () {
      var self = this;

      self.$items = self.$el.find(self.options.itemsSelector);

      // need mousedown rather than click for drag functionality
      self.$el.on('mousedown', self.options.itemsSelector,
        $.proxy(self._itemMouseDownHandler, self));

      // mouseup handler
      $(document).on('mouseup', $.proxy(self._mouseUpHander, self));

      // mouseover handler for drag select
      $(self.$el).on('mouseover', self.options.itemsSelector,
        $.proxy(self._itemMouseOverHandler, self));

      // assign keyboard event handlers
      $(document).on('keydown', $.proxy(self._keydownHander, self));
      $(document).on('keyup',   $.proxy(self._keyupHander, self));

      // TODO - clean this up, string comparison of functions is gross
      // only setup context menu listeners if callback does not equal noop
      if ( ''+self.options.contextCallback !== ''+self._defaults.contextCallback ) {
        // right click / context menu hander
        self.$el.on('contextmenu', $.proxy(self._contentMenuHander, self));

        // event listener for clearContextSelect
        $(document).on(self.options.clearContextSelectEvent,
          $.proxy(self.clearContextSelect, self));
      }
    },

    clearContextSelect: function () {
      var self = this;
      self.$items.removeClass(self.options.contextSelectClass);
    },

    // =========================================================================
    // Private methods (start with underscore)
    // =========================================================================
    _itemMouseDownHandler: function (event) {
      var self = this;
      if ( event.which !== 2 && event.which !== 3 ) {
        self._leftClickHandler(event);
      }
    },

    _mouseUpHander: function () {
      var self = this;
      self.leftMouseDown = false;
      self._enableSelection();
    },

    _leftClickHandler: function (event) {
      var self = this,
          $clickedItem = $(event.target),
          $rangeRootItem;

      // if self is selected and multiselect then deselect and get outahere
      if (  self._isSelected($clickedItem) && self.multiSelect  ) {
        $clickedItem.removeClass(self.options.selectClass);
        return;
      }

      // is this a normal click without modifier key?
      if (  ! self.multiSelect && ! self.rangeSelect  ) {
        self._clearSelect();
      }

      // select the range in between self element and the last
      if (  self.rangeSelect  ) {
        // if no rangeRoot then use first item
        $rangeRootItem = self.$rangeRoot || self.$items.first();
        self._clearSelect();
        self._selectRange($rangeRootItem.index(), $clickedItem.index());
        self.$lastSelected = $clickedItem;
      }
      else { // for no modifer and ctrl/cmd
        self._selectItem($clickedItem);
      }

      if (  ! self.rangeSelect  ) {
        self.$rangeRoot = $clickedItem;
      }

      // for drag functionality
      self.leftMouseDown = true;
      self._disableSelection();
    },

    _contentMenuHander: function (event) {
      var self = this,
          $rightClickedItem = $(event.target),
          $selected = self._getSelected();

      if (  self._isSelected($rightClickedItem)  ) {
        $selected.addClass(self.options.contextSelectClass);
        self.options.contextCallback(self._getSelectedIDs());
      }
      else {
        $rightClickedItem.addClass(self.options.contextSelectClass);
        self.options.contextCallback(
          [$rightClickedItem.data(self.options.itemIDattribute)]);
      }

      // set mousedown to false (as we're about to return false)
      self._mouseUpHander();

      // disable default context menu
      return false;
    },

    _itemMouseOverHandler: function (event) {
      var self = this,
          $hoveredItem;

      // mouseover only interesting if mouse is down
      if ( ! self.leftMouseDown ) { return; }

      $hoveredItem = $(event.target);

      self._clearSelect();
      self._selectRange(self.$rangeRoot.index(), $hoveredItem.index());
      self.$lastSelected = $hoveredItem;
    },

    _keydownHander: function (event) {
      var self = this;
      switch (event.which) {
        case 91: // cmd
        case 17: // ctrl
          self.multiSelect = true;
          break;
        case 16: // shift
          self.rangeSelect = true;
          self._disableSelection();
          break;
        case 27: // esc
          self.$rangeRoot = null;
          self.$lastSelected = null;
          self._clearSelect();
          break;
        case 13: // enter
          self.options.submitCallback(self._getSelectedIDs());
          break;
        case 46: // delete
        case 8:  // backspace
          self.options.deleteCallback(self._getSelectedIDs());
          break;
        case 38: // up
          self._navigateByKey('up');
          break;
        case 40: // down
          self._navigateByKey('down');
          break;
        case 65: // a
          // if cmd held and we have selected then select all
          if (  self.multiSelect && self._getSelected().size() ) {
             self._selectAll();
          }
          break;
        default:
          return;
      }
    },

    _keyupHander: function (event) {
      var self = this;
      switch (event.which) {
        case 91: // cmd
        case 17: // ctrl
          self.multiSelect = false;
          break;
        case 16: // shift
          self.rangeSelect = false;
          self._enableSelection();
          break;
        default:
          return;
      }
    },

    _isSelected: function ($item) {
      var self = this;
      return $item.hasClass(self.options.selectClass);
    },

    _selectItem: function ($item) {
      var self = this;
      $item.addClass(self.options.selectClass);
      self.$lastSelected = $item;
    },

    _selectRange: function (rangeFloor, rangeCeiling) {
      var self = this,
          temp;

      // get the indecies the correct way around for slice
      if ( rangeFloor > rangeCeiling ) {
        temp = rangeFloor;
        rangeFloor = rangeCeiling;
        rangeCeiling = temp;
      }
      self.$items.slice(rangeFloor, rangeCeiling + 1).each(function () {
        self._selectItem($(this));
      });
    },

    _selectAll: function () {
      var self = this;
 
      // disable browser selection to stop it getting int the
      self._disableSelection($('body'));
      
      self.$items.each(function () {
        self._selectItem($(this));
      });

      // enable selection in 0.1 of a second
      setTimeout(function () { self._enableSelection($('body')); }, 100);
    },

    _clearSelect: function () {
      var self = this;
      self.$items.removeClass(self.options.selectClass);
    },

    _getSelected: function () {
      var self = this;
      return self.$items.filter('.'+self.options.selectClass);
    },

    _getSelectedIDs: function () {
      var self = this,
          ids = [];
      self._getSelected().each(function () {
        ids.push($(this).data(self.options.itemIDattribute));
      });
      return ids;
    },

    _navigateByKey: function (direction) {
      var self = this,
          $target;

      // holding cmd/ctrl offers keyboard scroll
      if ( self.multiSelect ) { return; }

      // nothing selected so up/down do nothing
      if ( ! self.$lastSelected ) { return; }

      // determine the target element
      if ( direction === 'up' ) {
        $target = self.$lastSelected.prev();
      }
      else if ( direction === 'down' ) {
        $target = self.$lastSelected.next();
      }

      if ( $target && $target.size() ) { // ensure we're not at the top
        if ( self.rangeSelect ) {
          self._clearSelect();
          self._selectRange(self.$rangeRoot.index(), $target.index());
          self.$lastSelected = $target;
        }
        else {
          self._clearSelect();
          self._selectItem($target);
          self.$rangeRoot = $target;
        }
      }
    },

    _disableSelection: function ($el) {
      var self = this;
      if ( $el === undefined ) { $el = self.$el; }
      $el.attr('unselectable','on')
        .css({'-moz-user-select':'none',
            '-o-user-select':'none',
            '-khtml-user-select':'none',
            '-webkit-user-select':'none',
            '-ms-user-select':'none',
            'user-select':'none'
      }).on('selectstart', function () { return false; });
    },

    _enableSelection: function ($el) {
      var self = this;
      if ( $el === undefined ) { $el = self.$el; }
      $el.removeAttr('unselectable')
        .css({'-moz-user-select':'',
            '-o-user-select':'',
            '-khtml-user-select':'',
            '-webkit-user-select':'',
            '-ms-user-select':'',
            'user-select':''
      }).off('selectstart', function () { return false; });
    }
  };
  
  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations and allowing any
  // public function (ie. a function whose name doesn't start
  // with an underscore) to be called via the jQuery plugin,
  // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
  $.fn[pluginName] = function ( options ) {
    var args = arguments,
        returns; // Cache the method call to make it possible to return a value

    // Is the first parameter an object (options), or was omitted,
    // instantiate a new instance of the plugin.
    if ( options === undefined || typeof options === 'object' ) {
      return this.each(function () {

        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if ( !$.data(this, 'plugin_' + pluginName) ) {

          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });

    // If the first parameter is a string and it doesn't start
    // with an underscore or "contains" the `init`-function,
    // treat this as a call to a public method.
    } else if ( typeof options === 'string' && options[0] !== '_' &&
      options !== 'init' ) {

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if ( instance instanceof Plugin &&
          typeof instance[options] === 'function' ) {

          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply( instance,
            Array.prototype.slice.call( args, 1 ) );
        }

        // Allow instances to be destroyed via the 'destroy' method
        if ( options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null );
        }
      });

      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };

}(jQuery, window, document));