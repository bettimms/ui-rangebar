/**
 * Created by betim on 3/28/2017.
 */

(function (app) {

    app.controller("HomeController", ["$timeout", HomeController])
    function HomeController($timeout) {
        var vm = this;
        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: true, changeBtnVisible: true, reloadBtnVisible: false
        }
        $timeout(function () {
            //Simulate delay of ngModel values
            vm.values = [[1, 5], [20, 30], [50, 60]];
        }, 1500);


        vm.options = {
            rangeClass: "red",
            syncOnChanging: true,
            label: function (val) {
                return parseInt(val[0], 0) + " - " + parseInt(val[1], 0);
            }
        };
        vm.addRange = function () {
            vm.values.push([61, 70]);
        }
        vm.removeRange = function () {
            vm.values.pop();
        }
        vm.changeModel = function () {
            if (!vm.values.length > 0) return;
            var newVal = angular.copy(vm.values[1]);
            if (newVal) {
                newVal[0] = 3;
                newVal[1] = newVal[0] + 5;
            }
            vm.values[1] = newVal;
        }
    }
})(angular.module("app"));