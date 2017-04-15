/**
 * Created by betim on 3/28/2017.
 */

(function (app) {

    app.controller("HomeController", ["$timeout", "$interval", HomeController])
    function HomeController($timeout, $interval) {
        var vm = this;
        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: true, changeBtnVisible: true, reloadBtnVisible: false
        }
        var max = 100;
        vm.values = [];

        var timer = $timeout(function () {
            vm.values = [[1, 5]];
            $timeout.cancel(timer);
            startInterval();
        }, 1000);

        function startInterval() {
            var interval = $interval(function () {
                if (!vm.values || vm.values.length === 0) {
                    $interval.cancel(interval);
                    return;
                }
                var copy = angular.copy(vm.values[0]);
                copy[1] = copy[1] + 1;
                if (copy[1] >= max) reset(vm.values);
                else vm.values = [copy];

            }, 1000);
        }

        function reset(range) {
            range[0][0] = 1;
            range[0][1] = 3;
        }

        vm.options = {
            rangeClass: "green",
            label: function (val) {
                return parseInt(val[0], 0) + " - " + parseInt(val[1], 0);
            }
        };

        vm.addRange = function () {
            vm.values.push([61, 70]);
        }
        vm.removeRange = function () {
            vm.values.shift();
        }
        vm.changeModel = function () {
            var newVal = angular.copy(vm.values[0]);
            if (newVal) {
                newVal[0] = 3;
                newVal[1] = newVal[0] + 5;
            }
            vm.values[0] = newVal;
        }
    }
})(angular.module("app"));