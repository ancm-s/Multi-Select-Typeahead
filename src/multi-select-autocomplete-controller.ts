module multiSelectAutocomplete {
    export class MultiAutocompleteCtrl {
        /* Dependency inject*/
        static $inject = ['$scope', '$log', '$filter', '$http'];

        public modelArr: any;
        apiUrl: string;
        sortBy: string;
        multiple: number;
        suggestionsArr: any;
        inputValue: string;
        selectedItemIndex: number = 0;
        isHover: Boolean = false;
        isFocused: Boolean = false;
        showInput: Boolean = true;
        showOptionList: Boolean = true;
        alertSelected:any;
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

        removeAddedValues(selectedValue): void {
            if (this.modelArr && this.modelArr !== "") {
                var selectedValueIndex = this.modelArr.indexOf(selectedValue);
                if (selectedValueIndex !== -1)
                    this.modelArr.splice(selectedValueIndex, 1);
            }
            this.shouldShowInput();
        };

        removeAll(): void {
            this.modelArr = [];
            this.shouldShowInput();
        }

        onSuggestedItemsClick(selectedValue): void {
            if (this.multiple != null) {
                if (this.modelArr.length < this.multiple) {
                    this.modelArr.push(selectedValue);
                    this.inputValue = "";
                }
            } else {
                this.modelArr.push(selectedValue);
                this.inputValue = "";
            }
            if(this.alertSelected){
              this.alertSelected({single: selectedValue, all: this.modelArr});
            }
            this.shouldShowInput();
        };

        keyParser($event):void {
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

        mouseEnterOnItem(index) {
            this.selectedItemIndex = index;
        };

        /***** Event Methods *****/
        onMouseEnter = (): void => {
            this.isHover = true
        };

        onMouseLeave = (): void => {
            this.isHover = false;
        };

        onFocus = (): void => {
            this.isFocused = true
        };

        onBlur = (): void => {
            this.isFocused = false;
        };

        onChange = (): void => {
            this.selectedItemIndex = 0;
        };

        shouldShowInput = (): void => {
            if (this.multiple) {
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
        getSuggestionsList = (): void => {
            var url = this.apiUrl;
            this.$http({
                method: 'GET',
                url: url
            }).then((response): void => {
                this.$log.log(response);
                this.suggestionsArr = response.data;
            }).catch((response): void => {
                this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
            });
        };
    }

    angular.module('multiSelectAutocomplete')
        .controller('MultiAutocompleteCtrl', multiSelectAutocomplete.MultiAutocompleteCtrl);
}
