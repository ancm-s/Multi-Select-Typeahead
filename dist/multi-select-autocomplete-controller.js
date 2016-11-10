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
                var filteredSuggestionArr = this.$filter('filter')(this.suggestionsArr, this.inputValue);
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
                var filteredSuggestionArr = this.$filter('filter')(this.suggestionsArr, this.inputValue);
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