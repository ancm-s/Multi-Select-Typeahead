(function () {

    angular.module('multiSelectAutocomplete').controller('homeController', function ($scope) {
        $scope.apiPath = "web/resources/skills.json";
        $scope.skills = [];
        $scope.skillsList = [
            {id: 1, name : "plan A"},
            {id: 2, name : "Plan B"},
            {id: 3, name : "Plan C"},
            {id: 4, name : "Plan D"},
            {id: 5, name : "My awesome Plan"},
            {id: 6, name : "Not So Awesome Plan"},
            {id: 7, name : "Plan it"},
            {id: 8, name : "New Plan"},
            {id: 9, name : "New Plan A"},
            {id: 10, name : "Bootstrap Plan"}
        ];
        $scope.placeholder = 'Select An plan';
        $scope.sortBy= 'name';
        $scope.objectProperty = 'name';
        $scope.skillsList1 = [
            "plan A",
            "Plan B",
            "Plan C",
            "Plan D",
            "My awesome Plan",
            "Not So Awesome Plan",
            "Plan it",
            "New Plan",
            "New Plan A",
            "Bootstrap Plan"
        ];

        $scope.onSubmit = function () {
            console.log("submit");
            if($scope.multipleSelectForm.$invalid){
                if($scope.multipleSelectForm.$error.required != null){
                    $scope.multipleSelectForm.$error.required.forEach(function(element){
                        element.$setDirty();
                    });
                }
                return null;
            }
            alert("valid field");
        };
    });
})();
