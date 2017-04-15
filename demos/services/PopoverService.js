/**
 * Created by betim on 4/13/2017.
 */

(function (app) {
    app.service("PopoverService", [PopoverService]);
    function PopoverService() {
        var service = {};
        var tpl = "";
        var previousEl = {};

        function hasPartialClass(el, partial) {
            return new RegExp(partial).test(el.prop("class"));
        };
        var defaultOptions = {
            trigger: "manual",
            placement: "bottom",
            html: true,
            animation: false,
            //title: function () {
            //    return "Details";
            //},
            content: function () {
                return tpl;
            }
        }
        service.togglePopover = function (el, template, options) {
            tpl = template;
            var opts = options ? angular.extend({}, defaultOptions, options) : defaultOptions;
            //$(".popover").popover("destroy");
            this.hidePopover();
            if (previousEl !== el) {
                previousEl = el;
                $(previousEl).popover("hide");
            }
            if (!$(el).attr("aria-describedby") || $(el).attr("aria-describedby").length === 0) $(el).popover(opts);
            $(el).popover("toggle");
        }
        service.hidePopover = function () {
            $(".popover").popover("hide");
        }
        $(document)
            .on("click",
                function (e) {
                    angular.element(".popover")
                        .each(function () {
                            //the 'is' for buttons that trigger popups
                            //the 'has' for icons within a button that triggers a popup
                            if (!angular.element(this).is(e.target) &&
                                angular.element(this).has(e.target).length === 0 &&
                                angular.element(".popover").has(e.target).length === 0 && !hasPartialClass($(e.target), "elessar")) {
                                service.hidePopover();
                            }
                        });
                });
        return service;
    }
})(angular.module("app"));