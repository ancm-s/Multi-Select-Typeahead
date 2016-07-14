(function () {

  angular.module('multipleSelect').directive('multipleAutocomplete', [
    '$filter',
    '$http',
    '$log',
    function ($filter, $http, $log) {
      return {
        restrict: 'EA',
        scope: {
          placeholder: '=?',
          modelArr: '=ngModel',
          apiUrl: '@?',
          suggestionsArr: '=?',
          disable: '=?',
          multiple: '=?'
        },
        templateUrl: 'app/directives/multiple-autocomplete-field/multiple-autocomplete-tpl.html',
        link: function (scope, element, attr) {
          scope.objectProperty = attr.objectProperty;
          scope.selectedItemIndex = 0;
          scope.name = attr.name;
          scope.isRequired = attr.required;
          scope.errMsgRequired = attr.errMsgRequired;
          scope.isHover = false;
          scope.isFocused = false;
          scope.showInput = true;
          scope.showOptionList = true;
          var getSuggestionsList = function () {
            var url = scope.apiUrl;
            $log.log(url);
            $http({
              method: 'GET',
              url: url
            }).then(function (response) {
              $log.log(response);
              scope.suggestionsArr = response.data;
            }, function (response) {
              $log.log("*****Angular-multiple-select **** ----- Unable to fetch list");
            });
          };

          if (scope.suggestionsArr == null || scope.suggestionsArr == "") {
            if (scope.apiUrl != null && scope.apiUrl != "")
              getSuggestionsList();
            else {
              $log.log("*****Angular-multiple-select **** ----- Please provide suggestion array list or url");
            }
          }

          if (scope.modelArr == null || scope.modelArr == "") {
            scope.modelArr = [];
          }
          scope.onFocus = function () {
            scope.isFocused = true
          };

          scope.onMouseEnter = function () {
            scope.isHover = true
          };

          scope.onMouseLeave = function () {
            scope.isHover = false;
          };

          scope.onBlur = function () {
            scope.isFocused = false;
          };

          scope.onChange = function () {
            scope.selectedItemIndex = 0;
          };

          scope.keyParser = function ($event) {
            var keys = {
              38: 'up',
              40: 'down',
              8: 'backspace',
              13: 'enter',
              9: 'tab',
              27: 'esc'
            };
            var key = keys[$event.keyCode];
            if (key == 'backspace' && scope.inputValue == "") {
              if (scope.modelArr.length != 0)
                scope.modelArr.pop();
            } else if (key == 'down') {
              var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.inputValue);
              filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
              if (scope.selectedItemIndex < filteredSuggestionArr.length - 1)
                scope.selectedItemIndex++;
            } else if (key == 'up' && scope.selectedItemIndex > 0) {
              scope.selectedItemIndex--;
            } else if (key == 'esc') {
              scope.isHover = false;
              scope.isFocused = false;
            } else if (key == 'enter') {
              var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.inputValue);
              filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
              if (scope.selectedItemIndex < filteredSuggestionArr.length)
                scope.onSuggestedItemsClick(filteredSuggestionArr[scope.selectedItemIndex]);
            }
          };

          scope.onSuggestedItemsClick = function (selectedValue) {
            if (scope.multiple != null && scope.multiple != "") {
              if (scope.modelArr.length < scope.multiple) {
                scope.modelArr.push(selectedValue);
                scope.inputValue = "";
              }
            } else {
              scope.modelArr.push(selectedValue);
              scope.inputValue = "";
            }
            shouldShowInput();
          };

          var isDuplicate = function (arr, item) {
            var duplicate = false;
            if (arr == null || arr == "")
              return duplicate;

            for (var i = 0; i < arr.length; i++) {
              duplicate = angular.equals(arr[i], item);
              if (duplicate)
                break;
            }
            return duplicate;
          };

          scope.alreadyAddedValues = function (item) {
            var isAdded = true;
            isAdded = !isDuplicate(scope.modelArr, item);
            return isAdded;
          };

          scope.removeAddedValues = function (item) {
            if (scope.modelArr != null && scope.modelArr != "") {
              var itemIndex = scope.modelArr.indexOf(item);
              if (itemIndex != -1)
                scope.modelArr.splice(itemIndex, 1);
            }
            shouldShowInput();
          };

          function shouldShowInput() {
            if (scope.multiple != null && scope.multiple != "") {
              scope.showInput = scope.modelArr.length >= scope.multiple ? false : true;
              scope.showOptionList = scope.modelArr.length >= scope.multiple ? false : true;
            } else {
              scope.showInput = scope.modelArr.length === scope.suggestionsArr.length ? false : true;
              scope.showOptionList = scope.modelArr.length === scope.suggestionsArr.length ? false : true;
            }
          }

          scope.clearAll = function () {
            scope.modelArr = [];
            shouldShowInput();
          }

          scope.mouseEnterOnItem = function (index) {
            scope.selectedItemIndex = index;
          };
        }
      };
    }
  ]);
})();
