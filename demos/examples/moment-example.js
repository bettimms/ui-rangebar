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
            addBtnVisible: true, removeBtnVisible: true, changeBtnVisible: true, reloadBtnVisible: false
        }
        vm.sampleModel = {name: "Interval X", startTime: "12:20", endTime: "16:15"}, {
            name: "Interval B",
            startTime: "19:35",
            endTime: "23:55"
        };
        vm.values = [
            [
                moment().startOf('day').format('LLLL'),
                moment().startOf('day').add(1, 'hours').format('LLLL')
            ],
            [
                moment().startOf('day').add(1.5, 'hours').format('LLLL'),
                moment().startOf('day').add(3.5, 'hours').format('LLLL')
            ],
            [
                moment().endOf('day').subtract(1.5, 'hours').format('LLLL'),
                moment().endOf('day').subtract(1, 'minute').format('LLLL')
            ],
        ];
        vm.options = {
            rangeClass: "red",
            min: moment().startOf('day').format('LLLL'),
            max: moment().startOf('day').add(1, 'day').format('LLLL'),
            valueFormat: function (ts) {
                return moment(ts).format('LLLL');
            },
            valueParse: function (date) {
                return moment(date).valueOf();
            },
            label: function (a) {
                return JSON.stringify(a)
            },
            snap: 1000 * 60 * 15,
            minSize: 1000 * 60 * 60,
            bgLabels: 4
        };

        vm.addRange = function () {
            if (!vm.values) vm.values = [];
            vm.sampleModel.name = baseName + counter;
            vm.values.push([
                moment().startOf('day').add(1.5, 'hours').format('LLLL'),
                moment().startOf('day').add(3.5, 'hours').format('LLLL')
            ]);
            counter++;
        }
        vm.removeRange = function () {
            vm.values.shift();
            // vm.values.splice(1,1);
        }
        vm.changeModel = function () {
            var newVal = angular.copy(vm.values[1]);
            if (newVal) {
                newVal[0] = moment().startOf('day').add(1.5, 'hours').format('LLLL');
                newVal[1] = moment().startOf('day').add(3.5, 'hours').format('LLLL');
            }
            vm.values[1] = newVal;
        }
    }
})(angular.module("app"));