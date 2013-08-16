describe("ListSelection jQuery Plugin:", function () {
  var $list, $listItems, $targetItem, $testOutput, testOptions;

  testOptions = {
    submitCallback: function (uids) {
      $('#test-output').data('submitCallback', true);
      $('#test-output').data('uids', uids);
    },
    deleteCallback: function (uids) {
      $('#test-output').data('deleteCallback', true);
      $('#test-output').data('uids', uids);
    },
    contextCallback: function (uids) {
      $('#test-output').data('rightclickCallback', true);
      $('#test-output').data('uids', uids);
    }
  };

  beforeEach(function () {
    jasmine.getFixtures().set('<ul data-list-selection="true">'+
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
    
    $list = $('ul[data-list-selection="true"]');
    $list.listSelection(testOptions);

    $listItems = $list.find('li');
    $targetItem = $listItems.eq(6);
  });

  it("should be chainable", function() {
    $list.addClass('example');
    expect($list.hasClass('example')).toBeTruthy();
  });

  it("should disable native selection when shift key held", function () {
    pressKey(keyMap.shift);
    expect($list).toHaveSelectionDisabled();
    releaseKey(keyMap.shift);
  });

  describe("when no items selected", function () {

    describe("clicking on an unselected list item", function () {

      describe("with no modifier keys", function () {

        beforeEach(function () {
          // trigger the click
          $targetItem.trigger($.Event('mousedown'));
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
          $targetItem.trigger($.Event('mousedown'));
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
        beforeEach(function () {
          pressKey(keyMap.shift);
          $targetItem.trigger($.Event('mousedown'));
        });

        afterEach(function () {
          releaseKey(keyMap.shift);
        });

        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should select the range of list items using the first as root", function () {
          var $adhocRange = $list.find('li').slice(0, $targetItem.index() + 1);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
        });
      });
    });

    describe("clicking on an unselected list items and dragging", function () {
        var $hoverItem;

        beforeEach(function () {
          // simulate clicking list item 7 and hovering over list item 3
          $targetItem.trigger($.Event('mousedown'));
          $hoverItem = $listItems.eq(2).trigger($.Event('mouseover'));
        });

        it("should select that list item", function () {
          expect($targetItem).toBeSelected();
        });

        it("should select all list items between the clicked and hovered item", function () {
          var $adhocRange = $list.find('li').slice($hoverItem.index(), $targetItem.index() + 1);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
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

    describe("the select all keyboard shortcut", function () {
      it("should not select any items", function () {
        pressKey(keyMap.cmd);
        pressKey(keyMap.a);
        releaseKey(keyMap.a);
        releaseKey(keyMap.cmd);
        expect($list.find('.selected').size()).toEqual(0);
      });
    });
  }); // when no items selected

  describe("when one item selected", function () {
    var $selectedItem;

    beforeEach(function () {
      // select another list item (Item 4)
      $selectedItem = $listItems.eq(3);
      $selectedItem.trigger($.Event('mousedown'));
    });

    describe("clicking on an unselected list item", function () {

      describe("with no modifier keys", function () {
        
        beforeEach(function () {
          // trigger the click
          $targetItem.trigger($.Event('mousedown'));
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
          $targetItem.trigger($.Event('mousedown'));
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
          $targetItem.trigger($.Event('mousedown'));
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
          $selectedItem.trigger($.Event('mousedown'));
        });

        it("should leave that list item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("when control/command key held", function () {
        var ctrlPress, ctrlRelease;

        beforeEach(function () {
          pressKey(keyMap.cmd);
          $selectedItem.trigger($.Event('mousedown'));
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
          $selectedItem.trigger($.Event('mousedown'));
        });

        afterEach(function () {
          releaseKey(keyMap.shift);
        });

        it("should leave that list item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
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

      describe("with no modifier keys", function () {

        beforeEach(function () {
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
        });

        it("should deselect the current item", function () {
          expect($selectedItem).toNotBeSelected();
        });
        
        it("should select the previous item", function () {
          var $previousItem = $selectedItem.prev();
          expect($previousItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("with shift key held", function () {
        
        beforeEach(function () {
          // hold shift, hit up twice
          pressKey(keyMap.shift);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          releaseKey(keyMap.shift);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should select the previous item(s)", function () {
          var $previousItem = $selectedItem.prev();
          var $previousPreviousItem = $previousItem.prev();
          expect($previousItem).toBeSelected();
          expect($previousPreviousItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(3);
        });
      });

      describe("with cmd/ctrl key held", function () {

        beforeEach(function () {
          // hold cmd, hit up once
          pressKey(keyMap.cmd);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          releaseKey(keyMap.cmd);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });
    });

    describe("pressing the down key", function () {
      
      describe("with no modifier keys", function () {
        beforeEach(function () {
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
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

      describe("with shift key held", function () {
        
        beforeEach(function () {
          // hold shift, hit down twice
          pressKey(keyMap.shift);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          releaseKey(keyMap.shift);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should select the next item(s)", function () {
          var $nextItem = $selectedItem.next();
          var $nextNextItem = $nextItem.next();
          expect($nextItem).toBeSelected();
          expect($nextNextItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(3);
        });
      });

      describe("with cmd/ctrl key held", function () {
        
        beforeEach(function () {
          // hold cmd, hit down once
          pressKey(keyMap.cmd);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          releaseKey(keyMap.cmd);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });
    });

    describe("the select all keyboard shortcut", function () {
      it("should select all items", function () {
        pressKey(keyMap.cmd);
        pressKey(keyMap.a);
        releaseKey(keyMap.a);
        releaseKey(keyMap.cmd);
        expect($list.find('.selected').size()).toEqual($listItems.size());
      });
    });
  }); // when one item selected

  describe("when the top item is selected pressing the up key", function () {
    var $firstItem;
    
    beforeEach(function () {
      $firstItem = $listItems.first();
      $firstItem.trigger($.Event('mousedown'));

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
      $lastItem.trigger($.Event('mousedown'));

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
        $(this).trigger($.Event('mousedown'));
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

  describe("when a range of items are selected", function () {
    var $rangeSelectedItems, $rangeStartItem, $rangeStopItem, $itemWithinRange,
        $itemOutsideRange;
    var rangeStart = 4;
    var rangeStop = 7;

    beforeEach(function () {
      // load the range items
      $rangeStartItem = $listItems.eq(rangeStart - 1); // items in fixture don't start from zero
      $rangeStopItem = $listItems.eq(rangeStop - 1);   // items in fixture don't start from zero
      $rangeSelectedItems = $listItems.slice($rangeStartItem.index(), $rangeStopItem.index() + 1);

      $itemWithinRange = $rangeSelectedItems.first().next();
      $itemOutsideRange = $rangeSelectedItems.first().prev().prev();

      $rangeStartItem.trigger($.Event('mousedown'));

      pressKey(keyMap.shift);

      $rangeStopItem.trigger($.Event('mousedown'));

      releaseKey(keyMap.shift);
    });

    describe("pressing the escape key", function () {
      
      it("should deselect all list items", function () {
        pressKey(keyMap.esc);
        expect($list.find('.selected').size()).toEqual(0);
      });

      it("should remove the range root item", function () {
        $rangeStartItem.trigger($.Event('mousedown'));
        pressKey(keyMap.esc);
        pressKey(keyMap.shift);
        $rangeStopItem.trigger($.Event('mousedown'));
        releaseKey(keyMap.shift);
        var $adhocRange = $list.find('li').slice(0, $rangeStopItem.index() + 1);
        expect($adhocRange.size()).toEqual($list.find('.selected').size());
        expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
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
        expect($testOutput.data('uids')).toEqual(getRange(rangeStart, rangeStop));
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
        expect($testOutput.data('uids')).toEqual(getRange(rangeStart, rangeStop));
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
        expect($testOutput.data('uids')).toEqual(getRange(rangeStart, rangeStop));
      });
    });

    describe("pressing the up key", function () {

      describe("with no modifier keys", function () {

        beforeEach(function () {
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
        });

        it("should select the item above the last selected item", function () {
          var $previousItem = $rangeStopItem.prev();
          expect($previousItem).toBeSelected();
        });
        
        it("should deselect all other items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("with shift key held", function () {
        
        beforeEach(function () {
          // hold shift, hit up twice
          pressKey(keyMap.shift);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          releaseKey(keyMap.shift);
        });

        it("should toggle the select of the item(s) above the last selected item", function () {
          var $previousItem = $rangeStopItem.prev();
          // going up into the range, so these should not be selected
          expect($rangeStopItem).toNotBeSelected();
          expect($previousItem).toNotBeSelected();
        });
      });

      describe("with cmd/ctrl key held", function () {

        beforeEach(function () {
          // hold cmd, hit up once
          pressKey(keyMap.cmd);
          pressKey(keyMap.up);
          releaseKey(keyMap.up);
          releaseKey(keyMap.cmd);
        });

        it("should not change the current range", function () {
          expect($rangeSelectedItems.size()).toEqual($list.find('.selected').size());
        });

        it("should not select any other list items", function () {
          expect($rangeSelectedItems.size()).toEqual($rangeSelectedItems.filter('.selected').size());
        });
      });
    });

    xdescribe("pressing the down key", function () {
      
      describe("with no modifier keys", function () {
        beforeEach(function () {
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
        });

        it("should select the item below the last selected item", function () {
          //var $nextItem = $selectedItem.next();
          //expect($nextItem).toBeSelected();
          pending();
        });
        
        it("should deselect all other items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("with shift key held", function () {
        
        beforeEach(function () {
          // hold shift, hit down twice
          pressKey(keyMap.shift);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          releaseKey(keyMap.shift);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should toggle the select of the item(s) below the last selected item", function () {
          var $nextItem = $selectedItem.prev();
          var $nextNextItem = $previousItem.prev();
          pending();
          //expect($nextItem).toBeSelected();
          //expect($nextNextItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          //expect($list.find('.selected').size()).toEqual(3);
          pending();
        });
      });

      describe("with cmd/ctrl key held", function () {
        
        beforeEach(function () {
          // hold cmd, hit down once
          pressKey(keyMap.cmd);
          pressKey(keyMap.down);
          releaseKey(keyMap.down);
          releaseKey(keyMap.cmd);
        });

        it("should keep the current item selected", function () {
          expect($selectedItem).toBeSelected();
        });

        it("should not select any other list items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });
    });

    describe("with no key held", function () {

      describe("clicking on an item within the range", function () {

        beforeEach(function () {
          $itemWithinRange.trigger($.Event('mousedown'));
        });

        it("should keep that item selected", function() {
          expect($itemWithinRange).toBeSelected();
        });

        it("should deselect all other items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });

      describe("clicking on an item outside of the range", function () {

        beforeEach(function () {
          $itemOutsideRange.trigger($.Event('mousedown'));
        });

        it("should select that item", function() {
          expect($itemOutsideRange).toBeSelected();
        });

        it("should deselect all other items", function () {
          expect($list.find('.selected').size()).toEqual(1);
        });
      });
    });

    describe("with shift key held", function () {

      beforeEach(function () {
        pressKey(keyMap.shift);
      });

      afterEach(function () {
        releaseKey(keyMap.shift);
      });

      describe("clicking on an item", function () {

        it("should create a new range from the root element", function () {
          $itemOutsideRange.trigger($.Event('mousedown'));
          var $adhocRange = $list.find('li').slice($itemOutsideRange.index(), $rangeStartItem.index() + 1);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
        });
      });
    });

    describe("with cmd/ctrl key held", function () {

      beforeEach(function () {
        pressKey(keyMap.cmd);
      });

      afterEach(function () {
        releaseKey(keyMap.cmd);
      });

      describe("clicking on an item withing the range", function () {

        beforeEach(function () {
          $itemWithinRange.trigger($.Event('mousedown'));
        });

        it("should deselect that item", function () {
          expect($itemWithinRange).toNotBeSelected();
        });

        it("should keep all other items selected", function () {
          var $adhocRange = $rangeSelectedItems.not($itemWithinRange);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
        });

        it("should not update the range root item", function () {
          pressKey(keyMap.shift);
          $rangeStopItem.next().trigger($.Event('mousedown'));
          releaseKey(keyMap.shift);
          var $adhocRange = $listItems.slice($rangeStartItem.index(), $rangeStopItem.next().index() + 1);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
        });
      });

      describe("clicking on an item outside of the range", function () {

        beforeEach(function () {
          $itemOutsideRange.trigger($.Event('mousedown'));
        });

        it("should select that item", function () {
          expect($itemOutsideRange).toBeSelected();
        });

        it("should keep all other items selected", function () {
          expect($rangeSelectedItems.size() + 1).toEqual($list.find('.selected').size());
          expect($rangeSelectedItems.size()).toEqual($rangeSelectedItems.filter('.selected').size());
        });

        it("should update the range root item", function () {
          pressKey(keyMap.shift);
          $rangeStopItem.next().trigger($.Event('mousedown'));
          releaseKey(keyMap.shift);
          var $adhocRange = $listItems.slice($itemOutsideRange.index(), $rangeStopItem.next().index() + 1);
          expect($adhocRange.size()).toEqual($list.find('.selected').size());
          expect($adhocRange.size()).toEqual($adhocRange.filter('.selected').size());
        });
      });
    });
  });

  describe("when right mouse button clicked", function () {
    var rightClick;

    describe("on selected item", function () {

      describe("when a single item is selected", function () {

        beforeEach(function () {
          $targetItem.trigger($.Event('mousedown'));   // select the item
          $targetItem.trigger($.Event('contextmenu')); // trigger the context menu
        });

        it("should mark the item as context selected", function () {
          expect($targetItem).toBeContextSelected();
        });

        it("should trigger the rightclick callback", function () {
          expect($testOutput.data('rightclickCallback')).toBeTruthy();
        });
      
        it("should pass the correct id to the callback", function () {
          expect($testOutput.data('uids')).toEqual([$targetItem.data('uid')]);
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
            $(this).trigger($.Event('mousedown'));
          });

          releaseKey(keyMap.cmd);

          $multiSelectedItems.first().trigger($.Event('contextmenu'));
        });

        it("should mark all the selected items as context selected", function () {
          expect($multiSelectedItems.size()).toEqual($list.find('.context-selected').size());
          expect($multiSelectedItems.size()).toEqual($multiSelectedItems.filter('.context-selected').size());
        });

        it("should trigger the rightclick callback", function () {
          expect($testOutput.data('rightclickCallback')).toBeTruthy();
        });
      
        it("should pass the correct id to the callback", function () {
          expect($testOutput.data('uids')).toEqual(targetIndices);
        });

      });

    });

    describe("on an unselected item", function () {

      describe("when no items are selected", function () {

        beforeEach(function () {
          $targetItem.trigger($.Event('contextmenu'));
        });

        it("should mark the item as context selected", function () {
          expect($targetItem).toBeContextSelected();
        });

        it("should trigger the rightclick callback", function () {
          expect($testOutput.data('rightclickCallback')).toBeTruthy();
        });
      
        it("should pass the correct id to the callback", function () {
          expect($testOutput.data('uids')).toEqual([$targetItem.data('uid')]);
        });

      });

      describe("when items are selected", function () {
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
            $(this).trigger($.Event('mousedown'));
          });

          releaseKey(keyMap.cmd);

          // right-click the unselected target item
          $targetItem.trigger($.Event('contextmenu'));
        });

        it("should mark the item as context selected", function () {
          expect($targetItem).toBeContextSelected();
        });

        it("should not context select selected any other list items ", function () {
          expect($list.find('.context-selected').size()).toEqual(1);
        });

        it("should not deselect the selected list items ", function () {
          expect($list.find('.selected').size()).toEqual(3);
        });

        it("should trigger the rightclick callback", function () {
          expect($testOutput.data('rightclickCallback')).toBeTruthy();
        });
      
        it("should pass the correct id to the callback", function () {
          expect($testOutput.data('uids')).toEqual([$targetItem.data('uid')]);
        });

      });

    });
  });

  describe("public removeContextSelect interface", function () {

    beforeEach(function () {
      $targetItem.trigger($.Event('contextmenu'));
    });

    it("should clear contextSelection via method call", function () {
      $list.listSelection('clearContextSelect');
      expect($targetItem).toNotBeContextSelected();
    });

    it("should clear context selection via event trigger", function () {
      $('body').trigger('listSelection-clearContextSelect');
      expect($targetItem).toNotBeContextSelected();
    });

  });

});
