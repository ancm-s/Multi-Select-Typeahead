module multiSelectAutocomplete {
    interface IScopeOptions {
      placeholder: string,
      modelArr: string,
      apiUrl: string,
      suggestionsArr: string,
      objectProperty: string,
      disable: string,
      multiple: string,
      clearAll:string,
      closeOnSelect:string,
      sortBy:string,
      alertSelected:string,
      debounce: string
      apiSearchKey: string
    }


    export class MultiAutocompleteDirective {

        public link: Function = (scope: angular.IScope, element: JQuery, attr: angular.IAttributes) => {
            scope['isRequired'] = attr['required'];
            scope['errMsgRequired'] = attr['errMsgRequired'];
            scope['name'] = attr['name'];
            scope.$watch('vm.suggestionsArr', n => {
              if(n){
                if (scope['vm'].sortBy && scope['vm'].sortBy !== "") {
                    scope['vm'].formatedSuggestionsArr = scope['vm'].$filter('orderBy')(scope['vm'].suggestionsArr, scope['vm'].sortBy);
                } else {
                  scope['vm'].formatedSuggestionsArr = scope['vm'].suggestionsArr

                }
              }
            })
        };

        restrict: string = 'E';
        templateUrl: string = `multi-select-autocomplete.html`;

        controller = multiSelectAutocomplete.MultiAutocompleteCtrl;
        controllerAs: string = 'vm';
        bindToController: boolean = true;
        scope: IScopeOptions = {
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
        }
    }

    angular.module('multiSelectAutocomplete', ["templates"])
        .directive('multiAutocomplete', [() => { return new multiSelectAutocomplete.MultiAutocompleteDirective() }]);
};
