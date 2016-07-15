angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multi-select-autocomplete.html","<div class=\"ng-ms form-item-container\">\n    <ul class=\"list-inline\">\n        <li ng-repeat=\"item in vm.modelArr\">\n            <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">\n                {{item}}\n                <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i>\n                </span>&nbsp;\n            </span>\n            <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">\n                {{item[vm.objectProperty]}}\n                <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i>\n                </span>&nbsp;\n            </span>\n        </li>\n        <li ng-if=\"vm.showInput\">\n            <input\n                name=\"{{name}}\"\n                ng-model=\"vm.inputValue\"\n                placeholder=\"{{vm.placeholder}}\"\n                class=\"select_input\"\n                ng-keydown=\"vm.keyParser($event)\"\n                err-msg-required=\"{{errMsgRequired}}\"\n                ng-disabled=\"vm.disable\"\n                ng-focus=\"vm.onFocus()\"\n                ng-blur=\"vm.onBlur()\"\n                ng-required=\"!vm.modelArr.length && isRequired\"\n                ng-change=\"vm.onChange()\">\n        </li>\n        <i class=\"glyphicon glyphicon-remove pull-right\" ng-if=\"vm.clearAll\" ng-click=\"vm.removeAll()\"></i>\n\n    </ul>\n\n    <div ng-if=\"vm.showOptionList && vm.suggestionsArr\" class=\"autocomplete-list\" ng-show=\"vm.isFocused || vm.isHover\" ng-mouseenter=\"vm.onMouseEnter()\" ng-mouseleave=\"vm.onMouseLeave()\">\n        <ul>\n            <li ng-class=\"{\'autocomplete-active\' : vm.selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in vm.suggestionsArr | filter : vm.inputValue | filter : vm.alreadyAddedValues\"\n            ng-click=\"vm.onSuggestedItemsClick(suggestion)\"\n            ng-mouseenter=\"vm.mouseEnterOnItem($index)\">\n                <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">{{suggestion}}</span>\n                <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">{{suggestion[vm.objectProperty]}}</span>\n            </li>\n        </ul>\n    </div>\n\n</div>\n");}]);
(function () {
    //declare all modules and their dependencies.
    angular.module('multiSelectAutocomplete', [
        'templates'
    ]).config(function () {

    });
}
)();

