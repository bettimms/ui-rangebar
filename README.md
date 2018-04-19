ui-rangebar
=======
##### AngularJS directive for [Elessar.js](https://github.com/quarterto-archive/Elessar)

Draggable multiple range sliders
![elessar draggable range demo](https://github.com/quarterto-archive/Elessar/blob/master/demo.gif?raw=true)

Installation
------------
Install ui-rangebar via **npm** or **bower**:

`npm install ui-rangebar` | `bower install ui-rangebar`
----------------------|------------------------

```html
<script src="path/to/elessar.css"></script>

<script src="path/to/elessar.js"></script>
<script src="path/to/angular.js"></script>
<script src="path/to/ui.rangebar.js"></script>
```

Simple Usage
-----

1. Reference ui-rangebar to angularjs:
```javascript
angular.module("app", ["ui.rangebar"]);
```
2. Add in your html page
```html
<ui-rangebar ng-model="bar.ranges"></ui-rangebar>
```

##### Usage with options

```html
<ui-rangebar ng-model="bar.ranges" ui-options="options"></ui-rangebar>
```
-------

In addition to [Elessar options](https://github.com/quarterto-archive/Elessar/wiki/Options)

```
syncOnChanging:false, //Sync ngModel on 'changing' event
model: {
   bind: {
      startProp: "", //Name of property to be bound for start of range
      endProp: "", //Name of property to be bound for end of range
      totalSize: "" //Name of property for total size of the range
      valuesKeyPath: "", //Path to values array ex. person.intervals. Useful for nested objects
   },
   formatter: fn //a function that returns start and end range as array in a format that will be bound to ngModel
},
addrange: function (range, bar, index){},//Event raised when new range is added
changing: function (ev, range, bar) {},
change: function (ev, ranges, changed) {},
click: function (ev, bar, index) {},
mouseenter: function (ev, bar, index) {},
mouseleave: function (ev, bar, index) {},
mousedown: function (ev, bar, index) {},
mouseup: function (ev, bar, index) {},
```

##### Update selected range explicitly
**Note:**

<sub>Following cases apply only in case **ngModel** is **updated/removed** explicitly. Otherwise it's sufficient to add
 or 
remove item from ngModel array and changes will be reflected. See [demos](demos)!</sub>
 
<sub>In case **ngModel** is changed by an external source such as popover/popup, you might need to force update for 
the selected bar.
</sub>
```js
bar.update(); //bar - selected range obj, can be fetched from any event, typically from click event

// @newModel: optional parameter.
bar.update(newModel); //Recommended
```

##### Remove selected range explicitly

```js
bar.delete();
```

Advance Example
-----
Example with nested values. Set, add and remove from ngModel.

<sub>Following example could be done much easier using momentjs. This is just for demostration purpose.</sub>

Controller.js

```js
(function (app) {

    app.controller("HomeController", [HomeController])
    function HomeController() {
        var vm = this;
        var counter = 0;
        var baseName = "X_";
        var sampleModel = {name: "Interval X", startTime: "04:10:00", endTime: "06:10:00"};
        var values = {
            name: "Main object",
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
        vm.values = values; //Set ngModel

        vm.reloadModel = function () {
            vm.values = values;
        }

        vm.options = {
            syncOnChanging:true,
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
        function formatter(a) {
            var array = [];
            array.push({
                startTime: a[0],
                endTime: a[1]
            });
            return array;
        }
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

        vm.addRange = function () {
            if (!vm.values) vm.values = [];
            var modelCopy = angular.copy(sampleModel);
            modelCopy.name = baseName + counter;
            vm.values.intervals.push(modelCopy); //Add to ngModel
            counter++;
        }
        vm.removeRange = function () {
            vm.values.intervals.shift(); //Remove from ngModel
        }
    }
})(angular.module("app", ["ui.rangebar"]));
```
index.html
```html

<!doctype html>

<html lang="en">
<head ng-app="app">
  <title>ui-rangebar</title>
  <meta name="author" content="SitePoint">
  <link rel="stylesheet" href="path/to/elessar.css">
</head>
<body ng-controller="HomeController as homeCtrl">

  <ui-rangebar ng-model="homeCtrl.values" ui-options="homeCtrl.options"/>

  <script src="path/to/jquery.js"></script>
  <script src="path/to/elessar.js"></script>
  <script src="path/to/angular.js"></script>
  <script src="path/to/ui.rangebar.js"></script>
</body>
</html>
```


- ##### uiRangebarConfigProvider:
Configure default options for the whole application

<sub>**Note**: Configuration from attributes or controller will have priority against config provider.
</sub>
```js
angular.module("app", ["ui.rangebar"])
    .config(function (uiRangebarConfigProvider) {
        var defaults = {
            syncOnChanging:true,
            min: 0,
            max: 100,
            rangeClass: "someClass"
        };
        uiRangebarConfigProvider.setOptions(defaults);
});
```

- ##### uiInstance:
Instance of rangebar object. Avoid using it for add/remove operations since it might not syncronize with **ngModel**.
Use it for **readonly** purpose!

```js
$scope.rangeBarInstance = {};
```
```html
<ui-rangebar ng-model="values" ui-options="options" ui-instance="rangeBarInstance"></ui-rangebar>
```

[GitHub](https://github.com/bettimms).


Licence
-------
[MIT](LICENSE.md)
