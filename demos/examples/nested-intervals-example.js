/**
 * Created by betim on 3/28/2017.
 */

(function (app) {

    app.controller("HomeController", [HomeController])
    function HomeController() {
        var vm = this;
        var counter = 0;
        var baseName = "X_";

        vm.buttonsControl = {
            addBtnVisible: true, removeBtnVisible: true, changeBtnVisible: false, reloadBtnVisible: true
        }
        vm.rangeBar = {};

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
            valueParse: timeToMinutes
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

        //#region CRUD
        vm.addRange = function () {
            if (!vm.values) vm.values = [];
            var copy = angular.copy(sampleModel);
            copy.name = baseName + counter;
            vm.values.intervals.push(copy);
            counter++;
        }
        vm.removeRange = function () {
            vm.values.intervals.shift();
        }
        vm.reloadModel = function () {
            vm.values = angular.copy(values);
        }
        //#endregion
    }
})(angular.module("app"));