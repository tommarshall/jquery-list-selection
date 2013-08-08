describe("Listable jQuery Plugin: ", function () {
  var $list, $listItems, $targetItem, $testOutput, testOptions;

  testOptions = {
    submitCallback: function (uids) {
      $('#test-output').data('submitCallback', true);
      $('#test-output').data('uids', uids);
    },
    deleteCallback: function (uids) {
      $('#test-output').data('deleteCallback', true);
      $('#test-output').data('uids', uids);
    }
  };

  beforeEach(function () {
    jasmine.getFixtures().set('<ul data-listable="true">'+
                                '<li data-uid="1">Item 1</li>'+
                                '<li data-uid="2">Item 2</li>'+
                                '<li data-uid="3">Item 3</li>'+
                                '<li data-uid="4">Item 4</li>'+
                                '<li data-uid="5">Item 5</li>'+
                                '<li data-uid="6">Item 6</li>'+
                                '<li data-uid="7">Item 7</li>'+
                                '<li data-uid="8">Item 8</li>'+
                                '<li data-uid="9">Item 9</li>'+
                                '<li data-uid="10">Item 10</li>'+
                              '</ul>'+
                              '<div id="test-output"></div>"');

    $testOutput = $('#test-output');
    
    $list = $('ul[data-listable="true"]').listable(testOptions);

    $listItems = $list.find('li');
    $targetItem = $listItems.eq(6);
  });

  it("should be chainable", function() {
    $list.addClass('example');
    expect($list.hasClass('example')).toBeTruthy();
  });

  it("should disable selection when shift key held", function () {
    pressKey(keyMap.shift);
    expect($list).toHaveSelectionDisabled();
    releaseKey(keyMap.shift);
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
          ctrlPress.which = keyMap.cmd;
          $(document).trigger(ctrlPress);

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          // trigger ctrl release event
          ctrlRelease = $.Event('keyup');
          ctrlPress.which = keyMap.cmd;
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
          shiftPress.which = keyMap.shift;
          $(document).trigger(shiftPress);

          // trigger the click
          $targetItem.trigger($.Event('click'));
        });

        afterEach(function () {
          // trigger shift release event
          shiftRelease = $.Event('keyup');
          shiftRelease.which = keyMap.shift;
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

    describe("pressing the escape key", function () {
      
      it("should not select any list items", function () {
        pressKey(keyMap.esc);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the enter key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.enter);
      });

      it("should trigger the callback", function () {
        expect($testOutput.data('submitCallback')).toBeTruthy();
      });

      it("should pass an empty array to the callback", function () {
        expect($testOutput.data('uids')).toEqual([]);
      });
    });

    describe("pressing the delete key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.delete);
      });

      it("should trigger the callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });

      it("should pass an empty array to the callback", function () {
        expect($testOutput.data('uids')).toEqual([]);
      });
    });

    describe("pressing the backspace key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.backspace);
      });

      it("should trigger the callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });

      it("should pass an empty array to the callback", function () {
        expect($testOutput.data('uids')).toEqual([]);
      });
    });

    describe("pressing the up key", function () {
      it("should not select any item", function () {
        pressKey(keyMap.up);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the down key", function () {
      it("should not select any item", function () {
        pressKey(keyMap.down);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });
  }); // when no items selected

  describe("when one item selected", function () {
    var $selectedItem;

    beforeEach(function () {
      // select another list item (Item 4)
      $selectedItem = $listItems.eq(3);
      $selectedItem.trigger($.Event('click'));
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
        beforeEach(function () {
          pressKey(keyMap.cmd);
          $targetItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          releaseKey(keyMap.cmd);
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
        var $range;

        beforeEach(function () {
          // fetch the range
          $range = $list.find('li').slice($selectedItem.index(), $targetItem.index() + 1);

          pressKey(keyMap.shift);
          $targetItem.trigger($.Event('click'));
        });

        afterEach(function () {
          releaseKey(keyMap.shift);
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
          pressKey(keyMap.cmd);
          $selectedItem.trigger($.Event('click'));
        });
        
        afterEach(function () {
          releaseKey(keyMap.cmd);
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
          pressKey(keyMap.shift);
          $selectedItem.trigger($.Event('click'));
        });

        afterEach(function () {
          releaseKey(keyMap.shift);
        });

        it("should deselect that list item", function () {
          expect($selectedItem).toNotBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(0);
        });
      });
    });

    describe("pressing the escape key", function () {
      
      it("should deselect all list items", function () {
        pressKey(keyMap.esc);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the enter key", function () {

      beforeEach(function () {
        pressKey(keyMap.enter);
      });
      
      it("should trigger the submit callback", function () {
        expect($testOutput.data('submitCallback')).toBeTruthy();
      });
      
      it("should pass the correct id to the callback", function () {
        expect($testOutput.data('uids')).toEqual([$selectedItem.data('uid')]);
      });
    });

    describe("pressing the delete key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.delete);
      });

      it("should trigger the delete callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });
      
      it("should pass the correct id to the callback", function () {
        expect($testOutput.data('uids')).toEqual([$selectedItem.data('uid')]);
      });
    });

    describe("pressing the backspace key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.backspace);
      });

      it("should trigger the delete callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });
      
      it("should pass the correct id to the callback", function () {
        expect($testOutput.data('uids')).toEqual([$selectedItem.data('uid')]);
      });
    });

    describe("pressing the up key", function () {

      beforeEach(function () {
        pressKey(keyMap.up);
      });
      
      it("should deselect the current item", function () {
        expect($selectedItem).toNotBeSelected();
      });
      
      it("should select the previous item", function () {
        var $previousItem = $listItems.eq($selectedItem.index() - 1);
        expect($previousItem).toBeSelected();
      });

      it("should not select any other list items", function () {
        expect($list.find('.selected').size()).toEqual(1);
      });
    });

    describe("pressing the down key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.down);
      });

      it("should deselect the current item", function () {
        expect($selectedItem).toNotBeSelected();
      });
      
      it("should select the next item", function () {
        var $nextItem = $listItems.eq($selectedItem.index() + 1);
        expect($nextItem).toBeSelected();
      });

      it("should not select any other list items", function () {
        expect($list.find('.selected').size()).toEqual(1);
      });
    });
  }); // when one item selected

  describe("when the top item is selected pressing the up key", function () {
    var $firstItem;
    
    beforeEach(function () {
      $firstItem = $listItems.first();
      $firstItem.trigger($.Event('click'));

      pressKey(keyMap.up);
    });

    it("should leave the first item selected", function () {
      expect($firstItem).toBeSelected();
    });

    it("should not select any other list items", function () {
      expect($list.find('.selected').size()).toEqual(1);
    });
  });

  describe("when the bottom item is selected pressing the down key", function () {
    var $lastItem;

    beforeEach(function () {
      $lastItem = $listItems.last();
      $lastItem.trigger($.Event('click'));

      pressKey(keyMap.down);
    });

    it("should leave the last item selected", function () {
      expect($lastItem).toBeSelected();
    });

    it("should not select any other list items", function () {
      expect($list.find('.selected').size()).toEqual(1);
    });
  });

  describe("when multiple items are selected", function () {
    var $multiSelectedItems;
    var targetIndices = [2, 4, 8];

    beforeEach(function () {
      // filter out the different items
      $multiSelectedItems = $listItems.filter(function (index) {
        return targetIndices.indexOf(index + 1) > -1;
      });

      pressKey(keyMap.cmd);

      // click each of the target items 
      $multiSelectedItems.each(function () {
        $(this).trigger($.Event('click'));
      });

      releaseKey(keyMap.cmd);
    });

    describe("pressing the escape key", function () {
      
      it("should deselect all list items", function () {
        pressKey(keyMap.esc);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });

    describe("pressing the enter key", function () {

      beforeEach(function () {
        pressKey(keyMap.enter);
      });
      
      it("should trigger the submit callback", function () {
        expect($testOutput.data('submitCallback')).toBeTruthy();
      });
      
      it("should pass the correct ids to the callback", function () {
        expect($testOutput.data('uids')).toEqual(targetIndices);
      });
    });

    describe("pressing the delete key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.delete);
      });

      it("should trigger the delete callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });
      
      it("should pass the correct ids to the callback", function () {
        expect($testOutput.data('uids')).toEqual(targetIndices);
      });
    });

    describe("pressing the backspace key", function () {
      
      beforeEach(function () {
        pressKey(keyMap.backspace);
      });

      it("should trigger the delete callback", function () {
        expect($testOutput.data('deleteCallback')).toBeTruthy();
      });
      
      it("should pass the correct ids to the callback", function () {
        expect($testOutput.data('uids')).toEqual(targetIndices);
      });
    });
  });
});