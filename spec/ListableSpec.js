describe("Listable jQuery Plugin: ", function () {
  var $list, $listItems, $targetItem;

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
    $listItems = $list.find('li');
    $targetItem = $listItems.eq(6);

    this.addMatchers({
      toBeSelected: function() {
        return $(this.actual).hasClass('selected');
      },
      toNotBeSelected: function() {
        return ! $(this.actual).hasClass('selected');
      }
    });
  });

  describe("when no items selected", function () {

    describe("clicking on an unselected list item", function () {

      describe("with no modifier keys", function () {

        beforeEach(function () {
          // trigger the click
          $targetItem.trigger($.Event('click'));
        });
        
        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("when control/command key held", function () {
        var ctrlPress, ctrlRelease;

        beforeEach(function () {
          // trigger ctrl press event
          ctrlPress = $.Event('keydown');
          ctrlPress.which = 91;
          $(document).trigger(ctrlPress);

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          // trigger ctrl release event
          ctrlRelease = $.Event('keyup');
          ctrlPress.which = 91;
          $(document).trigger(ctrlRelease);
        });
                
        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("when shift key held", function () {
        var shiftPress, shiftRelease;

        beforeEach(function () {
          // trigger shift press event
          shiftPress = $.Event('keydown');
          shiftPress.which = 16;
          $(document).trigger(shiftPress);

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });

        afterEach(function () {
          // trigger shift release event
          shiftRelease = $.Event('keyup');
          shiftRelease.which = 16;
          $(document).trigger(shiftRelease);
        });

        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });
    });

    describe("pressing the escape button", function () {
      
      it("should not select any list items", function () {
            // trigger esc press event
        var escPress = $.Event('keydown');
        escPress.which = 27;
        $(document).trigger(escPress);

        // expect no selections
        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the enter button", function () {
      
      it("should not trigger the callback", function () {
        // TODO
      });
    });

    describe("pressing the up button", function () {
      
      it("should select the last item", function () {
        // TODO
      });
    });

    describe("pressing the down button", function () {
      
      it("should select the first item", function () {
        // TODO
      });
    });
  }); // when no items selected

  describe("when one item selected", function () {
    var $selectedItem;

    beforeEach(function () {
      // select another list item
      $selectedItem = $listItems.eq(3).addClass('selected');
    });

    describe("clicking on an unselected list item", function () {

      describe("with no modifier keys", function () {
        
        beforeEach(function () {
          // trigger the click
          $targetItem.trigger($.Event('click'));
        });
        
        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should deselect all other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("when control/command key held", function () {
        var ctrlPress, ctrlRelease;

        beforeEach(function () {
          // trigger ctrl press event
          ctrlPress = $.Event('keydown');
          ctrlPress.which = 91;
          $(document).trigger(ctrlPress);

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          // trigger ctrl release event
          ctrlRelease = $.Event('keyup');
          ctrlPress.which = 91;
          $(document).trigger(ctrlRelease);
        });
                
        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });
        
        it("should retain selection of other list items", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(2);
        });
      });

      describe("when shift key held", function () {
        var shiftPress, shiftRelease, $range;

        beforeEach(function () {
          // trigger shift press event
          shiftPress = $.Event('keydown');
          shiftPress.which = 16;
          $(document).trigger(shiftPress);

          // fetch the range
          $range = $list.find('li').slice($selectedItem.index(), $targetItem.index());

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });

        afterEach(function () {
          // trigger shift release event
          shiftRelease = $.Event('keyup');
          shiftRelease.which = 16;
          $(document).trigger(shiftRelease);
        });

        it("should create a range of selected list items", function () {
          expect($range.size()).toEqual($range.filter('.selected').size());
        });

        it("should not select any other list items", function () {
          expect($range.size()).toEqual($list.find('.selected').size());
        });
      });
    });
    
    describe("clicking on the selected list item", function () {

      describe("with no modifier keys", function () {
        
        beforeEach(function () {
          // trigger the click
          $selectedItem.trigger($.Event('click'));
        });

        it("should deselect that list item", function () {
          expect($selectedItem).toNotBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(0);
        });
      });

      describe("when control/command key held", function () {
        var ctrlPress, ctrlRelease;

        beforeEach(function () {
          // trigger ctrl press event
          ctrlPress = $.Event('keydown');
          ctrlPress.which = 91;
          $(document).trigger(ctrlPress);

          // trigger the click
          $selectedItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          // trigger ctrl release event
          ctrlRelease = $.Event('keyup');
          ctrlPress.which = 91;
          $(document).trigger(ctrlRelease);
        });

        it("should deselect that list item", function () {
          expect($selectedItem).toNotBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(0);
        });
      });

      describe("when shift key held", function () {
        var shiftPress, shiftRelease;

        beforeEach(function () {
          // trigger shift press event
          shiftPress = $.Event('keydown');
          shiftPress.which = 16;
          $(document).trigger(shiftPress);

          // trigger the click
          $selectedItem.trigger($.Event('click'));
        });

        afterEach(function () {
          // trigger shift release event
          shiftRelease = $.Event('keyup');
          shiftRelease.which = 16;
          $(document).trigger(shiftRelease);
        });

        it("should deselect that list item", function () {
          expect($selectedItem).toNotBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(0);
        });
      });
    });

    describe("pressing the escape button", function () {
      
      it("should deselect all list items", function () {
        // trigger esc press event
        var escPress = $.Event('keydown');
        escPress.which = 27;
        $(document).trigger(escPress);

        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the enter button", function () {
      
      it("should trigger the enter button callback", function () {
        // TODO
      });
      
      it("should pass the correct id to the callback", function () {
        // TODO
      });
    });

    describe("pressing the up button", function () {
      
      it("should deselect the current item", function () {
        // TODO
      });
      
      it("should select the previous item", function () {
        // TODO
      });
      
      it("should leave the first item selected when at the top", function () {
        // TODO
      });
    });

    describe("pressing the down button", function () {
      
      it("should deselect the current item", function () {
        // TODO
      });
      
      it("should select the next item", function () {
        // TODO
      });
      
      it("should leave the last item selected when at the bottom", function () {
        // TODO
      });
    });
  }); // when one item selected
});