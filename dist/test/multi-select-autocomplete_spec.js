describe('multi-Autocomplete', function () {
    beforeEach(angular.mock.module('multiSelectAutocomplete'));
    var html, scope, element, compile, $httpBackend, $controller;
    var plans = ["Awesome Plan", "Not so Awesome Plan", "sucky Plan"];
    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, $controller) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        compile = $compile;
    }));
    describe('when non required options are provided', function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.plans = ["Awesome Plan", "Sucky Plan", "Not so Awesome Plan"];
            scope.placeholder = 'give it up';
            scope.disabled = false;
            scope.alertSelected = function (single, all) {
                scope.single = single;
                scope.all = all;
            };
            html = "<multi-autocomplete ng-model=\"selectedPlans\" sort-by=\"true\" alert-selected=\"alertSelected(single, all)\" placeholder=\"placeholder\" suggestions-arr=\"plans\" clear-all=\"true\" disable=\"disabled\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
        });
        it('should call alert selected function with required parmas when user selects an item', function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.single).toEqual("Awesome Plan");
            expect(scope.all).toEqual(["Awesome Plan"]);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.single).toEqual("Not so Awesome Plan");
            expect(scope.all).toEqual(["Awesome Plan", "Not so Awesome Plan"]);
        });
        it('should contain clear all selected icon when clear-all option is true', function () {
            expect(element.find('i.remove.icon.pull-right')).toExist();
        });
        it('input should have placeholder if provided in options', function () {
            expect(element.find('input')).toHaveAttr('placeholder', scope.placeholder);
        });
        it('should name the input when name is provided', function () {
            expect(element.find('input')).toHaveAttr('name', 'multipleSelect');
        });
        it('should disable/enable input if disable option is provided', function () {
            expect(element.find('input')).not.toHaveAttr('disabled', 'disabled');
            scope.disabled = true;
            scope.$apply();
            expect(element.find('input')).toHaveAttr('disabled', 'disabled');
        });
        it('should order the array or strings', function () {
            expect(element.find('.autocomplete-list').find('li')[0]).toContainText("Awesome Plan");
            expect(element.find('.autocomplete-list').find('li')[2]).toContainText("Sucky Plan");
        });
        it('autocomplete-list dropdown should contain same number of options as skill list', function () {
            expect(element.find('.autocomplete-list').find('li').length).toEqual(scope.plans.length);
            scope.plans.pop();
            scope.$apply();
            expect(element.find('.autocomplete-list').find('li').length).toEqual(scope.plans.length);
        });
    });
    describe('when objectProperty is provided and plan is array of objects', function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.orderBy = 'name';
            scope.plans = [{
                    name: "Awesome Plan",
                    id: 1
                }, {
                    name: "Not awesome Plan",
                    id: 2
                }, {
                    name: "Sucky Plan",
                    id: 3
                }, {
                    id: 4,
                    name: "Alpha Plan"
                }];
            scope.placeholder = 'give it up';
            scope.objectProperty = 'name';
            scope.disabled = false;
            html = "<multi-autocomplete ng-model=\"selectedPlans\" sort-by=\"orderBy\" object-property=\"objectProperty\" placeholder=\"placeholder\" suggestions-arr=\"plans\" clear-all=\"true\" disable=\"disabled\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
        });
        it('should add selected option to selectedPlans array', function () {
            expect(element.find('.autocomplete-list').find('li')[0]).toContainText(scope.plans[0].name);
            expect(element.find('.autocomplete-list').find('li')[0]).not.toContainText(scope.plans[0].id);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[0]).toEqual(scope.plans[0]);
            expect(element.find('.autocomplete-list').find('li')[0]).not.toContainText(scope.plans[0].name);
            expect(element.find('.autocomplete-list').find('li')[0]).not.toContainText(scope.plans[0].id);
        });
        it('should order by the property name provided', function () {
            expect(element.find('.autocomplete-list').find('li')[0]).toContainText("Alpha Plan");
            expect(element.find('.autocomplete-list').find('li')[3]).toContainText("Sucky Plan");
        });
    });
    describe('when option is selected from dropdown and multiple is not provided', function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.plans = ["Awesome Plan", "Not so Awesome Plan", "sucky Plan"];
            scope.placeholder = 'give it up';
            scope.disabled = false;
            html = "<multi-autocomplete ng-model=\"selectedPlans\" placeholder=\"placeholder\" suggestions-arr=\"plans\" clear-all=\"true\" disable=\"disabled\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
        });
        it('should add selected option to selectedPlans array', function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[0]).toEqual(scope.plans[0]);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[1]).toEqual(scope.plans[1]);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[2]).toEqual(scope.plans[2]);
        });
        it('should remove selected option from the option dropdown', function () {
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 1);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 2);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 3);
        });
    });
    describe('when option is selected from dropdown and multiple is equal to length of options provided', function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.plans = ["Awesome Plan", "Not so Awesome Plan", "sucky Plan"];
            scope.placeholder = 'give it up';
            scope.disabled = false;
            scope.multiple = scope.plans.length;
            html = "<multi-autocomplete ng-model=\"selectedPlans\" clear-all=\"true\" suggestions-arr=\"plans\" clear-all=\"true\" multiple=\"multiple\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
        });
        it('should add selected option to selectedPlans array', function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[0]).toEqual(scope.plans[0]);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[1]).toEqual(scope.plans[1]);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[2]).toEqual(scope.plans[2]);
        });
        it('should remove selected option from the option dropdown', function () {
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 1);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 2);
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 3);
        });
        it("should clear all the selected options", function () {
            element.find('.autocomplete-list').find('li')[0].click();
            element.find('.autocomplete-list').find('li')[0].click();
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length - 3);
            element.find('i.remove.icon.pull-right').click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length);
        });
    });
    describe('when option is selected from dropdown and multiple is equal 1', function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.plans = ["Awesome Plan", "Not so Awesome Plan", "sucky Plan"];
            scope.placeholder = 'give it up';
            scope.disabled = false;
            scope.multiple = 1;
            html = "<multi-autocomplete ng-model=\"selectedPlans\" suggestions-arr=\"plans\" clear-all=\"true\" multiple=\"multiple\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
        });
        it('should add selected option to selectedPlans array and remove dropdown after 1 selection', function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(scope.selectedPlans[0]).toEqual(scope.plans[0]);
            expect(getDropdownOptionsLength()).toEqual(0);
        });
        it('should hide the input if an option has been selected', function () {
            expect(element.find('input')).toExist();
            element.find('.autocomplete-list').find('li')[0].click();
            expect(element.find('input')).not.toExist();
        });
        it('should reset input if selection has been cleared', function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(element.find('input')).not.toExist();
            element.find('.remove').click();
            expect(element.find('input')).toExist();
        });
        it("should clear selected and reset the dropdown to original state", function () {
            element.find('.autocomplete-list').find('li')[0].click();
            expect(getDropdownOptionsLength()).toEqual(0);
            element.find('.remove').click();
            expect(getDropdownOptionsLength()).toEqual(scope.plans.length);
        });
    });
    describe("when api url is provided", function () {
        beforeEach(function () {
            scope.selectedPlans = [];
            scope.placeholder = 'give it up';
            scope.apiPath = "web/resources/skills.json";
            scope.disabled = false;
            $httpBackend.expectGET('web/resources/skills.json')
                .respond(function () {
                return [200, plans];
            });
            html = "<multi-autocomplete ng-model=\"selectedPlans\" api-url=\"{{apiPath}}\" clear-all=\"true\" disable=\"disabled\" name=\"multipleSelect\"></multi-autocomplete>";
            compileElement(html);
            $httpBackend.flush();
        });
        it('should fetch json from url', function () {
            $httpBackend.expectGET('web/resources/skills.json');
            expect(element.find('.autocomplete-list').find('li').length).toEqual(plans.length);
            it('should add selected option to selectedPlans array', function () {
                element.find('.autocomplete-list').find('li')[0].click();
                expect(scope.selectedPlans[0]).toEqual(scope.plans[0]);
                element.find('.autocomplete-list').find('li')[0].click();
                expect(scope.selectedPlans[1]).toEqual(scope.plans[1]);
                element.find('.autocomplete-list').find('li')[0].click();
                expect(scope.selectedPlans[2]).toEqual(scope.plans[2]);
            });
        });
    });
    function compileElement(htmlTag) {
        element = compile(htmlTag)(scope);
        scope.$apply();
    }
    function getDropdownOptionsLength() {
        return element.find('.autocomplete-list').find('li').length;
    }
});
//# sourceMappingURL=multi-select-autocomplete_spec.js.map