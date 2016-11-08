var multiSelectAutocomplete;
(function (multiSelectAutocomplete) {
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
                sortBy: '=?',
                alertSelected: '&?'
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