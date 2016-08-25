module multiSelectAutocomplete {


    export class MultiAutocompleteCtrl {

        static $inject = ['$scope', '$log', '$filter', '$http'];
        public modelArr: any;
        apiUrl: any;
        sortBy: any;
        multiple: any;
        suggestionsArr: any;
        inputValue: string;
        selectedItemIndex = 0;
        isHover: Boolean = false;
        isFocused: Boolean = false;
        showInput: Boolean = true;
        showOptionList: Boolean = true;
        private keys = {
            38: 'up',
            40: 'down',
            8: 'backspace',
            13: 'enter',
            9: 'tab',
            27: 'esc'
        };


        constructor(public $scope: angular.IScope,
            public $log: angular.ILogService,
            public $filter: angular.IFilterService,
            public $http: angular.IHttpService,
            ) {
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

        removeAddedValues = (selectedValue) => {
            if (this.modelArr && this.modelArr !== "") {
                var selectedValueIndex = this.modelArr.indexOf(selectedValue);
                if (selectedValueIndex !== -1)
                    this.modelArr.splice(selectedValueIndex, 1);
            }
            this.shouldShowInput();
        };

        removeAll = () => {
            this.modelArr = [];
            this.shouldShowInput();
        }

        onSuggestedItemsClick = (selectedValue) => {
            if (this.multiple != null && this.multiple != "") {
                if (this.modelArr.length < this.multiple) {
                    this.modelArr.push(selectedValue);
                    this.inputValue = "";
                }
            } else {
                this.modelArr.push(selectedValue);
                this.inputValue = "";
            }
            this.shouldShowInput();
        };

        keyParser = ($event) => {
            var key = this.keys[$event.keyCode];
            if (key === 'backspace' && this.inputValue === "") {
                if (this.modelArr.length != 0)
                    this.modelArr.pop();
            } else if (key === 'down') {
                var filteredSuggestionArr = this.$filter('filter')(this.suggestionsArr, this.inputValue);
                filteredSuggestionArr = this.$filter('filter')(filteredSuggestionArr, this.alreadyAddedValues);
                if (this.selectedItemIndex < filteredSuggestionArr.length - 1)
                    this.selectedItemIndex++;
            } else if (key === 'up' && this.selectedItemIndex > 0) {
                this.selectedItemIndex--;
            } else if (key === 'esc') {
                this.isHover = false;
                this.isFocused = false;
            } else if (key === 'enter') {
                var filteredSuggestionArr = this.$filter('filter')(this.suggestionsArr, this.inputValue);
                filteredSuggestionArr = this.$filter('filter')(filteredSuggestionArr, this.alreadyAddedValues);
                if (this.selectedItemIndex < filteredSuggestionArr.length)
                    this.onSuggestedItemsClick(filteredSuggestionArr[this.selectedItemIndex]);
            }
        };

        alreadyAddedValues = (item) => {
            var isAdded = true;
            isAdded = !this.isDuplicate(this.modelArr, item);
            return isAdded;
        };

        mouseEnterOnItem = (index) =>{
            this.selectedItemIndex = index;
        };

        /***** Event Methods *****/
        onMouseEnter = () =>{
            this.isHover = true
        };

        onMouseLeave = () =>{
            this.isHover = false;
        };

        onFocus = () =>{
            this.isFocused = true
        };

        onBlur = () =>{
            this.isFocused = false;
        };

        onChange = () =>{
            this.selectedItemIndex = 0;
        };

        shouldShowInput: any = () =>{
            if (this.multiple && this.multiple !== "") {
                this.showInput = this.modelArr.length >= this.multiple ? false : true;
                this.showOptionList = this.modelArr.length >= this.multiple ? false : true;
            } else {
                this.showInput = this.modelArr.length === this.suggestionsArr.length ? false : true;
                this.showOptionList = this.modelArr.length === this.suggestionsArr.length ? false : true;
            }
        }
        isDuplicate = (arr, item) => {
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
        getSuggestionsList = () => {
            var url = this.apiUrl;
            this.$http({
                method: 'GET',
                url: url
            }).then((response) => {
                this.$log.log(response);
                this.suggestionsArr = response.data;
            }, (response) => {
                this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
            });
        };
    }

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
        .directive('multiAutocomplete', [() => { return new multiSelectAutocomplete.MultiAutocompleteDirective() }])
        .controller('MultiAutocompleteCtrl',  multiSelectAutocomplete.MultiAutocompleteCtrl);
};
