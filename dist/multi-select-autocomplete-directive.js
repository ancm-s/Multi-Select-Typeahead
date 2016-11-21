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