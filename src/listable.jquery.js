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

      base.multiSelect = false;

      base.$items = base.$el.find(base.options.itemsSelector);

      // assign item click handler
      $(document).on('click', base.$items, itemClickHandler);

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
      
      // check for ctrl modifier
      if ( ! base.multiSelect ) {
        base.$items.removeClass('selected');
      }

      $clickedItem.addClass('selected');
    };

    var keydownHander = function (event) {
      switch (event.which){
        case 91:
          base.multiSelect = true;
          break;
        default:
          return;
      }
    };

    var keyupHander = function (event) {
      switch (event.which){
        case 91:
          base.multiSelect = false;
          break;
        default:
          return;
      }
    };
    
    // Run initializer
    base.init();
  };

  $.listable.defaultOptions = {
    itemsSelector: "li",
    selectedClass: "selected"
  };

  $.fn.listable = function (options) {
    return this.each(function() {
      (new $.listable(this, options));
    });
  };

})(jQuery);