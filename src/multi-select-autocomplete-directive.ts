module multiSelectAutocomplete {



    export class MultiAutocompleteDirective {

        public link: Function = (scope: angular.IScope, element: JQuery, attr: angular.IAttributes) => {
            scope['isRequired'] = attr['required'];
            scope['errMsgRequired'] = attr['errMsgRequired'];
            scope['name'] = attr['name'];
        };

        restrict: string = 'E';
        templateUrl: string = `multi-select-autocomplete.html`;

        controller = multiSelectAutocomplete.MultiAutocompleteCtrl;
        controllerAs: string = 'vm';
        bindToController: boolean = true;
        scope: any = {
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
        }
    }

    angular.module('multiSelectAutocomplete', ["templates"])
        .directive('multiAutocomplete', [() => { return new multiSelectAutocomplete.MultiAutocompleteDirective() }]);
};
