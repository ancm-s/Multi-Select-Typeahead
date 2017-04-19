angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multi-select-autocomplete.html","<div class=\"ng-ms form-item-container\">\n  <div class=\"list-line-container\">\n    <ul class=\"list-line\" ng-class=\"{\'disable\' : vm.disable}\">\n        <li ng-repeat=\"item in vm.modelArr track by $index\" class=\"select-inline\">\n            <span class=\"selected-item\" ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">\n              <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                <i class=\"remove icon\"></i>\n              </span>&nbsp;\n\n                {{item}}\n            </span>\n            <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">\n              <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                <i class=\"remove icon\"></i>\n              </span>&nbsp;\n\n                {{item[vm.objectProperty]}}\n            </span>\n        </li>\n        <li ng-if=\"vm.showInput\" class=\"list-input\">\n            <input\n                name=\"{{name}}\"\n                ng-model=\"vm.inputValue\"\n                placeholder=\"{{vm.placeholder}}\"\n                class=\"select_input\"\n                ng-keydown=\"vm.keyParser($event)\"\n                err-msg-required=\"{{errMsgRequired}}\"\n                ng-disabled=\"vm.disable\"\n                ng-focus=\"vm.onFocus()\"\n                ng-blur=\"vm.onBlur()\"\n                ng-required=\"!vm.modelArr.length && isRequired\"\n                ng-model-options=\"{ debounce: vm.debounce }\"\n                ng-change=\"vm.onChange()\">\n                <div class=\"remove-all-icon\" ng-if=\"vm.clearAll\">\n                  <i class=\"remove icon pull-right\"  ng-click=\"vm.removeAll()\"></i>\n                </div>\n        </li>\n\n    </ul>\n  </div>\n\n\n    <div ng-if=\"vm.showOptionList && vm.formatedSuggestionsArr\" class=\"autocomplete-list\" ng-show=\"vm.isFocused || vm.isHover\" ng-mouseenter=\"vm.onMouseEnter()\" ng-mouseleave=\"vm.onMouseLeave()\">\n        <ul>\n            <li ng-class=\"{\'autocomplete-active\' : vm.selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in vm.formatedSuggestionsArr | filter : vm.inputValue | filter : vm.alreadyAddedValues track by $index\"\n            ng-click=\"vm.onSuggestedItemsClick(suggestion)\"\n            ng-mouseenter=\"vm.mouseEnterOnItem($index)\">\n                <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">{{suggestion}}</span>\n                <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">{{suggestion[vm.objectProperty]}}</span>\n            </li>\n        </ul>\n    </div>\n\n</div>\n");}]);