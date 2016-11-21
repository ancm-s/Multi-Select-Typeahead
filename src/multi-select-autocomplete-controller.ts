module multiSelectAutocomplete {
    export class MultiAutocompleteCtrl {
        /* Dependency inject*/
        static $inject = ['$scope', '$log', '$filter', '$http'];

        public modelArr: any;
        apiUrl: string;
        sortBy: string;
        multiple: number;
        formatedSuggestionsArr: any;
        suggestionsArr: any;
        inputValue: string;
        selectedItemIndex: number = 0;
        isHover: Boolean = false;
        isFocused: Boolean = false;
        showInput: Boolean = true;
        showOptionList: Boolean = true;
        alertSelected: any;
        debounce: number = 500;
        apiSearchKey: string;
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

            if (!this.formatedSuggestionsArr || this.formatedSuggestionsArr === "") {
                if (this.apiUrl && this.apiUrl !== "") {
                    this.getSuggestionsList('');
                }
                else {
                    $log.log("MultiSelect typeahead ----- Please provide suggestion array list or url");
                }
            }

        }

        removeAddedValues(selectedValue): void {
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
            if (this.alertSelected) {
                this.alertSelected({ single: selectedValue, all: this.modelArr });
            }
            this.shouldShowInput();
        };

        keyParser($event): void {
            var key = this.keys[$event.keyCode];
            if (key === 'backspace' && this.inputValue === "") {
                if (this.modelArr.length != 0) {
                    const removedValue = this.modelArr[this.modelArr.length - 1];
                    this.modelArr.pop();
                    if (this.alertSelected) {
                        this.alertSelected({ single: removedValue, all: this.modelArr });
                    }
                }
            } else if (key === 'down') {
                var filteredSuggestionArr = this.$filter('filter')(this.formatedSuggestionsArr, this.inputValue);
                filteredSuggestionArr = this.$filter('filter')(filteredSuggestionArr, this.alreadyAddedValues);
                if (this.selectedItemIndex < filteredSuggestionArr.length - 1)
                    this.selectedItemIndex++;
            } else if (key === 'up' && this.selectedItemIndex > 0) {
                this.selectedItemIndex--;
            } else if (key === 'esc') {
                this.isHover = false;
                this.isFocused = false;
            } else if (key === 'enter') {
                var filteredSuggestionArr = this.$filter('filter')(this.formatedSuggestionsArr, this.inputValue);
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
            if (this.apiUrl && this.apiUrl !== "") {
                this.getSuggestionsList(this.inputValue);
            }
            this.selectedItemIndex = 0;
        };

        shouldShowInput = (): void => {
            if (this.multiple) {
                this.showInput = this.modelArr.length >= this.multiple ? false : true;
                this.showOptionList = this.modelArr.length >= this.multiple ? false : true;
            } else {
                this.showInput = this.modelArr.length === this.formatedSuggestionsArr.length ? false : true;
                this.showOptionList = this.modelArr.length === this.formatedSuggestionsArr.length ? false : true;
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
        getSuggestionsList = (input): void => {
            var url = `${this.apiUrl}?${this.apiSearchKey}=${input}`;
            this.$http({
                method: 'GET',
                url: url
            }).then((response): void => {
                this.$log.log(response);
                this.formatedSuggestionsArr = response.data;
            }).catch((response): void => {
                this.formatedSuggestionsArr = this.formatedSuggestionsArr;
                this.$log.log("MultiSelect typeahead ----- Unable to fetch list");
            });
        };
    }

    angular.module('multiSelectAutocomplete')
        .controller('MultiAutocompleteCtrl', multiSelectAutocomplete.MultiAutocompleteCtrl);
}
