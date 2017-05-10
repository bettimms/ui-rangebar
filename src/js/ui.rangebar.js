/**
 * Created by betim on 2/14/2017.
 */

(function (app) {
    function stringContains(string, value) {
        return string.indexOf(value) != -1;
    }

    app.provider("uiRangebarConfig", function () {
        this.setOptions = function (options) {
            this.options = options;
        }
        this.$get = function () {
            return this;
        }
    });

    app.directive("uiRangebar", ["$parse", "$timeout", uiRangebar]);
    function uiRangebar($parse, $timeout, uiRangebarConfig) {
        return {
            restrict: "EA",
            scope: {
                ngModel: "=?ngModel",
                uiInstance: "=?"//rangeBar instance
            },
            link: function (scope, element, attrs) {
                var modelNameArray = attrs["ngModel"].split(".");
                var modelName = modelNameArray[modelNameArray.length - 1];
                var changeTimeout = null,//prevent calling multiple times change event, bug by library itself
                    isChanging = false,//helps to not update ngModel from $watch since the update hapens from
                    // changing event
                    inProgress = false;//prevents calling $watch twice if it's already in progress

                //#region Utilities
                function attrParser(attrName) {
                    var fn, controllerScope = Object.prototype.toString.call($parse(attrName)(scope)),
                        controllerAsScope = Object.prototype.toString.call($parse(attrName)(scope.$parent));

                    if ((controllerScope === "[object Function]") || (controllerScope === "[object Object]")) {
                        fn = $parse(attrName)(scope);
                    } else if ((controllerAsScope === "[object Function]") || (controllerAsScope === "[object" +
                        " Object]")) {
                        fn = $parse(attrName)(scope.$parent);
                    }
                    return fn;
                }

                //#endregion
                //#region Event handler
                var eventHandler = {
                    isDragging: false,
                    startingPos: [],
                    attachEvents: function (elements) {
                        this.on("mouseenter", elements, this.mouseenterCallback);
                        this.on("mouseleave", elements, this.mouseleaveCallback);
                        this.on("mousedown", elements, this.mousedownCallback);
                        this.on("mouseup", elements, this.mouseupCallback);
                        this.on("mousemove", elements, this.mousemoveCallback);//Helps to fix the click event
                    },
                    fire: function (event) {
                        if (typeof event === "function") {
                            var args = Array.prototype.slice.call(arguments, 1);
                            event.apply(this, args);
                        }
                    },
                    on: function (events, elements, callback) {
                        var self = this;
                        if (Object.prototype.toString.call(elements) !== '[object Array]') elements = [elements];
                        if (Object.prototype.toString.call(events) !== '[object Array]') events = events.split();
                        // hasChanged = false;
                        events.forEach(function (evt) {
                            //Attach event only if it's defined by user
                            if (options[evt]) {
                                elements.forEach(function (el) {
                                    el.on(evt, function (ev) {
                                        if (callback) callback.call(self, ev, el);
                                    });

                                    el.update = function (newModel) {
                                        var values = [],
                                            rangeObj;
                                        var index = rangeBar.findGap(this.range);
                                        rangeObj = rangeBar.ranges[index];

                                        if (!rangeObj) return;
                                        var start, end;
                                        if (scope.bind) {
                                            if (newModel) {
                                                Object.keys(newModel).forEach(function (key, index) {
                                                    var val = newModel[key];
                                                    //Update only simple properties
                                                    //Causes infinit loop trying to set to itself the valuesKeyPath
                                                    // object
                                                    if (!Array.isArray(val)) rangeObj[key] = val;
                                                });
                                                start = rangeObj["$$startPropRaw"] = rangeObj[options.model.bind.startProp];
                                                end = rangeObj["$$endPropRaw"] = rangeObj[options.model.bind.endProp];
                                            }
                                            else {
                                                start = rangeObj["$$startPropRaw"] = rangeObj[scope.bind.startProp] || rangeObj.$model[scope.bind.startProp];
                                                end = rangeObj["$$endPropRaw"] = rangeObj[scope.bind.endProp] || rangeObj.$model[scope.bind.endProp];
                                            }
                                        }
                                        else {
                                            //Simple model [a,b]
                                            start = newModel ? newModel[0] : rangeObj.$model[0];
                                            end = newModel ? newModel[1] : rangeObj.$model[1];
                                        }
                                        var range = [rangeBar.abnormalise(start), rangeBar.abnormalise(end)]
                                        this.val(range);
                                        module.sortModelArray();
                                        isChanging = false;
                                    };
                                    el.delete = function () {
                                        /* Prevent name ambiguity with elessar (and problems), Needed to
                                         refresh model since no event is raised from elessar in case of remove */
                                        this.remove();
                                        var values = [];
                                        if (scope.valuesKeyPath) {
                                            values = module.valueForKeyPath(this.$data, scope.valuesKeyPath);
                                        } else {
                                            values = this.$data;
                                        }
                                        for (var i = 0; i < values.length; i++) {
                                            var currentRange = values[i];
                                            if (currentRange === this.$model) {
                                                values.splice(i, 1);
                                                module.setNgModel(this.$data);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    },
                    off: function (node, event) {
                        if (!node) return;
                        event ? node.off(event) : node.off();

                    },
                    clickCallback: function (ev, el) {
                        var index = rangeBar.findGap(el.range);
                        if (rangeBar.options.click) rangeBar.options.click(ev, el, index);
                    },
                    mousedownCallback: function (ev, el) {
                        this.isDragging = false;
                        this.startingPos = [ev.pageX, ev.pageY];

                        var index = rangeBar.findGap(el.range);
                        rangeBar.options.mousedown(ev, el, index);
                    },
                    mouseupCallback: function (ev, el) {
                        if (this.isDragging) {
                        } else {
                            this.clickCallback(ev, el);
                        }
                        this.isDragging = false;
                        this.startingPos = [];

                        var index = rangeBar.findGap(el.range);
                        rangeBar.options.mouseup(ev, el, index);
                    },
                    mouseenterCallback: function (ev, el) {
                        var index = rangeBar.findGap(el.range);
                        rangeBar.options.mouseenter(ev, el, index);
                    },
                    mouseleaveCallback: function (ev, el) {
                        var index = rangeBar.findGap(el.range);
                        rangeBar.options.mouseleave(ev, el, index);
                    },
                    mousemoveCallback: function (evt) {
                        if (!(evt.pageX === this.startingPos[0] && evt.pageY === this.startingPos[1])) {
                            this.isDragging = true;
                        }
                    }
                }
                //#endregion
                var module = {
                    setIntance: function (instance) {
                        scope.uiInstance = instance;
                    },
                    valueForKey: function (obj, key) {
                        return obj[key];
                    },
                    valueForKeyPath: function (obj, keyPath) {
                        if (keyPath == null) return;
                        if (stringContains(keyPath, '.') == false) {
                            return this.valueForKey(obj, keyPath);
                        }

                        var chain = keyPath.split('.');
                        var firstKey = chain.shift();
                        var shiftedKeyPath = chain.join('.');

                        return this.valueForKeyPath(obj[firstKey], shiftedKeyPath);
                    },
                    setValueForKey: function (obj, key, value) {
                        obj[key] = value;
                    },
                    setValueForKeyPath: function (obj, keyPath, value) {
                        if (keyPath == null) return;
                        if (stringContains(keyPath, '.') == false) {
                            this.setValueForKey(obj, keyPath, value);
                            return;
                        }
                        var chain = keyPath.split('.');
                        var firstKey = chain.shift();
                        var shiftedKeyPath = chain.join('.');

                        this.setValueForKeyPath(obj[firstKey], shiftedKeyPath, value);
                    },
                    updateStatus: function () {
                        var timer = $timeout(function () {
                            inProgress = false;//Prevents infinit loop by calling module.update
                            //when ngModel is reordered/updated $watch will be fired, then module.update which leads
                            // to infinit loop
                            $timeout.cancel(timer);
                        }, 0);
                    },
                    setNgModel: function (model) {
                        var self = this;
                        inProgress = true;
                        scope.$evalAsync(function () {
                            scope.ngModel = model;
                            self.updateStatus();
                        });
                    },
                    getRanges: function (normalized) {
                        var self = this;
                        return rangeBar.ranges.map(function (rangeObj) {
                            var range = rangeObj.range;
                            return normalized ? self.normalize(range) : range;
                        });
                    },
                    sortModelArray: function () {
                        var sortedRanges = this.getRanges(true);
                        var model = scope.bind ? this.modelFromRanges(sortedRanges) : sortedRanges;
                        this.setNgModel(model);
                    },
                    abnormalize: function (range) {
                        var a = rangeBar.abnormalise(range[0]),
                            b = rangeBar.abnormalise(range[1]);
                        return [a, b];
                    },
                    normalize: function (range) {
                        var a = rangeBar.normalise(range[0]),
                            b = rangeBar.normalise(range[1]);
                        return [a, b];
                    },
                    angularizeModel: function (model, normalRange) {
                        var formattedValues = options.model.formatter(normalRange);
                        angular.merge(model, formattedValues[0]);
                        model.$$startPropRaw = normalRange[0];
                        model.$$endPropRaw = normalRange[1];

                        if (scope.bind.totalSize) {
                            var abnRange = this.abnormalize(normalRange);
                            var total = abnRange[1] - abnRange[0];
                            var totalNormalized = rangeBar.normalise(total);
                            model[scope.bind.totalSize] = totalNormalized;
                        }
                        return model;
                    },
                    angularizeBar: function (bar, index, model) {
                        bar.$$index = index;
                        bar.$model = model || bar.$model || {};//makes easy to order/sort ngModel
                        bar.$data.$$modelName = modelName;
                    },
                    modelFromRange: function (range, model) {
                        return this.angularizeModel(model || {}, range);
                    },
                    modelFromRanges: function (ranges) {
                        var newModel = [];
                        for (var i = 0; i < ranges.length; i++) {
                            var range = ranges[i],
                                destinationModel = rangeBar.ranges[i].$model || {}//When new item, comes empty,
                            sourceModel = this.modelFromRange(range);
                            angular.merge(destinationModel, sourceModel);
                            newModel.push(destinationModel);
                        }
                        if (scope.valuesKeyPath) {
                            //Set ngModel for nested ranges to scope.currentModel and return as ngModel to the view
                            this.setValueForKeyPath(scope.currentModel, scope.valuesKeyPath, newModel);
                            return scope.currentModel;
                        }
                        return newModel;
                    },
                    clearRanges: function () {
                        for (var i = 0, n = rangeBar.ranges.length; i < n; i++) {
                            var range = rangeBar.ranges[i];
                            eventHandler.off(range);
                            rangeBar.removeRange(range);
                        }
                        // scope.ngModel = null;
                    },
                    getRawRange: function (range) {
                        //TODO Decide whether to depend on raw values or not
                        var start = range.$$startPropRaw || range[options.model.bind.startProp],
                            end = range.$$endPropRaw || range[options.model.bind.endProp];
                        return [start, end];
                    },
                    extractAndAddRanges: function (ranges) {
                        if(!ranges) return;
                        var extractedRanges = ranges;
                        if (scope.valuesKeyPath) {
                            extractedRanges = this.valueForKeyPath(ranges, scope.valuesKeyPath);
                            this.addRange(extractedRanges, ranges);
                        }
                        else this.addRange(ranges);
                        return extractedRanges;
                    },
                    setBarMetadata: function (barEl) {
                        var self = this;
                        if (!barEl) return;
                        rangeBar.ranges.forEach(function (bar, i) {
                            if (bar.$el == barEl) {//Finding index
                                self.angularizeBar(bar, i);
                            }
                        });
                    },
                    setBarData: function (bar, ranges) {
                        var newModel;
                        var sortedRanges = ranges || rangeBar.val();
                        if (scope.bind) {
                            newModel = [];
                            if (scope.valuesKeyPath && !scope.currentModel) {
                                scope.currentModel = {};
                                this.setValueForKeyPath(scope.currentModel, scope.valuesKeyPath, []);
                            }
                            newModel = this.modelFromRanges(sortedRanges);
                            if (bar && typeof bar === "object") bar.$data = newModel;
                        }
                        var ngModel = newModel || sortedRanges;
                        this.setNgModel(ngModel);
                    },
                    addRange: function (ranges, model) {
                        inProgress = true;
                        if(!ranges) return;
                        for (var i = 0; i < ranges.length; i++) {
                            var currentRange = ranges[i], range;
                            if (!currentRange) return;
                            if (scope.bind) range = this.getRawRange(currentRange);
                            else range = currentRange;//simple range [a,b]

                            var bar = rangeBar.addRange(module.abnormalize(range), model || currentRange);
                            var index = rangeBar.findGap(currentRange) - 1;
                            this.angularizeBar(bar, index, currentRange);

                            eventHandler.fire.call(rangeBar, options.modelChange, currentRange, bar, index);
                            eventHandler.attachEvents(bar);
                        }
                        this.sortModelArray();
                    },
                    updateRanges: function (newValues) {
                        this.clearRanges();
                        newValues && this.extractAndAddRanges(newValues);
                        this.updateStatus();
                    }
                }
                //#region Setup
                var uiOptions = attrParser(attrs.uiOptions) || uiRangebarConfig.options;
                var defaultOptions = {
                    syncOnChanging: false,// keep ngModel syncronized on changing event or not, default false for
                    // the sake of performance
                    model: {
                        bind: null,//object, properties to be bound
                        formatter: null//fn that returns array of start and end values as range
                    },
                    valueFormat: function (val) {
                        return val;
                    }, // formats a value on the bar for output
                    valueParse: function (val) {
                        return val;
                    },
                    label: function (values) {
                        return values;
                    },
                    mousedown: function () {
                    },//internal use
                    mousemove: function () {
                    },
                    mouseup: function () {
                    }
                };
                var options = angular.extend({}, defaultOptions, uiOptions);
                if (options.model.bind) {
                    scope.bind = options.model.bind;

                    if (options.model.bind.valuesKeyPath) {
                        scope.valuesKeyPath = options.model.bind.valuesKeyPath;
                    }
                }
                var rangeBar = new RangeBar(options);
                element.append(rangeBar.$el);
                module.setIntance(rangeBar);

                //Attach events for predefined bars
                eventHandler.attachEvents(rangeBar.ranges);

                //#region Rangebar events
                rangeBar.$el.on("changing", function (ev, ranges, bar) {
                    isChanging = true;
                    if (options.syncOnChanging) module.setBarData(bar);
                    eventHandler.fire.call(this, options.changing, ev, ranges, bar);
                }).on("change", function (ev, ranges, changed) {
                    //Fix for multiple calls
                    //https://github.com/quarterto/Elessar/issues/99
                    $timeout.cancel(changeTimeout);
                    changeTimeout = $timeout(function () {
                        changeFn();
                        isChanging = false;
                    }, 0);
                    function changeFn() {
                        module.setBarData(changed);
                        module.setBarMetadata(changed);
                        eventHandler.fire.call(this, options.change, ev, ranges, changed);
                    }
                }).on("addrange", function (ev, range, bar) {
                    inProgress = true;
                    var index = rangeBar.findGap(range);
                    module.setBarData(bar);
                    module.angularizeBar(bar, index);
                    eventHandler.fire.call(this, options.addrange, range, bar, index, true);
                    eventHandler.attachEvents(bar);
                });
                //#endregion

                scope.$watch("ngModel", function (newValues, oldValues) {
                    if (inProgress) return;
                    if (!isChanging) {
                        scope.currentModel = newValues;
                        module.updateRanges(newValues);
                    }
                }, true);
                //#endregion
            }
        }
    }
})(angular.module("ui.rangebar", []));