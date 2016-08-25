angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multi-select-autocomplete.html","<div class=\"ng-ms form-item-container\">\n    <ul class=\"list-inline\">\n        <li ng-repeat=\"item in vm.modelArr\">\n            <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">\n                {{item}}\n                <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i>\n                </span>&nbsp;\n            </span>\n            <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">\n                {{item[vm.objectProperty]}}\n                <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i>\n                </span>&nbsp;\n            </span>\n        </li>\n        <li ng-if=\"vm.showInput\">\n            <input\n                name=\"{{name}}\"\n                ng-model=\"vm.inputValue\"\n                placeholder=\"{{vm.placeholder}}\"\n                class=\"select_input\"\n                ng-keydown=\"vm.keyParser($event)\"\n                err-msg-required=\"{{errMsgRequired}}\"\n                ng-disabled=\"vm.disable\"\n                ng-focus=\"vm.onFocus()\"\n                ng-blur=\"vm.onBlur()\"\n                ng-required=\"!vm.modelArr.length && isRequired\"\n                ng-change=\"vm.onChange()\">\n        </li>\n        <i class=\"glyphicon glyphicon-remove pull-right\" ng-if=\"vm.clearAll\" ng-click=\"vm.removeAll()\"></i>\n\n    </ul>\n\n    <div ng-if=\"vm.showOptionList && vm.suggestionsArr\" class=\"autocomplete-list\" ng-show=\"vm.isFocused || vm.isHover\" ng-mouseenter=\"vm.onMouseEnter()\" ng-mouseleave=\"vm.onMouseLeave()\">\n        <ul>\n            <li ng-class=\"{\'autocomplete-active\' : vm.selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in vm.suggestionsArr | filter : vm.inputValue | filter : vm.alreadyAddedValues\"\n            ng-click=\"vm.onSuggestedItemsClick(suggestion)\"\n            ng-mouseenter=\"vm.mouseEnterOnItem($index)\">\n                <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">{{suggestion}}</span>\n                <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">{{suggestion[vm.objectProperty]}}</span>\n            </li>\n        </ul>\n    </div>\n\n</div>\n");}]);