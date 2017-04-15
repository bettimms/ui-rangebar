/**
 * Created by betim on 3/28/2017.
 */

(function (app) {

    app.controller("HomeController", ["$scope", "$compile", "$http", "PopoverService", HomeController])
    function HomeController($scope, $compile, $http, PopoverService) {
        var vm = this;
        var counter = 0;
        var baseName = "X_";
        var template;

        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: false, changeBtnVisible: false, reloadBtnVisible: true
        }
        vm.rangeBar = {};

        $http.get("examples/popover-content.html").then(function (response) {
            $("body").append(response.data);
            template = $compile(angular.element("#popover-content").html())($scope);
        });


        var sampleModel = {name: "Interval X", startTime: "04:10:00", endTime: "06:10:00"};
        var values = {
            name: "Main obj",
            intervals: [
                {
                    startTime: "17:10:00",
                    endTime: "23:55:00",
                    totalHours: ""
                },
                {
                    startTime: "08:40:00",
                    endTime: "14:10:00",
                    totalHours: ""
                }]
        }
        vm.values = angular.copy(values);
        vm.options = {
            syncOnChanging: true,
            min: 0,
            max: 1440,
            rangeClass: "green",
            model: {
                bind: {
                    startProp: "startTime",
                    endProp: "endTime",
                    totalSize: "totalHours",
                    valuesKeyPath: "intervals"
                },
                formatter: formatter
            },
            label: function (a) {
                return a[0] + " - " + a[1];
            },
            valueFormat: minutesToHours,
            valueParse: timeToMinutes,
            changing: function (ev, range, bar) {
                PopoverService.hidePopover();
            },
            click: function (ev, bar, index) {
                vm.index = index;
                vm.bar = bar;
                vm.range = bar.$model;
                vm.start = vm.range[vm.options.model.bind.startProp];
                vm.end = vm.range[vm.options.model.bind.endProp];

                $scope.$apply();
                PopoverService.togglePopover(bar.$el, template);
            }
        };

        function minutesToHours(minutes) {
            minutes = Math.round(minutes);
            var h = ("00" + Math.floor(minutes / 60)).slice(-2);
            var m = ("00" + Math.round(minutes % 60)).slice(-2);
            return h + ":" + m;
        }

        function timeToMinutes(time) {
            try {
                var parts = time.split(":");
                if (parts.length === 1)
                    return time;
                var h = parts[0];
                var m = parts[1];
                return h * 60 + m * 1;
            } catch (e) {
                return time;
            }
        }

        function formatter(a) {
            var array = [];
            array.push({
                startTime: a[0] + ":00",
                endTime: a[1] + ":00"
            });
            return array;
        }


        //#region Popover
        vm.updateRange = function () {
            vm.range[vm.options.model.bind.startProp] = vm.start;
            vm.range[vm.options.model.bind.endProp] = vm.end;
            vm.bar.update();//Or
            // vm.bar.update(vm.range);//With new model
            PopoverService.hidePopover();
        }
        vm.removeRange = function (fromPopover) {
            if (fromPopover) {
                vm.values.intervals.splice(vm.index, 1);
                PopoverService.hidePopover();
            }
            else vm.values.intervals.shift();
        }
        //#endregion

        //#region CRUD
        vm.addRange = function () {
            if (!vm.values) vm.values = [];
            var copy = angular.copy(sampleModel);
            copy.name = baseName + counter;
            vm.values.intervals.push(copy);
            counter++;
        }
        vm.reloadModel = function () {
            vm.values = angular.copy(values);
        }
        //#endregion
    }
})(angular.module("app"));