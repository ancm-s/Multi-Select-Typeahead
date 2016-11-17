angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multi-select-autocomplete.html","<div class=\"ng-ms form-item-container\">\n    <div class=\"list-line-container\">\n        <ul class=\"list-line\">\n            <li ng-repeat=\"item in vm.modelArr\" class=\"select-inline\">\n                <span class=\"selected-item\" ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">\n              <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                <i class=\"remove icon\"></i>\n              </span>&nbsp; {{item}}\n                </span>\n                <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">\n              <span class=\"remove\" ng-click=\"vm.removeAddedValues(item)\">\n                <i class=\"remove icon\"></i>\n              </span>&nbsp; {{item[vm.objectProperty]}}\n                </span>\n            </li>\n            <li ng-if=\"vm.showInput\" class=\"list-input\">\n                <input name=\"{{name}}\" ng-model=\"vm.inputValue\" placeholder=\"{{vm.placeholder}}\" class=\"select_input\" ng-keydown=\"vm.keyParser($event)\"\n                    err-msg-required=\"{{errMsgRequired}}\" ng-disabled=\"vm.disable\" ng-focus=\"vm.onFocus()\" ng-blur=\"vm.onBlur()\"\n                    ng-required=\"!vm.modelArr.length && isRequired\" ng-model-options=\"{ debounce: vm.debounce }\" ng-change=\"vm.onChange()\">\n                <div class=\"remove-all-icon\" ng-if=\"vm.clearAll\">\n                    <i class=\"remove icon pull-right\" ng-click=\"vm.removeAll()\"></i>\n                </div>\n            </li>\n        </ul>\n    </div>\n    <div ng-if=\"vm.showOptionList && vm.suggestionsArr\" class=\"autocomplete-list\" ng-mouseenter=\"vm.onMouseEnter()\" ng-mouseleave=\"vm.onMouseLeave()\">\n        <ul ng-if=\"vm.isFocused || vm.isHover\">\n            <li ng-class=\"{\'autocomplete-active\' : vm.selectedItemIndex == $index}\" ng-if=\"suggestion.visible\" ng-repeat=\"suggestion in vm.suggestionsArr track by suggestion._id\"\n                ng-click=\"vm.onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"vm.mouseEnterOnItem($index)\">\n                <span ng-if=\"vm.objectProperty == undefined || vm.objectProperty == \'\'\">{{suggestion}}</span>\n                <span ng-if=\"vm.objectProperty != undefined && vm.objectProperty != \'\'\">{{suggestion[vm.objectProperty]}}</span>\n            </li>\n        </ul>\n    </div>\n</div>");}]);
var multiSelectAutocomplete;
(function (multiSelectAutocomplete) {
    var MultiAutocompleteDirective = (function () {
        function MultiAutocompleteDirective() {
            this.link = function (scope, element, attr) {
                scope['isRequired'] = attr['required'];
                scope['errMsgRequired'] = attr['errMsgRequired'];
                scope['name'] = attr['name'];
                scope.$watch('vm.suggestionsArr', function (n, old) {
                    angular.forEach(n, function (sug, i) {
                        sug._id = i;
                        sug.visible = true;
                    });
                });
            };
            this.restrict = 'E';
            this.templateUrl = "multi-select-autocomplete.html";
            this.controller = multiSelectAutocomplete.MultiAutocompleteCtrl;
            this.controllerAs = 'vm';
            this.bindToController = true;
            this.scope = {
                placeholder: '=?',
                modelArr: '=ngModel',
                apiUrl: '@?',
                suggestionsArr: '=?',
                objectProperty: '=?',
                disable: '=?',
                multiple: '=?',
                clearAll: '=?',
                closeOnSelect: '=?',
                sortBy: '=?',
                alertSelected: '&?',
                debounce: '=?',
                apiSearchKey: '=?'
            };
        }
        return MultiAutocompleteDirective;
    }());
    multiSelectAutocomplete.MultiAutocompleteDirective = MultiAutocompleteDirective;
    angular.module('multiSelectAutocomplete', ["templates"])
        .directive('multiAutocomplete', [function () { return new multiSelectAutocomplete.MultiAutocompleteDirective(); }]);
})(multiSelectAutocomplete || (multiSelectAutocomplete = {}));
;
//# sourceMappingURL=multi-select-autocomplete-directive.js.map
var multiSelectAutocomplete;
(function (multiSelectAutocomplete) {
    var MultiAutocompleteCtrl = (function () {
        function MultiAutocompleteCtrl($scope, $log, $filter, $http) {
            var _this = this;
            this.$scope = $scope;
            this.$log = $log;
            this.$filter = $filter;
            this.$http = $http;
            this.selectedItemIndex = 0;
            this.isHover = false;
            this.isFocused = false;
            this.showInput = true;
            this.showOptionList = true;
            this.debounce = 600;
            this.keys = {
                38: 'up',
                40: 'down',
                8: 'backspace',
                13: 'enter',
                9: 'tab',
                27: 'esc'
            };
            this.alreadyAddedValues = function (item) {
                var isAdded = true;
                isAdded = !_this.isDuplicate(_this.modelArr, item);
                return isAdded;
            };
            /***** Event Methods *****/
            this.onMouseEnter = function () {
                _this.isHover = true;
            };
            this.onMouseLeave = function () {
                _this.isHover = false;
            };
            this.onFocus = function () {
                _this.isFocused = true;
            };
            this.onBlur = function () {
                _this.isFocused = false;
            };
            this.onChange = function () {
                if (_this.apiUrl && _this.apiUrl !== "") {
                    _this.getSuggestionsList(_this.inputValue);
                }
                _this.filterSuggestions(_this.inputValue);
                _this.selectedItemIndex = 0;
            };
            this.filterSuggestions = function (inputValue) {
                angular.forEach(_this.suggestionsArr, function (dat) {
                    if (!dat[_this.objectProperty].toLowerCase().includes(inputValue.toLowerCase())) {
                        dat.visible = false;
                    }
                    else {
                        dat.visible = true;
                    }
                });
            };
            this.shouldShowInput = function () {
                if (_this.multiple) {
                    _this.showInput = _this.modelArr.length >= _this.multiple ? false : true;
                    _this.showOptionList = _this.modelArr.length >= _this.multiple ? false : true;
                }
                else {
                    _this.showInput = _this.modelArr.length === _this.suggestionsArr.length ? false : true;
                    _this.showOptionList = _this.modelArr.length === _this.suggestionsArr.length ? false : true;
                }
            };
            this.isDuplicate = function (arr, item) {
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
            this.getSuggestionsList = function (input) {
                var url = _this.apiUrl + "?" + _this.apiSearchKey + "=" + input;
                _this.$http({
                    method: 'GET',
                    url: url
                }).then(function (response) {
                    _this.$log.log(response);
                    _this.suggestionsArr = response.data;
                }).catch(function (response) {
                    _this.suggestionsArr = _this.suggestionsArr;
                    _this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
                });
            };
            if (this.modelArr === null || this.modelArr === "" || this.modelArr === undefined) {
                this.modelArr = [];
            }
            if (!this.suggestionsArr || this.suggestionsArr === "") {
                if (this.apiUrl && this.apiUrl !== "") {
                    this.getSuggestionsList('');
                }
                else {
                    $log.log("MultiSelect typeahead ----- Please provide suggestion array list or url");
                }
            }
            if (this.sortBy && this.sortBy !== "") {
                this.suggestionsArr = this.$filter('orderBy')(this.suggestionsArr, this.sortBy);
            }
        }
        MultiAutocompleteCtrl.prototype.removeAddedValues = function (selectedValue) {
            if (this.modelArr && this.modelArr !== "") {
                var selectedValueIndex = this.modelArr.indexOf(selectedValue);
                if (selectedValueIndex !== -1)
                    this.modelArr.splice(selectedValueIndex, 1);
            }
            if (this.alertSelected) {
                this.alertSelected({ single: selectedValue, all: this.modelArr });
            }
            selectedValue.visible = true;
            this.shouldShowInput();
        };
        ;
        MultiAutocompleteCtrl.prototype.removeAll = function () {
            this.modelArr = [];
            this.shouldShowInput();
        };
        MultiAutocompleteCtrl.prototype.onSuggestedItemsClick = function (selectedValue) {
            if (this.multiple != null) {
                if (this.modelArr.length < this.multiple) {
                    this.modelArr.push(selectedValue);
                    this.inputValue = "";
                }
            }
            else {
                this.modelArr.push(selectedValue);
                this.inputValue = "";
            }
            if (this.alertSelected) {
                this.alertSelected({ single: selectedValue, all: this.modelArr });
            }
            selectedValue.visible = false;
            this.shouldShowInput();
        };
        ;
        MultiAutocompleteCtrl.prototype.keyParser = function ($event) {
            var key = this.keys[$event.keyCode];
            if (key === 'backspace' && this.inputValue === "") {
                if (this.modelArr.length != 0) {
                    var removedValue = this.modelArr[this.modelArr.length - 1];
                    removedValue.visible = true;
                    this.modelArr.pop();
                    if (this.alertSelected) {
                        this.alertSelected({ single: removedValue, all: this.modelArr });
                    }
                }
            }
            else if (key === 'down') {
                var i = this.selectedItemIndex + 1;
                while (this.suggestionsArr[i]) {
                    if (this.suggestionsArr[i].visible) {
                        this.selectedItemIndex = i;
                        break;
                    }
                    else {
                        i++;
                    }
                }
            }
            else if (key === 'up' && this.selectedItemIndex > 0) {
                var i = this.selectedItemIndex - 1;
                while (this.suggestionsArr[i]) {
                    if (this.suggestionsArr[i].visible) {
                        this.selectedItemIndex = i;
                        break;
                    }
                    else {
                        i--;
                    }
                }
            }
            else if (key === 'esc') {
                this.isHover = false;
                this.isFocused = false;
            }
            else if (key === 'enter') {
                this.onSuggestedItemsClick(this.suggestionsArr[this.selectedItemIndex]);
            }
        };
        ;
        MultiAutocompleteCtrl.prototype.mouseEnterOnItem = function (index) {
            this.selectedItemIndex = index;
        };
        ;
        return MultiAutocompleteCtrl;
    }());
    /* Dependency inject*/
    MultiAutocompleteCtrl.$inject = ['$scope', '$log', '$filter', '$http'];
    multiSelectAutocomplete.MultiAutocompleteCtrl = MultiAutocompleteCtrl;
    angular.module('multiSelectAutocomplete')
        .controller('MultiAutocompleteCtrl', multiSelectAutocomplete.MultiAutocompleteCtrl);
})(multiSelectAutocomplete || (multiSelectAutocomplete = {}));
//# sourceMappingURL=multi-select-autocomplete-controller.js.map