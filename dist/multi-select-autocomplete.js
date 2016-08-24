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
            this.keys = {
                38: 'up',
                40: 'down',
                8: 'backspace',
                13: 'enter',
                9: 'tab',
                27: 'esc'
            };
            this.removeAddedValues = function (selectedValue) {
                if (_this.modelArr && _this.modelArr !== "") {
                    var selectedValueIndex = _this.modelArr.indexOf(selectedValue);
                    if (selectedValueIndex !== -1)
                        _this.modelArr.splice(selectedValueIndex, 1);
                }
                _this.shouldShowInput();
            };
            this.removeAll = function () {
                _this.modelArr = [];
                _this.shouldShowInput();
            };
            this.onSuggestedItemsClick = function (selectedValue) {
                if (_this.multiple != null && _this.multiple != "") {
                    if (_this.modelArr.length < _this.multiple) {
                        _this.modelArr.push(selectedValue);
                        _this.inputValue = "";
                    }
                }
                else {
                    _this.modelArr.push(selectedValue);
                    _this.inputValue = "";
                }
                _this.shouldShowInput();
            };
            this.keyParser = function ($event) {
                var key = _this.keys[$event.keyCode];
                if (key === 'backspace' && _this.inputValue === "") {
                    if (_this.modelArr.length != 0)
                        _this.modelArr.pop();
                }
                else if (key === 'down') {
                    var filteredSuggestionArr = _this.$filter('filter')(_this.suggestionsArr, _this.inputValue);
                    filteredSuggestionArr = _this.$filter('filter')(filteredSuggestionArr, _this.alreadyAddedValues);
                    if (_this.selectedItemIndex < filteredSuggestionArr.length - 1)
                        _this.selectedItemIndex++;
                }
                else if (key === 'up' && _this.selectedItemIndex > 0) {
                    _this.selectedItemIndex--;
                }
                else if (key === 'esc') {
                    _this.isHover = false;
                    _this.isFocused = false;
                }
                else if (key === 'enter') {
                    var filteredSuggestionArr = _this.$filter('filter')(_this.suggestionsArr, _this.inputValue);
                    filteredSuggestionArr = _this.$filter('filter')(filteredSuggestionArr, _this.alreadyAddedValues);
                    if (_this.selectedItemIndex < filteredSuggestionArr.length)
                        _this.onSuggestedItemsClick(filteredSuggestionArr[_this.selectedItemIndex]);
                }
            };
            this.alreadyAddedValues = function (item) {
                var isAdded = true;
                isAdded = !_this.isDuplicate(_this.modelArr, item);
                return isAdded;
            };
            this.mouseEnterOnItem = function (index) {
                _this.selectedItemIndex = index;
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
                _this.selectedItemIndex = 0;
            };
            this.shouldShowInput = function () {
                if (_this.multiple && _this.multiple !== "") {
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
            this.getSuggestionsList = function () {
                var url = _this.apiUrl;
                _this.$http({
                    method: 'GET',
                    url: url
                }).then(function (response) {
                    _this.$log.log(response);
                    _this.suggestionsArr = response.data;
                }, function (response) {
                    _this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
                });
            };
            if (this.modelArr === null || this.modelArr === "" || this.modelArr === undefined) {
                this.modelArr = [];
            }
            if (!this.suggestionsArr || this.suggestionsArr === "") {
                if (this.apiUrl && this.apiUrl !== "") {
                    console.log(this.apiUrl);
                    this.getSuggestionsList();
                }
                else {
                    $log.log("MultiSelect typeahead ----- Please provide suggestion array list or url");
                }
            }
            if (this.sortBy && this.sortBy !== "") {
                this.suggestionsArr = this.$filter('orderBy')(this.suggestionsArr, this.sortBy);
            }
        }
        MultiAutocompleteCtrl.$inject = ['$scope', '$log', '$filter', '$http'];
        return MultiAutocompleteCtrl;
    }());
    multiSelectAutocomplete.MultiAutocompleteCtrl = MultiAutocompleteCtrl;
    var MultiAutocompleteDirective = (function () {
        function MultiAutocompleteDirective() {
            this.link = function (scope, element, attr) {
                scope['isRequired'] = attr['required'];
                scope['errMsgRequired'] = attr['errMsgRequired'];
                scope['name'] = attr['name'];
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
                sortBy: '=?'
            };
        }
        return MultiAutocompleteDirective;
    }());
    multiSelectAutocomplete.MultiAutocompleteDirective = MultiAutocompleteDirective;
    angular.module('multiSelectAutocomplete')
        .directive('multiAutocomplete', [function () { return new multiSelectAutocomplete.MultiAutocompleteDirective(); }]);
})(multiSelectAutocomplete || (multiSelectAutocomplete = {}));
;
//# sourceMappingURL=multi-select-autocomplete.js.map