(function () {
  "use strict";

  /** add to the app */
  angular.module('multiSelectAutocomplete')
    .directive('multiAutocomplete', multiAutocompleteDirective)
    .controller('MultiAutocompleteCtrl', MultiAutocompleteCtrl)


  /** inject the dependencies */
  MultiAutocompleteCtrl.$inject = ['$filter', '$http', '$log'];


  /**
   * Directive for the Multi-Select autocomplete
   *
   *
   * @returns {*}
   */
  function multiAutocompleteDirective() {
    return {
      restrict: 'E',
      controllerAs: "vm",
      controller: 'MultiAutocompleteCtrl',
      scope: {
        placeholder: '=?',
        modelArr: '=ngModel',
        apiUrl: '@?',
        suggestionsArr: '=?',
        objectProperty: '=?',
        disable: '=?',
        multiple: '=?',
        clearAll: '=?',
        closeOnSelect: '=?'
      },
      bindToController: true,
      templateUrl: 'multi-select-autocomplete.html',
      link: function (scope, element, attr) {
        scope.isRequired = attr.required;
        scope.errMsgRequired = attr.errMsgRequired;
        scope.name = attr.name;
      }
    };
  }


  /**
   * Return the correct formatting function
   *
   * @param $filter
   * @param $http
   * @param $log
   *
   * @returns {*}
   */
  function MultiAutocompleteCtrl($filter, $http, $log) {
    var vm = this,
      keys = {
        38: 'up',
        40: 'down',
        8: 'backspace',
        13: 'enter',
        9: 'tab',
        27: 'esc'
      };


    vm.selectedItemIndex = 0;
    vm.isHover = false;
    vm.isFocused = false;
    vm.showInput = true;
    vm.showOptionList = true;

    if (vm.modelArr === null || vm.modelArr === "" || vm.modelArr === undefined) {
      vm.modelArr = [];
    }

    if (vm.suggestionsArr == null || vm.suggestionsArr == "") {
      if (vm.apiUrl != null && vm.apiUrl != "")
        getSuggestionsList();
      else {
        $log.log("MultiSelect typeahead ----- Please provide suggestion array list or url");
      }
    }

    /**
     * Clear one selected option from all selections
     *
     * @param selectedVale
     *
     * @returns {*}
     */
    vm.removeAddedValues = function (selectedValue) {
      if (vm.modelArr != null && vm.modelArr != "") {
        var selectedValueIndex = vm.modelArr.indexOf(selectedValue);
        if (selectedValueIndex != -1)
          vm.modelArr.splice(selectedValueIndex, 1);
      }
      shouldShowInput();
    };

    /**
     * Clear All the selected options
     *
     * @param $event
     *
     * @returns {*}
     */
    vm.removeAll = function () {
      vm.modelArr = [];
      shouldShowInput();
    }


    /**
     * Handles select click event on the options dropdown
     *
     * @param selectedValue
     *
     * @returns {*}
     */
    vm.onSuggestedItemsClick = function (selectedValue) {
      if (vm.multiple != null && vm.multiple != "") {
        if (vm.modelArr.length < vm.multiple) {
          vm.modelArr.push(selectedValue);
          vm.inputValue = "";
        }
      } else {
        vm.modelArr.push(selectedValue);
        vm.inputValue = "";
      }
      shouldShowInput();
    };

    /**
     * Parse key strokes and handles navagiting and selections of options
     *
     * @param $event
     *
     * @returns {*}
     */
    vm.keyParser = function ($event) {
      var key = keys[$event.keyCode];
      if (key === 'backspace' && vm.inputValue === "") {
        if (vm.modelArr.length != 0)
          vm.modelArr.pop();
      } else if (key === 'down') {
        var filteredSuggestionArr = $filter('filter')(vm.suggestionsArr, vm.inputValue);
        filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, vm.alreadyAddedValues);
        if (vm.selectedItemIndex < filteredSuggestionArr.length - 1)
          vm.selectedItemIndex++;
      } else if (key === 'up' && vm.selectedItemIndex > 0) {
        vm.selectedItemIndex--;
      } else if (key === 'esc') {
        vm.isHover = false;
        vm.isFocused = false;
      } else if (key === 'enter') {
        var filteredSuggestionArr = $filter('filter')(vm.suggestionsArr, vm.inputValue);
        filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, vm.alreadyAddedValues);
        if (vm.selectedItemIndex < filteredSuggestionArr.length)
          vm.onSuggestedItemsClick(filteredSuggestionArr[vm.selectedItemIndex]);
      }
    };

    vm.alreadyAddedValues = function (item) {
      var isAdded = true;
      isAdded = !isDuplicate(vm.modelArr, item);
      return isAdded;
    };

    vm.mouseEnterOnItem = function (index) {
      vm.selectedItemIndex = index;
    };

    /***** Event Methods *****/
    vm.onMouseEnter = function () {
      vm.isHover = true
    };

    vm.onMouseLeave = function () {
      vm.isHover = false;
    };

    vm.onFocus = function () {
      vm.isFocused = true
    };

    vm.onBlur = function () {
      vm.isFocused = false;
    };

    vm.onChange = function () {
      vm.selectedItemIndex = 0;
    };


    /***** Private Helper methods *****/
    function shouldShowInput() {
      if (vm.multiple != null && vm.multiple != "") {
        vm.showInput = vm.modelArr.length >= vm.multiple ? false : true;
        vm.showOptionList = vm.modelArr.length >= vm.multiple ? false : true;
      } else {
        vm.showInput = vm.modelArr.length === vm.suggestionsArr.length ? false : true;
        vm.showOptionList = vm.modelArr.length === vm.suggestionsArr.length ? false : true;
      }
    }

     function isDuplicate(arr, item) {
      var duplicate = false;
      if (arr === null || arr === "")
        return duplicate;

      for (var i = 0; i < arr.length; i++) {
        duplicate = angular.equals(arr[i], item);
        if (duplicate)
          break;
      }
      return duplicate;
    };

    function getSuggestionsList() {
      var url = vm.apiUrl;
      $http({
        method: 'GET',
        url: url
      }).then(function (response) {
        $log.log(response);
        vm.suggestionsArr = response.data;
      }, function (response) {
        $log.log("MultiSelect typeahead ----- Unable to fetch list");
      });
    };


  }
})();
