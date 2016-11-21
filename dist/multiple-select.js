var multiSelectAutocomplete;
(function (multiSelectAutocomplete) {
    var MultiAutocompleteDirective = (function () {
        function MultiAutocompleteDirective() {
            this.link = function (scope, element, attr) {
                scope['isRequired'] = attr['required'];
                scope['errMsgRequired'] = attr['errMsgRequired'];
                scope['name'] = attr['name'];
                scope.$watch('vm.suggestionsArr', function (n) {
                    if (n) {
                        if (scope['vm'].sortBy && scope['vm'].sortBy !== "") {
                            scope['vm'].formatedSuggestionsArr = scope['vm'].$filter('orderBy')(scope['vm'].suggestionsArr, scope['vm'].sortBy);
                        }
                        else {
                            scope['vm'].formatedSuggestionsArr = scope['vm'].suggestionsArr;
                        }
                    }
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
            this.debounce = 500;
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
                _this.selectedItemIndex = 0;
            };
            this.shouldShowInput = function () {
                if (_this.multiple) {
                    _this.showInput = _this.modelArr.length >= _this.multiple ? false : true;
                    _this.showOptionList = _this.modelArr.length >= _this.multiple ? false : true;
                }
                else {
                    _this.showInput = _this.modelArr.length === _this.formatedSuggestionsArr.length ? false : true;
                    _this.showOptionList = _this.modelArr.length === _this.formatedSuggestionsArr.length ? false : true;
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
                    _this.formatedSuggestionsArr = response.data;
                }).catch(function (response) {
                    _this.formatedSuggestionsArr = _this.formatedSuggestionsArr;
                    _this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
                });
            };
            if (this.modelArr === null || this.modelArr === "" || this.modelArr === undefined) {
                this.modelArr = [];
            }
            if (!this.formatedSuggestionsArr || this.formatedSuggestionsArr === "") {
                if (this.apiUrl && this.apiUrl !== "") {
                    this.getSuggestionsList('');
                }
                else {
                    $log.log("MultiSelect typeahead ----- Please provide suggestion array list or url");
                }
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
            this.shouldShowInput();
        };
        ;
        MultiAutocompleteCtrl.prototype.keyParser = function ($event) {
            var key = this.keys[$event.keyCode];
            if (key === 'backspace' && this.inputValue === "") {
                if (this.modelArr.length != 0) {
                    var removedValue = this.modelArr[this.modelArr.length - 1];
                    this.modelArr.pop();
                    if (this.alertSelected) {
                        this.alertSelected({ single: removedValue, all: this.modelArr });
                    }
                }
            }
            else if (key === 'down') {
                var filteredSuggestionArr = this.$filter('filter')(this.formatedSuggestionsArr, this.inputValue);
                filteredSuggestionArr = this.$filter('filter')(filteredSuggestionArr, this.alreadyAddedValues);
                if (this.selectedItemIndex < filteredSuggestionArr.length - 1)
                    this.selectedItemIndex++;
            }
            else if (key === 'up' && this.selectedItemIndex > 0) {
                this.selectedItemIndex--;
            }
            else if (key === 'esc') {
                this.isHover = false;
                this.isFocused = false;
            }
            else if (key === 'enter') {
                var filteredSuggestionArr = this.$filter('filter')(this.formatedSuggestionsArr, this.inputValue);
                filteredSuggestionArr = this.$filter('filter')(filteredSuggestionArr, this.alreadyAddedValues);
                if (this.selectedItemIndex < filteredSuggestionArr.length)
                    this.onSuggestedItemsClick(filteredSuggestionArr[this.selectedItemIndex]);
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