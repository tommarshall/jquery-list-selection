describe("Listable jQuery Plugin: ", function() {
  var $list;

  beforeEach(function () {
    jasmine.getFixtures().set('<ul data-listable="true">'+
                                '<li>Item 1</li>'+
                                '<li>Item 2</li>'+
                                '<li>Item 3</li>'+
                                '<li>Item 4</li>'+
                                '<li>Item 5</li>'+
                                '<li>Item 6</li>'+
                                '<li>Item 7</li>'+
                                '<li>Item 8</li>'+
                                '<li>Item 9</li>'+
                                '<li>Item 10</li>'+
                              '</ul>');

    $list = $('ul[data-listable="true"]').listable();

    this.addMatchers({
      toBeSelected: function() {
        return $(this.actual).hasClass('selected');
      }
    });
  });

  describe("clicking on an unselected list item", function () {
    var $listItem, click;

    beforeEach(function () {
      // fetch a list item
      $listItem = $list.find('li:eq(8)');

      // create the click event
      click = $.Event('click');
    });

    describe("when no keys are pressed", function () {

      beforeEach(function () {
        // trigger the click
        $listItem.trigger(click);
      });
      
      it("should select the list item", function () {
        expect($listItem).toBeSelected();
      });

      it("should only select that list item", function () {
        expect($list.find('.selected').size()).toEqual(1);
      });
    });

    describe("when control/command key pressed", function () {
      var ctrlPress, ctrlRelease;

      beforeEach(function () {
        // trigger ctrl press event
        ctrlPress = $.Event('keydown');
        ctrlPress.which = 91;
        $(document).trigger(ctrlPress);

        // set 2 other list items to selected
        $list.find('li').slice(4, 6).addClass('selected');

        // trigger the click
        $listItem.trigger(click);
      });

      afterEach(function () {
        // trigger ctrl release event
        ctrlRelease = $.Event('keyup');
        ctrlPress.which = 91;
        $(document).trigger(ctrlPress);
      });

      it("should select the list item", function () {
        expect($listItem).toBeSelected();
      });

      it("should retain the selection of other list items", function () {
        expect($list.find('.selected').size()).toEqual(3);
      });
    });

    describe("when shift key pressed", function () {
      var shiftPress, shiftRelease, $otherSelectedItem, $range;

      beforeEach(function () {
        // trigger shift press event
        shiftPress = $.Event('keydown');
        shiftPress.which = 16;
        $(document).trigger(shiftPress);

        // set other item further up list to selected
        $otherSelectedItem = $list.find('li:eq(2)').addClass('selected');
        $range = $list.find('li').slice($otherSelectedItem.index(), $listItem.index());

        // trigger the click
        $listItem.trigger(click);
      });

      afterEach(function () {
        // trigger shift release event
        shiftRelease = $.Event('keyup');
        shiftRelease.which = 16;
        $(document).trigger(shiftRelease);
      });

      it("should select the list item", function () {
        expect($listItem).toBeSelected();
      });

      it("should select the range of list items", function () {
        expect($range.size()).toEqual($range.filter('.selected').size());
      });

      it("should not select any other list items", function () {
        expect($range.size()).toEqual($list.find('.selected').size());
      });
    });
  });
  
  describe("clicking on a selected list item", function () {

    describe("when no keys are pressed", function () {

      it("should deselect the list item", function () {
        expect(false).toBe(true);
      });
    });

    describe("within a selected range when no keys are pressed", function () {
        
      it("should select the list item", function () {
        expect(false).toBe(true);
      });

      it("should deselect the rest of the range", function () {
        expect(false).toBe(true);
      });
    });

    describe("when control/command key pressed", function () {
      
      it("should deselect the list item", function () {
        expect(false).toBe(true);
      });

      it("should not deselect the other selected items", function () {
        expect(false).toBe(true);
      });
    });

    describe("within a selected range when shift key pressed", function () {

      it("should deselect items outside of the range", function () {
        expect(false).toBe(true);
      });

      it("should leave items inside of the new range selected", function () {
        expect(false).toBe(true);
      });
    });
  });

  describe("pressing the escape button", function () {
    
    it("should deselect all list items", function () {
      // set 2 list items to selected
      $list.find('li').slice(4, 6).addClass('selected');

      // trigger esc press event
      escPress = $.Event('keydown');
      escPress.which = 27;
      $(document).trigger(escPress);

      // expect no selections
      expect($list.find('.selected').size()).toEqual(0);
    });
  });

  describe("pressing the enter button", function () {

    it("should trigger the callback when item(s) selected", function () {
      expect(false).toBe(true);
    });

    it("should not trigger the callback when no items selected", function () {
      expect(false).toBe(true);
    });

    it("should pass selected IDs to callback", function () {
      expect(false).toBe(true);
    });
  });

  describe("pressing the up button", function () {

    it("should deselect the current item", function () {
      expect(false).toBe(true);
    });

    it("should select the previous item", function () {
      expect(false).toBe(true);
    });

    it("should select the last item when on the first", function () {
      expect(false).toBe(true);
    });
  });

  describe("pressing the down button", function () {

    it("should deselect the current item", function () {
      expect(false).toBe(true);
    });

    it("should select the next item", function () {
      expect(false).toBe(true);
    });

    it("should select the first item when on the last", function () {
      expect(false).toBe(true);
    });
  });
});