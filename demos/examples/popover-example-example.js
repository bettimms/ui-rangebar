/**
 * Created by betim on 3/12/2017.
 */
/**
 * Created by betim on 2/15/2017.
 */
(function (app) {

    app.controller("HomeController", ["$scope", "$compile", "$http", "PopoverService", HomeController])
    function HomeController($scope, $compile, $http, PopoverService) {
        var vm = this;
        var template;
        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: false, changeBtnVisible: false, reloadBtnVisible: false
        }
        vm.values = [[1, 5], [20, 30], [50, 60]];

        $http.get("examples/popover-content.html").then(function (response) {
            $("body").append(response.data);
            template = $compile(angular.element("#popover-content").html())($scope);
        });

        vm.options = {
            rangeStyle: "{color:'white','background-color':'green','text-align':'center'}",
            rangeClass: "green",
            changing: function (ev, range, bar) {
                PopoverService.hidePopover();
            },
            click: function (ev, bar, index) {
                vm.index = index;
                vm.bar = bar;
                vm.range = vm.values[index];
                vm.start = parseInt(vm.range[0], 0);
                vm.end = parseInt(vm.range[1], 0);

                $scope.$apply();
                PopoverService.togglePopover(bar.$el, template);
            }
        };


        vm.addRange = function () {
            vm.values.push([61, 70]);
        }
        vm.updateRange = function () {
            vm.range[0] = parseInt(vm.start);
            vm.range[1] = parseInt(vm.end);
            vm.bar.update(vm.range);
            PopoverService.hidePopover();
        }
        vm.removeRange = function (fromPopover) {
            if (fromPopover) {
                vm.values.splice(vm.index, 1);
                PopoverService.hidePopover();
            }
            else vm.values.shift();
        }
    }
})(angular.module("app"));