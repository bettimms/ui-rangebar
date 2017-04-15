/**
 * Created by betim on 3/28/2017.
 */

(function (app) {

    app.controller("HomeController", [HomeController])
    function HomeController() {
        var vm = this;
        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: true, changeBtnVisible: true, reloadBtnVisible: false
        }
        var counter = 0;
        var baseName = "X_";

        vm.sampleModel = {name: "Interval X", startTime: "12:20", endTime: "16:15"};

        vm.values = [{name: "Interval A", startTime: "10:20", endTime: "19:15"}];

        function formatter(values) {
            var array = [];
            var start = timeToMinutes(values[0]);
            var end = timeToMinutes(values[1]);

            var sDay = start.mins / 1440;
            var eDay = end.mins / 1440;

            vm.result = {
                start: start.h,
                end: end.h,
                startH24: start.h % 24,
                startM24: +start.m,
                endH24: end.h % 24,
                endM24: +end.m,
                startDay: Math.floor(sDay),
                endDay: Math.floor(eDay),
            }
            array.push({
                startTime: vm.result.startH24 + ":" + vm.result.startM24,
                endTime: vm.result.endH24 + ":" + vm.result.endM24
            })
            return array;
        }

        vm.options = {
            syncOnChanging: true,
            min: 0,
            max: 10080,
            model: {
                bind: {
                    startProp: "startTime",
                    endProp: "endTime",
                },
                formatter: formatter
            },
            rangeClass: "red",
            label: function (values) {
                var start = timeToMinutes(values[0]);
                var end = timeToMinutes(values[1]);

                var sDay = start.mins / 1440;
                var eDay = end.mins / 1440;

                vm.result = {
                    start: start.h,
                    end: end.h,
                    startH24: start.h % 24,
                    startM24: +start.m,
                    endH24: end.h % 24,
                    endM24: +end.m,
                    startDay: Math.floor(sDay),
                    endDay: Math.floor(eDay),
                }
                return (vm.result.startH24 + ":" + vm.result.startM24) +
                    " - " +
                    (vm.result.endH24 + ":" + vm.result.endM24);
            },
            valueFormat: function (minutes) {
                minutes = Math.round(minutes);
                var h = Math.floor(minutes / 60);
                var m = Math.round(minutes % 60);
                return h + ":" + m;
            }
            ,
            valueParse: function (time) {
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
        };

        vm.addRange = function () {
            if (!vm.values) vm.values = [];
            vm.sampleModel.name = baseName + counter;
            vm.values.push(angular.copy(vm.sampleModel));
            counter++;
        }
        vm.removeRange = function () {
            vm.values.shift();
        }
        vm.changeModel = function () {
            var newVal = angular.copy(vm.values[1]);
            if (newVal) {
                newVal.startTime = "14:00";
                newVal.endTime = "23:57";
            }
            vm.values[1] = newVal;
        }
        function timeToMinutes(time) {
            try {
                var parts = time.split(":");
                if (parts.length === 1)
                    return time;
                var h = parts[0];
                var m = parts[1];
                return {h: h, m: m, mins: h * 60 + m * 1};
            } catch (e) {
                return time;
            }
        }
    }
})(angular.module("app"));