//# sourceMappingURL=App.js.map
Marionette.Renderer.render=function(c,a){if("function"===typeof c)return c(a);var b=Handlebars.templates[c];return b?b(a):""};
(function(c){window.App=new Backbone.Marionette.Application({onStart:function(a){this.addRegions({pluginsRegion:".plugins-body",treeRegion:".tree-wrapper",detailRegion:".detail-wrapper"});this.dslLoader=new App.DslLoader;this.settings=new App.Settings;this.router=new App.Router;this.router.on("route:home",this.showHome,this);this.router.on("route:path",this.showPath,this);this.router.on("route:method",this.showPath,this);this.router.on("route:plugin",this.showPlugin,this);this.initLayout();c(".loading-outer").addClass("loading");
this.loadSelectedDsl().then(function(){Backbone.history.start({pushState:!1});this.dsl.isEmbedded()||c(".version-select").show()}.bind(this));c(".version-select").change(function(){this.loadSelectedDsl().then(function(){Backbone.history.loadUrl(Backbone.history.getHash())})}.bind(this));c(".toggle-plugins").click(function(a){c(".plugins-wrapper").is(":visible")?this.layout.hide("east"):this.layout.show("east")}.bind(this));c(".search-input").keyup(this.onSearch.bind(this));c(".clear-search").click(function(a){a.preventDefault();
c(".search-input").val("");this.onSearch()}.bind(this))},showPlugin:function(a){a=_.findWhere(this.plugins,{name:a});var b=this.dsl.findPluginUsages(a);a=new App.PluginDetailView({plugin:a,usages:b});this.detailRegion.show(a)},loadSelectedDsl:function(){var a=c(".version-select").val();return this.dslLoader.fetch(a).then(this.onDslFetchComplete.bind(this))},onDslFetchComplete:function(a){this.dsl=a;this.plugins=this.dsl.getPluginList();this.initTree();this.initPluginList();var b=[];_.forEach(this.dsl.getAllContexts(),
function(a,c){a.methods.forEach(function(f){b.push({name:f.name,clazz:c,method:f,simpleClassName:a.simpleClassName})})});this.allItems=b=_.sortBy(b,function(a){return a.name.toLowerCase()})},initPluginList:function(){var a=this.plugins,b=new App.PluginsView({settings:this.settings,pluginList:a});this.pluginsRegion.show(b);c(".plugins-header .checkbox-wrapper").click(function(b){b.stopPropagation();var e=c(b.currentTarget).find("input");c(b.target).is("input")||e.prop("checked",!e.prop("checked"));
e.prop("checked")?this.settings.includeAllPlugins():this.settings.excludeAllPlugins(_.pluck(a,"name"))}.bind(this))},onSearch:function(){var a=c(".search-input").val();c(".clear-search").toggleClass("hide",!a);var b=c(".tree-body"),d=c(".search-results");a?(b.is(":visible")&&(b.hide(),d.show()),b=this.allItems.filter(function(b){return-1!==b.name.toLowerCase().indexOf(a.toLowerCase())&&(!b.method.plugin||!this.settings.isPluginExcluded(b.method.plugin.name))},this),b=Handlebars.templates.searchResults({results:b}),
d.html(b)):(b.show(),d.hide())},initLayout:function(){this.layout=c(".layout-container").layout({north__paneSelector:".title",north__spacing_open:0,west__paneSelector:".tree",west__contentSelector:".tree-wrapper",west__size:360,west__minSize:360,west__spacing_open:3,west__resizerCursor:"ew-resize",east__paneSelector:".plugins-wrapper",east__contentSelector:".plugins-body",east__initClosed:!0,east__size:300,east__spacing_open:3,east__resizerCursor:"ew-resize",center__paneSelector:".detail-wrapper",
north__size:50,resizable:!0,closable:!1,enableCursorHotkey:!1})},initTree:function(){var a=new App.TreeView({settings:this.settings,dsl:this.dsl});this.treeRegion.show(a)},showPath:function(a){a=new App.DetailView({dsl:this.dsl,settings:this.settings,path:a});a.on("show render",function(){this.highlightCode(c(".highlight"));c(".detail-wrapper").find(".expand-closure").click(this.onExpandClick.bind(this))}.bind(this));this.detailRegion.show(a)},showHome:function(){var a=new App.HomeView({settings:this.settings,
dsl:this.dsl,plugins:this.plugins});a.on("show render",function(){this.highlightCode(c(".highlight"));c(".detail-wrapper").find(".expand-closure").click(this.onExpandClick.bind(this))}.bind(this));this.detailRegion.show(a)},onExpandClick:function(a){a.preventDefault();a=c(a.currentTarget);var b=a.data("path"),d=a.data("index");a.hide();d=this.dsl.getPathInfo(b).methodNode.signatures[d];b=this.dsl.getContextSignatures(d.contextClass,b);b=_.filter(b,function(a){return!a.methodPlugin||!this.settings.isPluginExcluded(a.methodPlugin.name)},
this);b=(new App.ContextView({signatures:b})).render().$el;b.insertAfter(a);this.highlightCode(b.find(".highlight"));b.find(".expand-closure").click(this.onExpandClick.bind(this))},highlightCode:function(a){a.each(function(a,d){hljs.highlightBlock(d);c(d).removeClass("ruby")})}});c(function(){App.start()})})(jQuery);// Use Handlebars to render marionette views.
Marionette.Renderer.render = function(template, data) {
    if (typeof template === 'function'){
        return template(data);
    }
    var fcn = Handlebars.templates[template];
    return fcn ? fcn(data) : '';
};

(function($) {

    window.App = new Backbone.Marionette.Application({

        onStart: function(options) {

            this.addRegions({
                pluginsRegion:  '.plugins-body',
                treeRegion:     '.tree-wrapper',
                detailRegion:   '.detail-wrapper'
            });

            this.dslLoader = new App.DslLoader();
            this.settings = new App.Settings();

            this.router = new App.Router();
            this.router.on('route:home',    this.showHome, this);
            this.router.on('route:path',    this.showPath, this);
            this.router.on('route:method',  this.showPath, this);
            this.router.on('route:plugin',  this.showPlugin, this);

            this.initLayout();
            $('.loading-outer').addClass('loading');
            this.loadSelectedDsl().then(function() {
                Backbone.history.start({pushState: false});
                if (!this.dsl.isEmbedded()) {
                    $('.version-select').show()
                }
            }.bind(this));

            $('.version-select').change(function() {
                this.loadSelectedDsl().then(function() {
                    Backbone.history.loadUrl(Backbone.history.getHash());
                });
            }.bind(this));
            $('.toggle-plugins').click(function(e) {
                if ($('.plugins-wrapper').is(':visible')) {
                    this.layout.hide('east');
                } else {
                    this.layout.show('east');
                }
            }.bind(this));

            $('.search-input').keyup(this.onSearch.bind(this));
            $('.clear-search').click(function(event) {
                event.preventDefault();
                $('.search-input').val('');
                this.onSearch();
            }.bind(this));
        },

        showPlugin: function(name) {
            var plugin = _.findWhere(this.plugins, {name: name});
            var usages = this.dsl.findPluginUsages(plugin);

            var pluginDetailView = new App.PluginDetailView({
                plugin: plugin,
                usages: usages
            });
            this.detailRegion.show(pluginDetailView);
        },

        loadSelectedDsl: function() {
            var url = $('.version-select').val();
            return this.dslLoader.fetch(url).then(this.onDslFetchComplete.bind(this));
        },

        onDslFetchComplete: function(dsl) {
            this.dsl = dsl;
            this.plugins = this.dsl.getPluginList();

            this.initTree();
            this.initPluginList();

            var allItems = [];
            _.forEach(this.dsl.getAllContexts(), function(context, clazz) {
                context.methods.forEach(function(method) {
                    allItems.push({
                        name: method.name,
                        clazz: clazz,
                        method: method,
                        simpleClassName: context.simpleClassName
                    });
                });
            });
            allItems = _.sortBy(allItems, function(item) { return item.name.toLowerCase(); });
            this.allItems = allItems;
        },

        initPluginList: function() {
            var pluginList = this.plugins;
            var pluginsView = new App.PluginsView({
                settings: this.settings,
                pluginList: pluginList
            });
            this.pluginsRegion.show(pluginsView);

            $('.plugins-header .checkbox-wrapper').click(function(e) { // TODO move to view
                e.stopPropagation();
                var $checkbox = $(e.currentTarget).find('input');
                if (!$(e.target).is('input')) {
                    $checkbox.prop('checked', !$checkbox.prop('checked'));
                }
                if ($checkbox.prop('checked')) {
                    this.settings.includeAllPlugins();
                } else {
                    this.settings.excludeAllPlugins(_.pluck(pluginList, 'name'));
                }
            }.bind(this));
        },

        onSearch: function() { // TODO move to view
            var val = $('.search-input').val();
            $('.clear-search').toggleClass('hide', !val);
            var $treeBody = $('.tree-body');
            var $searchResults = $('.search-results');
            if (val) {
                if ($treeBody.is(':visible')) {
                    $treeBody.hide();
                    $searchResults.show();
                }

                var matches = this.allItems.filter(function(item) {
                    return item.name.toLowerCase().indexOf(val.toLowerCase()) !== -1 &&
                        (!item.method.plugin || !this.settings.isPluginExcluded(item.method.plugin.name));
                }, this);
                var html = Handlebars.templates['searchResults']({results: matches});
                $searchResults.html(html);
                // update result list
            } else {
                $treeBody.show();
                $searchResults.hide();
            }
        },

        initLayout: function() {
            this.layout = $('.layout-container').layout({
                north__paneSelector: '.title',
                north__spacing_open: 0,
                west__paneSelector: '.tree',
                west__contentSelector: '.tree-wrapper',
                west__size: 360,
                west__minSize: 360,
                west__spacing_open: 3,
                west__resizerCursor: 'ew-resize',
                east__paneSelector: '.plugins-wrapper',
                east__contentSelector: '.plugins-body',
                east__initClosed: true,
                east__size: 300,
                east__spacing_open: 3,
                east__resizerCursor: 'ew-resize',
                center__paneSelector: '.detail-wrapper',
                north__size: 50,
                resizable: true,
                closable: false,
                enableCursorHotkey: false
            });
        },

        initTree: function() {
            var treeView = new App.TreeView({
                settings: this.settings,
                dsl: this.dsl
            });
            this.treeRegion.show(treeView);
        },

        showPath: function(path) {
            var detailView = new App.DetailView({
                dsl: this.dsl,
                settings: this.settings,
                path: path
            });

            detailView.on('show render', function() {  // TODO move to view
                this.highlightCode($('.highlight'));
                $('.detail-wrapper').find('.expand-closure').click(this.onExpandClick.bind(this));
            }.bind(this));

            this.detailRegion.show(detailView);
        },

        showHome: function() {
            var homeView = new App.HomeView({
                settings: this.settings,
                dsl: this.dsl,
                plugins: this.plugins
            });

            homeView.on('show render', function() {  // TODO move to view
                this.highlightCode($('.highlight'));
                $('.detail-wrapper').find('.expand-closure').click(this.onExpandClick.bind(this));
            }.bind(this));

            this.detailRegion.show(homeView);
        },

        onExpandClick: function(e) {  // TODO move to view
            e.preventDefault();
            var $el = $(e.currentTarget);
            var path = $el.data('path');
            var index = $el.data('index');

            $el.hide();

            var pathInfo = this.dsl.getPathInfo(path);
            var parentSignature = pathInfo.methodNode.signatures[index];
            var signatures = this.dsl.getContextSignatures(parentSignature.contextClass, path);

            signatures = _.filter(signatures, function(sig) {
                return !sig.methodPlugin || !this.settings.isPluginExcluded(sig.methodPlugin.name);
            }, this);

            var contextView = new App.ContextView({signatures: signatures});
            var $contextHtml = contextView.render().$el;
            $contextHtml.insertAfter($el);

            this.highlightCode($contextHtml.find('.highlight'));

            $contextHtml.find('.expand-closure').click(this.onExpandClick.bind(this));
        },

        highlightCode: function($elements) {  // TODO move to view
            $elements.each(function(i, block) {
                hljs.highlightBlock(block);
                $(block).removeClass('ruby'); // TODO hljs bug?
            });
        }
    });

    $(function() { App.start(); });
}(jQuery));

//# sourceMappingURL=Dsl.js.map
App.Dsl=function(c){this.data=c;_.forEach(c.contexts,this._processContext.bind(this))};
_.extend(App.Dsl.prototype,{_processContext:function(c){var d=c.type.split(".");c.simpleClassName=d[d.length-1];c.methods.forEach(function(b){b.signatures.every(function(a){return a.deprecated})&&(b.deprecated=!0);var a=_.find(b.signatures,function(a){return a.contextClass&&!a.deprecated});a||(a=_.find(b.signatures,function(a){return a.contextClass}));a&&(b.contextClass=a.contextClass);if(a=_.find(b.signatures,function(a){return a.plugin}))b.plugin=window.updateCenter.data.plugins[a.plugin.id]})},
isEmbedded:function(){return this.data.embedded},getContext:function(c){return this.data.contexts[c]},getRootContextClass:function(){return this.data.root.contextClass},getPluginList:function(){return _.chain(this.data.contexts).pluck("methods").flatten().pluck("plugin").filter().unique().sortBy(function(c){return c.title.toLowerCase()}).value()},findUsages:function(c){var d=[];_.forEach(this.data.contexts,function(b,a){b.methods.forEach(function(a){a.contextClass===c&&d.push({method:a,context:b,
simpleClassName:b.simpleClassName})})});return d},findPluginUsages:function(c){var d=[];_.forEach(this.data.contexts,function(b){b.methods.forEach(function(a){a.plugin===c&&d.push({method:a,context:b})})});return d},findMethodNode:function(c,d){for(var b=null,a=this.data.contexts[c],f=0;f<d.length;f++)if(b=_.findWhere(a.methods,{name:d[f]}),f<d.length-1)var a=this.getContext(b.contextClass),e=d[f+1],a=_.find(b.signatures,function(a){var b=!1;if(a=a.contextClass)b=this.getContext(a),b=!!_.findWhere(b.methods,
{name:e});return b},this),a=this.getContext(a.contextClass);return b},findAncestors:function(c,d){var b=[];d.forEach(function(a,c){if(c<d.length-1){var e=d.slice(0,c+1).join("-");b.push({id:e,text:a})}},this);return b},getContextSignatures:function(c,d){var b=[];this.data.contexts[c].methods.forEach(function(a){Array.prototype.push.apply(b,this.getSignatures(a,(d?d+"-":"")+a.name))},this);return b},getSignatures:function(c,d){var b="#path/"+(d?d+"-":"")+c.name;return c.signatures.map(function(a,f){a.contextClass&&
(a.context=this.data.contexts[a.contextClass]);var e=a.parameters;a.context&&(e=e.slice(0,e.length-1));var e=e.map(function(a){var b=a.type+" "+a.name;a.defaultValue&&(b+=" = "+a.defaultValue);return b}),g=e.join(", ");if(e.length||!a.context)g="("+g+")";e={name:c.name,href:b,path:d,index:f,availableSince:a.availableSince,deprecated:a.deprecated,generated:a.generated,extension:a.extension,required:a.required,text:g,html:a.html,context:a.context,comment:a.firstSentenceCommentText};g=_.chain(a.parameters).filter(function(a){return a.enumConstants}).map(function(a){var b=
a.type.split("."),c=b[b.length-1];return{paramName:a.name,values:a.enumConstants.map(function(a){return c+"."+a})}}).value();g.length&&(e.enums=g);e.methodPlugin=c.plugin;a.plugin&&(e.plugin=a.plugin,(g=window.updateCenter.data.plugins[a.plugin.id])?e.plugin.title=g.title:console.log("plugin not found",a.plugin.id));return e},this)},getPathInfo:function(c){var d,b=[],a=[];if(c){d=c.split("-");var f=d[0].lastIndexOf(".");-1===f?(c=this.data.root.contextClass,b=d):(a=d[0].substr(f+1),c=d[0].substr(0,
f),b=[a].concat(d.slice(1)),a=this.findUsages(c));d=this.findMethodNode(c,b);b=this.findAncestors(c,b);b.length&&-1!==f&&(b[0].id=c+"."+b[0].id)}else d=this.data.root;return{methodNode:d,ancestors:b,usages:a}},getAllContexts:function(){return this.data.contexts}});/**
 * Provides access to DSL data.
 */
App.Dsl = function(data) {
    this.data = data;
    _.forEach(data.contexts, this._processContext.bind(this));
};
_.extend(App.Dsl.prototype, {

    _processContext: function(context) {
        var tokens = context.type.split('.');
        context.simpleClassName = tokens[tokens.length - 1];

        context.methods.forEach(function(method) {
            if (method.signatures.every(function(sig) { return sig.deprecated; })) {
                method.deprecated = true;
            }

            var signatureWithContext = _.find(method.signatures, function(signature) { return signature.contextClass && !signature.deprecated; });
            if (!signatureWithContext) {
                signatureWithContext = _.find(method.signatures, function(signature) { return signature.contextClass; });
            }

            if (signatureWithContext) {
                method.contextClass = signatureWithContext.contextClass;
            }

            var signatureWithPlugin = _.find(method.signatures, function(signature) { return signature.plugin; });
            if (signatureWithPlugin) {
                method.plugin = window.updateCenter.data.plugins[signatureWithPlugin.plugin.id];
            }
        });
    },

    isEmbedded: function() {
        return this.data.embedded;
    },

    getContext: function(contextClass) {
        return this.data.contexts[contextClass];
    },

    getRootContextClass: function() {
        return this.data.root.contextClass;
    },

    getPluginList: function() {
        return _.chain(this.data.contexts)
            .pluck('methods')
            .flatten()
            .pluck('plugin')
            .filter()
            .unique()
            .sortBy(function (item) {
                return item.title.toLowerCase();
            })
            .value();
    },

    findUsages: function(contextClass) {
        var usages = [];
        _.forEach(this.data.contexts, function(context, clazz) {
            context.methods.forEach(function(method) {
                if (method.contextClass === contextClass) {
                    usages.push({
                        method: method,
                        context: context,
                        simpleClassName: context.simpleClassName
                    });
                }
            });
        });
        return usages;
    },

    findPluginUsages: function(plugin) {
        var usages = [];
        _.forEach(this.data.contexts, function(context) {
            context.methods.forEach(function(method) {
                if (method.plugin === plugin) {
                    usages.push({method: method, context: context});
                }
            });
        });
        return usages;
    },

    findMethodNode: function(contextClass, tokens) {
        var methodNode = null;
        var contextNode = this.data.contexts[contextClass];

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            methodNode = _.findWhere(contextNode.methods, {name: token});

            if (i < tokens.length - 1) {
                contextNode = this.getContext(methodNode.contextClass);
                // TODO this is a hack to make sure we get the right context (for copyArtifacts). it only checks one level though.
                // should be a depth-first search or something
                var nextToken = tokens[i + 1];
                var matchingSig = _.find(methodNode.signatures, function(signature) {
                    var match = false;
                    var sigContextClass = signature.contextClass;
                    if (sigContextClass) {
                        var sigContext = this.getContext(sigContextClass);
                        match = !!_.findWhere(sigContext.methods, {name: nextToken});
                    }
                    return match;
                }, this);
                contextNode = this.getContext(matchingSig.contextClass);
            }
        }

        return methodNode;
    },

    findAncestors: function(contextClass, tokens) {
        var ancestors = [];

        tokens.forEach(function(token, index) {
            if (index < tokens.length - 1) {
                var id = tokens.slice(0, index + 1).join('-');
                ancestors.push({
                    id: id,
                    text: token
                });
            }
        }, this);

        return ancestors;
    },

    getContextSignatures: function(contextClass, path) {
        var signatures = [];

        this.data.contexts[contextClass].methods.forEach(function(method) {
            var methodPath = (path ? path + '-' : '') + method.name;
            Array.prototype.push.apply(signatures, this.getSignatures(method, methodPath));
        }, this);

        return signatures;
    },

    getSignatures: function(method, path) {
        var href = '#path/' + (path ? path + '-' : '') + method.name;
        return method.signatures.map(function(signature, index) {

            if (signature.contextClass) {
                signature.context = this.data.contexts[signature.contextClass];
            }

            var params = signature.parameters;
            if (signature.context) {
                params = params.slice(0, params.length - 1);
            }
            var paramTokens = params.map(function(param) {
                var token = param.type + ' ' + param.name;
                if (param.defaultValue) {
                    token += ' = ' + param.defaultValue;
                }
                return token;
            });
            var text = paramTokens.join(', ');
            if (paramTokens.length || !signature.context) {
                text = '(' + text + ')';
            }

            var data = {
                name: method.name,
                href: href,
                path: path,
                index: index,
                availableSince: signature.availableSince,
                deprecated: signature.deprecated,
                generated: signature.generated,
                extension: signature.extension,
                required: signature.required,
                text: text,
                html: signature.html,
                context: signature.context,
                comment: signature.firstSentenceCommentText
            };

            var enums = _.chain(signature.parameters)
                .filter(function(parameter) { return parameter.enumConstants; })
                .map(function(parameter) {
                    var typeTokens = parameter.type.split('.');
                    var simpleName = typeTokens[typeTokens.length - 1];
                    return {
                        paramName: parameter.name,
                        values: parameter.enumConstants.map(function(v) { return simpleName + '.' + v; })
                    };
                })
                .value();

            if (enums.length) {
                data.enums = enums;
            }

            data.methodPlugin = method.plugin;
            if (signature.plugin) {
                data.plugin = signature.plugin;
                var pluginData = window.updateCenter.data.plugins[signature.plugin.id];
                if (pluginData) {
                    data.plugin.title = pluginData.title;
                } else {
                    console.log('plugin not found', signature.plugin.id);
                }
            }

            return data;
        }, this)
    },

    getPathInfo: function(path) {
        var methodNode;
        var ancestors = [];
        var usages = [];
        if (path) {
            var tokens = path.split('-');

            var contextClass;
            var pathTokens;
            var methodIndex = tokens[0].lastIndexOf('.');
            if (methodIndex === -1) { // absolute
                contextClass = this.data.root.contextClass;
                pathTokens = tokens;
            } else { // relative
                var methodName = tokens[0].substr(methodIndex + 1);

                contextClass = tokens[0].substr(0, methodIndex);
                pathTokens = [methodName].concat(tokens.slice(1));
                usages = this.findUsages(contextClass);
            }

            methodNode = this.findMethodNode(contextClass, pathTokens);
            ancestors = this.findAncestors(contextClass, pathTokens);

            if (ancestors.length && methodIndex !== -1) {
                ancestors[0].id = contextClass + '.' + ancestors[0].id;
            }
        } else {
            methodNode = this.data.root;
        }

        return {
            methodNode: methodNode,
            ancestors: ancestors,
            usages: usages
        };
    },

    getAllContexts: function() {
        return this.data.contexts;
    }
});

//# sourceMappingURL=DslLoader.js.map
App.DslLoader=function(){this.dslsByUrl={}};_.extend(App.DslLoader.prototype,{fetch:function(a){var c=this.dslsByUrl[a];return c?$.Deferred().resolveWith(null,[c]):$.get(a).then(function(b){b=new App.Dsl(b);return this.dslsByUrl[a]=b}.bind(this))}});/**
 * Loads and caches DSL data.
 */
App.DslLoader = function() {
    this.dslsByUrl = {};
};
_.extend(App.DslLoader.prototype, {

    fetch: function(url) {
        var dsl = this.dslsByUrl[url];
        if (!dsl) {
            return $.get(url).then(function(data) {
                var dsl = new App.Dsl(data);
                this.dslsByUrl[url] = dsl;
                return dsl;
            }.bind(this));
        }
        return $.Deferred().resolveWith(null, [dsl]);
    }
});

//# sourceMappingURL=Router.js.map
App.Router=Backbone.Router.extend({routes:{"path/:path":"path","method/:path":"path","plugin/:name":"plugin","*path":"home"}});App.Router = Backbone.Router.extend({

    routes: {
        'path/:path':   'path',
        'method/:path': 'path',
        'plugin/:name': 'plugin',
        '*path':        'home'
    }
});

//# sourceMappingURL=Settings.js.map
App.Settings=Marionette.Object.extend({initialize:function(){this.excludedPlugins=(JSON.parse(localStorage.getItem("job-dsl-api-viewer"))||{}).excludedPlugins||[]},save:function(){localStorage.setItem("job-dsl-api-viewer",JSON.stringify({excludedPlugins:this.excludedPlugins}));this.trigger("change")},isPluginExcluded:function(a){return _.contains(this.excludedPlugins,a)},setPluginExcluded:function(a,b){b&&!this.isPluginExcluded(a)&&this.excludedPlugins.push(a);!b&&this.isPluginExcluded(a)&&(this.excludedPlugins=
_.without(this.excludedPlugins,a));this.save()},includeAllPlugins:function(){this.excludedPlugins=[];this.save()},excludeAllPlugins:function(a){this.excludedPlugins=a;this.save()}});App.Settings = Marionette.Object.extend({

    initialize: function() {
        var parsed = JSON.parse(localStorage.getItem('job-dsl-api-viewer')) || {};
        this.excludedPlugins = parsed.excludedPlugins || [];
    },

    save: function() {
        localStorage.setItem('job-dsl-api-viewer', JSON.stringify({
            excludedPlugins: this.excludedPlugins
        }));
        this.trigger('change');
    },

    isPluginExcluded: function(name) {
        return _.contains(this.excludedPlugins, name);
    },

    setPluginExcluded: function(name, isExcluded) {
        if (isExcluded && !this.isPluginExcluded(name)) {
            this.excludedPlugins.push(name);
        }
        if (!isExcluded && this.isPluginExcluded(name)) {
            this.excludedPlugins = _.without(this.excludedPlugins, name);
        }
        this.save();
    },

    includeAllPlugins: function() {
        this.excludedPlugins = [];
        this.save();
    },

    excludeAllPlugins: function(names) {
        this.excludedPlugins = names;
        this.save();
    }
});

//# sourceMappingURL=context.js.map
(function(){var h=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).context=h({compiler:[7,">= 4.0.0"],main:function(e,a,d,g,f){var c;return'<ul class="inline-context-methods">\r\n'+(null!=(c=d.each.call(a,null!=a?a.signatures:a,{name:"each",hash:{},fn:e.program(1,f,0),inverse:e.noop,data:f}))?c:"")+"</ul>"},1:function(e,a,d,g,f){var c,b;return"        <li>\r\n"+(null!=(c=d["if"].call(a,null!=a?a.comment:a,{name:"if",hash:{},fn:e.program(2,f,0),inverse:e.noop,data:f}))?c:"")+'            <a href="#path/'+
e.escapeExpression((b=null!=(b=d.path||(null!=a?a.path:a))?b:d.helperMissing,"function"===typeof b?b.call(a,{name:"path",hash:{},data:f}):b))+'">'+e.escapeExpression((b=null!=(b=d.name||(null!=a?a.name:a))?b:d.helperMissing,"function"===typeof b?b.call(a,{name:"name",hash:{},data:f}):b))+'</a><span class="highlight groovy inline">'+e.escapeExpression((b=null!=(b=d.text||(null!=a?a.text:a))?b:d.helperMissing,"function"===typeof b?b.call(a,{name:"text",hash:{},data:f}):b))+"</span>\r\n            "+
(null!=(c=d["if"].call(a,null!=a?a.context:a,{name:"if",hash:{},fn:e.program(5,f,0),inverse:e.noop,data:f}))?c:"")+"\r\n        </li>\r\n"},2:function(e,a,d,g,f){var c,b;return'                <div class="firstSentenceCommentText">\r\n                    // '+e.escapeExpression((b=null!=(b=d.comment||(null!=a?a.comment:a))?b:d.helperMissing,"function"===typeof b?b.call(a,{name:"comment",hash:{},data:f}):b))+" "+(null!=(c=d["if"].call(a,null!=a?a.deprecated:a,{name:"if",hash:{},fn:e.program(3,f,0),
inverse:e.noop,data:f}))?c:"")+"\r\n                </div>\r\n"},3:function(e,a,d,g,f){return"Deprecated."},5:function(e,a,d,g,f){var c;return'{<span class="expand-closure glyphicon glyphicon-option-horizontal" data-path="'+e.escapeExpression((c=null!=(c=d.path||(null!=a?a.path:a))?c:d.helperMissing,"function"===typeof c?c.call(a,{name:"path",hash:{},data:f}):c))+'" data-index="'+e.escapeExpression((c=null!=(c=d.index||(null!=a?a.index:a))?c:d.helperMissing,"function"===typeof c?c.call(a,{name:"index",
hash:{},data:f}):c))+'"></span>}'},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['context'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"inline-context-methods\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.signatures : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <li>\r\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.comment : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <a href=\"#path/"
    + container.escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a><span class=\"highlight groovy inline\">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</span>\r\n            "
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.context : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n        </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                <div class=\"firstSentenceCommentText\">\r\n                    // "
    + container.escapeExpression(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"comment","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.deprecated : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                </div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "Deprecated.";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "{<span class=\"expand-closure glyphicon glyphicon-option-horizontal\" data-path=\""
    + container.escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></span>}";
},"useData":true});
				}());
				
//# sourceMappingURL=detail.js.map
(function(){var h=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).detail=h({compiler:[7,">= 4.0.0"],main:function(c,a,e,g,d){var b,f;return'<div class="detail">\r\n'+(null!=(b=e["if"].call(a,null!=a?a.ancestors:a,{name:"if",hash:{},fn:c.program(1,d,0),inverse:c.noop,data:d}))?b:"")+'    <div class="method-detail">\r\n        <h2>\r\n            '+c.escapeExpression((f=null!=(f=e.name||(null!=a?a.name:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"name",hash:{},data:d}):
f))+"\r\n            "+(null!=(b=e["if"].call(a,null!=(b=null!=a?a.methodNode:a)?b.plugin:b,{name:"if",hash:{},fn:c.program(4,d,0),inverse:c.noop,data:d}))?b:"")+'\r\n        </h2>\r\n        <div class="signatures">\r\n'+(null!=(b=e.each.call(a,null!=a?a.signatures:a,{name:"each",hash:{},fn:c.program(6,d,0),inverse:c.noop,data:d}))?b:"")+"        </div>\r\n\r\n"+(null!=(b=e["if"].call(a,null!=(b=null!=a?a.methodNode:a)?b.examples:b,{name:"if",hash:{},fn:c.program(27,d,0),inverse:c.noop,data:d}))?
b:"")+"\r\n"+(null!=(b=e["if"].call(a,null!=a?a.usages:a,{name:"if",hash:{},fn:c.program(29,d,0),inverse:c.noop,data:d}))?b:"")+"    </div>\r\n</div>"},1:function(c,a,e,g,d){var b,f;return'        <ol class="breadcrumb">\r\n'+(null!=(b=e.each.call(a,null!=a?a.ancestors:a,{name:"each",hash:{},fn:c.program(2,d,0),inverse:c.noop,data:d}))?b:"")+'            <li class="active">'+c.escapeExpression((f=null!=(f=e.name||(null!=a?a.name:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"name",hash:{},
data:d}):f))+"</li>\r\n        </ol>\r\n"},2:function(c,a,e,g,d){var b;return'                <li><a href="#path/'+c.escapeExpression((b=null!=(b=e.id||(null!=a?a.id:a))?b:e.helperMissing,"function"===typeof b?b.call(a,{name:"id",hash:{},data:d}):b))+'">'+c.escapeExpression((b=null!=(b=e.text||(null!=a?a.text:a))?b:e.helperMissing,"function"===typeof b?b.call(a,{name:"text",hash:{},data:d}):b))+"</a></li>\r\n"},4:function(c,a,e,g,d){var b;return'<a href="'+c.escapeExpression(c.lambda(null!=(b=null!=
(b=null!=a?a.methodNode:a)?b.plugin:b)?b.wiki:b,a))+'"><span class="glyphicon glyphicon-new-window"></span> '+c.escapeExpression(c.lambda(null!=(b=null!=(b=null!=a?a.methodNode:a)?b.plugin:b)?b.title:b,a))+"</a>"},6:function(c,a,e,g,d){var b,f;return"                "+(null!=(b=e["if"].call(a,null!=(b=null!=a?a.plugin:a)?b.minimumVersion:b,{name:"if",hash:{},fn:c.program(7,d,0),inverse:c.noop,data:d}))?b:"")+"\r\n"+(null!=(b=e["if"].call(a,null!=a?a.availableSince:a,{name:"if",hash:{},fn:c.program(9,
d,0),inverse:c.noop,data:d}))?b:"")+(null!=(b=e["if"].call(a,null!=a?a.deprecated:a,{name:"if",hash:{},fn:c.program(11,d,0),inverse:c.noop,data:d}))?b:"")+(null!=(b=e["if"].call(a,null!=a?a.generated:a,{name:"if",hash:{},fn:c.program(13,d,0),inverse:c.noop,data:d}))?b:"")+(null!=(b=e["if"].call(a,null!=a?a.extension:a,{name:"if",hash:{},fn:c.program(15,d,0),inverse:c.noop,data:d}))?b:"")+(null!=(b=e["if"].call(a,null!=a?a.required:a,{name:"if",hash:{},fn:c.program(17,d,0),inverse:c.noop,data:d}))?
b:"")+'                <div class="signature">\r\n                    '+c.escapeExpression((f=null!=(f=e.name||(null!=a?a.name:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"name",hash:{},data:d}):f))+'<span class="highlight groovy inline">'+c.escapeExpression((f=null!=(f=e.text||(null!=a?a.text:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"text",hash:{},data:d}):f))+"</span>\r\n                    "+(null!=(b=e["if"].call(a,null!=a?a.context:a,{name:"if",hash:{},fn:c.program(19,
d,0),inverse:c.noop,data:d}))?b:"")+"\r\n                </div>\r\n"+(null!=(b=e["if"].call(a,null!=a?a.html:a,{name:"if",hash:{},fn:c.program(21,d,0),inverse:c.noop,data:d}))?b:"")+(null!=(b=e["if"].call(a,null!=a?a.enums:a,{name:"if",hash:{},fn:c.program(23,d,0),inverse:c.noop,data:d}))?b:"")},7:function(c,a,e,g,d){var b;return'<span class="label label-min-version">Requires '+c.escapeExpression(c.lambda(null!=(b=null!=a?a.plugin:a)?b.title:b,a))+" v"+c.escapeExpression(c.lambda(null!=(b=null!=a?
a.plugin:a)?b.minimumVersion:b,a))+"+</span>"},9:function(c,a,e,g,d){var b;return'                    <span class="label label-since">Since '+c.escapeExpression((b=null!=(b=e.availableSince||(null!=a?a.availableSince:a))?b:e.helperMissing,"function"===typeof b?b.call(a,{name:"availableSince",hash:{},data:d}):b))+"</span>\r\n"},11:function(c,a,e,g,d){return'                    <span class="label label-deprecated"><a href="https://github.com/jenkinsci/job-dsl-plugin/wiki/Deprecation-Policy" target="_blank">Deprecated</a></span>\r\n'},
13:function(c,a,e,g,d){return'                    <span class="label label-generated"><a href="https://github.com/jenkinsci/job-dsl-plugin/wiki/Automatically-Generated-DSL" target="_blank">Generated</a></span>\r\n'},15:function(c,a,e,g,d){return'                    <span class="label label-extension"><a href="https://github.com/jenkinsci/job-dsl-plugin/wiki/Extending-the-DSL" target="_blank">Extension</a></span>\r\n'},17:function(c,a,e,g,d){return'                    <span class="label label-required">Required</span>\r\n'},
19:function(c,a,e,g,d){var b;return'{<span class="expand-closure glyphicon glyphicon-option-horizontal" data-path="'+c.escapeExpression((b=null!=(b=e.path||(null!=a?a.path:a))?b:e.helperMissing,"function"===typeof b?b.call(a,{name:"path",hash:{},data:d}):b))+'" data-index="'+c.escapeExpression((b=null!=(b=e.index||(null!=a?a.index:a))?b:e.helperMissing,"function"===typeof b?b.call(a,{name:"index",hash:{},data:d}):b))+'"></span>}'},21:function(c,a,e,g,d){var b,f;return'                    <div class="method-doc">'+
(null!=(b=(f=null!=(f=e.html||(null!=a?a.html:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"html",hash:{},data:d}):f))?b:"")+"</div>\r\n"},23:function(c,a,e,g,d){var b;return'                    <div class="enums">\r\n'+(null!=(b=e.each.call(a,null!=a?a.enums:a,{name:"each",hash:{},fn:c.program(24,d,0),inverse:c.noop,data:d}))?b:"")+"                    </div>\r\n"},24:function(c,a,e,g,d){var b,f;return'                        <div class="enum">\r\n                            <div class="enum-title">Possible values for <code>'+
c.escapeExpression((f=null!=(f=e.paramName||(null!=a?a.paramName:a))?f:e.helperMissing,"function"===typeof f?f.call(a,{name:"paramName",hash:{},data:d}):f))+"</code>:</div>\r\n                            <ul>\r\n"+(null!=(b=e.each.call(a,null!=a?a.values:a,{name:"each",hash:{},fn:c.program(25,d,0),inverse:c.noop,data:d}))?b:"")+"                            </ul>\r\n                        </div>\r\n"},25:function(c,a,e,g,d){return"                                    <li>"+c.escapeExpression(c.lambda(a,
a))+"</li>\r\n"},27:function(c,a,e,g,d){var b;return'            <h3 class="section-header">Examples</h3>\r\n\r\n            <pre class="highlight groovy">'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.methodNode:a)?b.examples:b,a))+"</pre>\r\n"},29:function(c,a,e,g,d){var b;return'            <h3 class="section-header">Usages</h3>\r\n            <ul class="usages">\r\n'+(null!=(b=e.each.call(a,null!=a?a.usages:a,{name:"each",hash:{},fn:c.program(30,d,0),inverse:c.noop,data:d}))?b:"")+"            </ul>\r\n"},
30:function(c,a,e,g,d){var b;return'                    <li>\r\n                        <div class="method-name '+(null!=(b=e["if"].call(a,null!=(b=null!=a?a.method:a)?b.deprecated:b,{name:"if",hash:{},fn:c.program(31,d,0),inverse:c.noop,data:d}))?b:"")+'">\r\n                            <a href="#method/'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.context:a)?b.type:b,a))+"."+c.escapeExpression(c.lambda(null!=(b=null!=a?a.method:a)?b.name:b,a))+'" title="'+c.escapeExpression(c.lambda(null!=(b=
null!=a?a.method:a)?b.name:b,a))+'">'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.method:a)?b.name:b,a))+'</a>\r\n                            : <span class="simple-class-name">'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.context:a)?b.simpleClassName:b,a))+"</span>\r\n                        </div>\r\n                    </li>\r\n"},31:function(c,a,e,g,d){return"deprecated"},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['detail'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"detail\">\r\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.ancestors : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"method-detail\">\r\n        <h2>\r\n            "
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n            "
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.methodNode : depth0)) != null ? stack1.plugin : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n        </h2>\r\n        <div class=\"signatures\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.signatures : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.methodNode : depth0)) != null ? stack1.examples : stack1),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.usages : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <ol class=\"breadcrumb\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.ancestors : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <li class=\"active\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</li>\r\n        </ol>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <li><a href=\"#path/"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</a></li>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<a href=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.methodNode : depth0)) != null ? stack1.plugin : stack1)) != null ? stack1.wiki : stack1), depth0))
    + "\"><span class=\"glyphicon glyphicon-new-window\"></span> "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.methodNode : depth0)) != null ? stack1.plugin : stack1)) != null ? stack1.title : stack1), depth0))
    + "</a>";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                "
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.minimumVersion : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.availableSince : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.deprecated : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.generated : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.extension : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.required : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                <div class=\"signature\">\r\n                    "
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "<span class=\"highlight groovy inline\">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</span>\r\n                    "
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.context : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                </div>\r\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.html : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.enums : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"label label-min-version\">Requires "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.title : stack1), depth0))
    + " v"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.minimumVersion : stack1), depth0))
    + "+</span>";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <span class=\"label label-since\">Since "
    + container.escapeExpression(((helper = (helper = helpers.availableSince || (depth0 != null ? depth0.availableSince : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"availableSince","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "                    <span class=\"label label-deprecated\"><a href=\"https://github.com/jenkinsci/job-dsl-plugin/wiki/Deprecation-Policy\" target=\"_blank\">Deprecated</a></span>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "                    <span class=\"label label-generated\"><a href=\"https://github.com/jenkinsci/job-dsl-plugin/wiki/Automatically-Generated-DSL\" target=\"_blank\">Generated</a></span>\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "                    <span class=\"label label-extension\"><a href=\"https://github.com/jenkinsci/job-dsl-plugin/wiki/Extending-the-DSL\" target=\"_blank\">Extension</a></span>\r\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "                    <span class=\"label label-required\">Required</span>\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return "{<span class=\"expand-closure glyphicon glyphicon-option-horizontal\" data-path=\""
    + container.escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"path","hash":{},"data":data}) : helper)))
    + "\" data-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></span>}";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <div class=\"method-doc\">"
    + ((stack1 = ((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"html","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <div class=\"enums\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.enums : depth0),{"name":"each","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </div>\r\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                        <div class=\"enum\">\r\n                            <div class=\"enum-title\">Possible values for <code>"
    + container.escapeExpression(((helper = (helper = helpers.paramName || (depth0 != null ? depth0.paramName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"paramName","hash":{},"data":data}) : helper)))
    + "</code>:</div>\r\n                            <ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.values : depth0),{"name":"each","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                            </ul>\r\n                        </div>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    return "                                    <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\r\n";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <h3 class=\"section-header\">Examples</h3>\r\n\r\n            <pre class=\"highlight groovy\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.methodNode : depth0)) != null ? stack1.examples : stack1), depth0))
    + "</pre>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <h3 class=\"section-header\">Usages</h3>\r\n            <ul class=\"usages\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usages : depth0),{"name":"each","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\r\n";
},"30":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <li>\r\n                        <div class=\"method-name "
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.deprecated : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                            <a href=\"#method/"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.context : depth0)) != null ? stack1.type : stack1), depth0))
    + "."
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" title=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\r\n                            : <span class=\"simple-class-name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.context : depth0)) != null ? stack1.simpleClassName : stack1), depth0))
    + "</span>\r\n                        </div>\r\n                    </li>\r\n";
},"31":function(container,depth0,helpers,partials,data) {
    return "deprecated";
},"useData":true});
				}());
				
//# sourceMappingURL=home.js.map
(function(){var c=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).home=c({compiler:[7,">= 4.0.0"],main:function(d,a,c,e,f){var b;return'<div class="detail">\r\n    <div class="method-detail">\r\n        <h2>Jenkins Job DSL API</h2>\r\n\r\n        <div class="intro">\r\n            <p>\r\n                Welcome to the Job DSL API Viewer. This is the Job DSL reference, showing all available DSL methods. Use the navigation\r\n                on the left to browse all methods starting from the methods available in the script context.\r\n            </p>\r\n            <p>\r\n                The Job DSL API currently supports '+
d.escapeExpression(d.lambda(null!=(b=null!=a?a.plugins:a)?b.length:b,a))+' Jenkins plugins. Click the <span class="glyphicon glyphicon-filter"></span>\r\n                on the top-right to filter methods by plugin.\r\n            </p>\r\n            <p>\r\n                For further documentation, please go to the <a href="https://github.com/jenkinsci/job-dsl-plugin/wiki">Job DSL Wiki</a>.\r\n            </p>\r\n            <p>\r\n                Other Jenkins plugins can contribute DSL methods through extension points. Refer to the plugins\'\r\n                wiki pages for documentation:\r\n            </p>\r\n            <ul>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/ClearCase+UCM+Plugin#ClearCaseUCMPlugin-JenkinsJobDSL">ClearCase UCM Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/CodeSonar+Plugin#CodeSonarPlugin-JenkinsJobDSL">CodeSonar Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/GitHub+pull+request+builder+plugin#GitHubpullrequestbuilderplugin-JobDSLSupport">GitHub Pull Request Builder Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/JGiven+Plugin#JGivenPlugin-JobDSL">JGiven Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/Logging+Plugin#LoggingPlugin-JenkinsJobDSL">Logging Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/Memory+Map+Plugin#MemoryMapPlugin-JenkinsJobDSL">Memory Map Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/Next+Build+Number+Plugin#NextBuildNumberPlugin-JobDSL">Next Build Number Plugin</a></li>\r\n                <li><a href="https://wiki.jenkins-ci.org/display/JENKINS/Pretested+Integration+Plugin#PretestedIntegrationPlugin-JenkinsJobDSL">Pretested Integration Plugin</a></li>\r\n            </ul>\r\n        </div>\r\n\r\n        <h3 class="section-header">Top-Level Methods</h3>\r\n        <div class="context-methods-section"></div>\r\n    </div>\r\n</div>\r\n'},
useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['home'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"detail\">\r\n    <div class=\"method-detail\">\r\n        <h2>Jenkins Job DSL API</h2>\r\n\r\n        <div class=\"intro\">\r\n            <p>\r\n                Welcome to the Job DSL API Viewer. This is the Job DSL reference, showing all available DSL methods. Use the navigation\r\n                on the left to browse all methods starting from the methods available in the script context.\r\n            </p>\r\n            <p>\r\n                The Job DSL API currently supports "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugins : depth0)) != null ? stack1.length : stack1), depth0))
    + " Jenkins plugins. Click the <span class=\"glyphicon glyphicon-filter\"></span>\r\n                on the top-right to filter methods by plugin.\r\n            </p>\r\n            <p>\r\n                For further documentation, please go to the <a href=\"https://github.com/jenkinsci/job-dsl-plugin/wiki\">Job DSL Wiki</a>.\r\n            </p>\r\n            <p>\r\n                Other Jenkins plugins can contribute DSL methods through extension points. Refer to the plugins'\r\n                wiki pages for documentation:\r\n            </p>\r\n            <ul>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/ClearCase+UCM+Plugin#ClearCaseUCMPlugin-JenkinsJobDSL\">ClearCase UCM Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/CodeSonar+Plugin#CodeSonarPlugin-JenkinsJobDSL\">CodeSonar Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/GitHub+pull+request+builder+plugin#GitHubpullrequestbuilderplugin-JobDSLSupport\">GitHub Pull Request Builder Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/JGiven+Plugin#JGivenPlugin-JobDSL\">JGiven Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/Logging+Plugin#LoggingPlugin-JenkinsJobDSL\">Logging Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/Memory+Map+Plugin#MemoryMapPlugin-JenkinsJobDSL\">Memory Map Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/Next+Build+Number+Plugin#NextBuildNumberPlugin-JobDSL\">Next Build Number Plugin</a></li>\r\n                <li><a href=\"https://wiki.jenkins-ci.org/display/JENKINS/Pretested+Integration+Plugin#PretestedIntegrationPlugin-JenkinsJobDSL\">Pretested Integration Plugin</a></li>\r\n            </ul>\r\n        </div>\r\n\r\n        <h3 class=\"section-header\">Top-Level Methods</h3>\r\n        <div class=\"context-methods-section\"></div>\r\n    </div>\r\n</div>\r\n";
},"useData":true});
				}());
				
//# sourceMappingURL=pluginDetail.js.map
(function(){var g=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).pluginDetail=g({compiler:[7,">= 4.0.0"],main:function(c,a,e,f,d){var b;return'<div class="detail">\r\n    <div class="method-detail">\r\n        <h2>\r\n            '+c.escapeExpression(c.lambda(null!=(b=null!=a?a.plugin:a)?b.title:b,a))+'\r\n\r\n            <a href="'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.plugin:a)?b.wiki:b,a))+'"><span class="glyphicon glyphicon-new-window"></span> Wiki</a></h2>\r\n        </h2>\r\n        <div class="method-doc">'+
(null!=(b=c.lambda(null!=(b=null!=a?a.plugin:a)?b.excerpt:b,a))?b:"")+'</div>\r\n\r\n        <h3 class="section-header">DSL Methods</h3>\r\n        <ul class="usages">\r\n'+(null!=(b=e.each.call(a,null!=a?a.usages:a,{name:"each",hash:{},fn:c.program(1,d,0),inverse:c.noop,data:d}))?b:"")+"        </ul>\r\n    </div>\r\n</div>"},1:function(c,a,e,f,d){var b;return'                <li>\r\n                    <div class="method-name '+(null!=(b=e["if"].call(a,null!=(b=null!=a?a.method:a)?b.deprecated:
b,{name:"if",hash:{},fn:c.program(2,d,0),inverse:c.noop,data:d}))?b:"")+'">\r\n                        <a href="#method/'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.context:a)?b.type:b,a))+"."+c.escapeExpression(c.lambda(null!=(b=null!=a?a.method:a)?b.name:b,a))+'" title="'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.method:a)?b.name:b,a))+'">'+c.escapeExpression(c.lambda(null!=(b=null!=a?a.method:a)?b.name:b,a))+'</a>\r\n                        : <span class="simple-class-name">'+c.escapeExpression(c.lambda(null!=
(b=null!=a?a.context:a)?b.simpleClassName:b,a))+"</span>\r\n                    </div>\r\n                </li>\r\n"},2:function(c,a,e,f,d){return"deprecated"},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['pluginDetail'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"detail\">\r\n    <div class=\"method-detail\">\r\n        <h2>\r\n            "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.title : stack1), depth0))
    + "\r\n\r\n            <a href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.wiki : stack1), depth0))
    + "\"><span class=\"glyphicon glyphicon-new-window\"></span> Wiki</a></h2>\r\n        </h2>\r\n        <div class=\"method-doc\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.excerpt : stack1), depth0)) != null ? stack1 : "")
    + "</div>\r\n\r\n        <h3 class=\"section-header\">DSL Methods</h3>\r\n        <ul class=\"usages\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\r\n    </div>\r\n</div>";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <li>\r\n                    <div class=\"method-name "
    + ((stack1 = helpers["if"].call(depth0,((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.deprecated : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                        <a href=\"#method/"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.context : depth0)) != null ? stack1.type : stack1), depth0))
    + "."
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" title=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.method : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\r\n                        : <span class=\"simple-class-name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.context : depth0)) != null ? stack1.simpleClassName : stack1), depth0))
    + "</span>\r\n                    </div>\r\n                </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "deprecated";
},"useData":true});
				}());
				
//# sourceMappingURL=plugins.js.map
(function(){var f=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).plugins=f({compiler:[7,">= 4.0.0"],main:function(d,b,c,f,e){var a;return'<ul class="nav">\r\n'+(null!=(a=c.each.call(b,null!=b?b.plugins:b,{name:"each",hash:{},fn:d.program(1,e,0),inverse:d.noop,data:e}))?a:"")+"</ul>"},1:function(d,b,c,f,e){var a;return'        <li data-plugin-name="'+d.escapeExpression((a=null!=(a=c.name||(null!=b?b.name:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"name",hash:{},
data:e}):a))+'"><a href="#plugin/'+d.escapeExpression((a=null!=(a=c.name||(null!=b?b.name:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"name",hash:{},data:e}):a))+'"><span class="checkbox-wrapper"><input type="checkbox" checked /></span> '+d.escapeExpression((a=null!=(a=c.title||(null!=b?b.title:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"title",hash:{},data:e}):a))+"</a></li>\r\n"},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['plugins'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"nav\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.plugins : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <li data-plugin-name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"><a href=\"#plugin/"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"><span class=\"checkbox-wrapper\"><input type=\"checkbox\" checked /></span> "
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a></li>\r\n";
},"useData":true});
				}());
				
//# sourceMappingURL=searchResults.js.map
(function(){var f=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).searchResults=f({compiler:[7,">= 4.0.0"],main:function(d,b,c,f,e){var a;return"<ul>\r\n"+(null!=(a=c.each.call(b,null!=b?b.results:b,{name:"each",hash:{},fn:d.program(1,e,0),inverse:d.noop,data:e}))?a:"")+"</ul>"},1:function(d,b,c,f,e){var a;return'        <li>\r\n            <a href="#method/'+d.escapeExpression((a=null!=(a=c.clazz||(null!=b?b.clazz:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"clazz",
hash:{},data:e}):a))+"."+d.escapeExpression((a=null!=(a=c.name||(null!=b?b.name:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"name",hash:{},data:e}):a))+'">\r\n                <div>\r\n                    '+d.escapeExpression((a=null!=(a=c.name||(null!=b?b.name:b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"name",hash:{},data:e}):a))+' :\r\n                    <span class="simple-class-name">'+d.escapeExpression((a=null!=(a=c.simpleClassName||(null!=b?b.simpleClassName:
b))?a:c.helperMissing,"function"===typeof a?a.call(b,{name:"simpleClassName",hash:{},data:e}):a))+"</span>\r\n                </div>\r\n            </a>\r\n        </li>\r\n"},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['searchResults'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.results : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <li>\r\n            <a href=\"#method/"
    + container.escapeExpression(((helper = (helper = helpers.clazz || (depth0 != null ? depth0.clazz : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"clazz","hash":{},"data":data}) : helper)))
    + "."
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\r\n                <div>\r\n                    "
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + " :\r\n                    <span class=\"simple-class-name\">"
    + container.escapeExpression(((helper = (helper = helpers.simpleClassName || (depth0 != null ? depth0.simpleClassName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"simpleClassName","hash":{},"data":data}) : helper)))
    + "</span>\r\n                </div>\r\n            </a>\r\n        </li>\r\n";
},"useData":true});
				}());
				
//# sourceMappingURL=tree.js.map
(function(){var a=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).tree=a({compiler:[7,">= 4.0.0"],main:function(a,b,c,d,e){return'<div class="tree-body"></div>\r\n<div class="search-results" style="display: none"></div>'},useData:!0})})();
		(function(){
			var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
				templates['tree'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"tree-body\"></div>\r\n<div class=\"search-results\" style=\"display: none\"></div>";
},"useData":true});
				}());
				
//# sourceMappingURL=ContextView.js.map
App.ContextView=Marionette.ItemView.extend({className:"context-view",template:"context",serializeData:function(){return{signatures:this.options.signatures}}});App.ContextView = Marionette.ItemView.extend({

    className: 'context-view',

    template: 'context',

    serializeData: function() {
        return {
            signatures: this.options.signatures
        };
    }
});

//# sourceMappingURL=DetailView.js.map
App.DetailView=Marionette.ItemView.extend({template:"detail",initialize:function(a){this.dsl=a.dsl;this.path=a.path;this.settings=a.settings;this.listenTo(this.settings,"change",this.render)},serializeData:function(){var a=this.dsl.getPathInfo(this.path),b=a.methodNode,c=a.usages,a={methodNode:b,name:b.name,ancestors:a.ancestors};b.signatures&&(a.signatures=this.dsl.getSignatures(b,this.path));a.usages=_.sortBy(c,function(a){return(a.method.name+a.simpleClassName).toLowerCase()});return a}});App.DetailView = Marionette.ItemView.extend({

    template: 'detail',

    initialize: function(options) {
        this.dsl = options.dsl;
        this.path = options.path;
        this.settings = options.settings;
        this.listenTo(this.settings, 'change', this.render);
    },

    serializeData: function() {
        var pathInfo = this.dsl.getPathInfo(this.path);
        var methodNode = pathInfo.methodNode;
        var ancestors = pathInfo.ancestors;
        var usages = pathInfo.usages;

        var data = {
            methodNode: methodNode,
            name: methodNode.name,
            ancestors: ancestors
        };

        if (methodNode.signatures) {
            data.signatures = this.dsl.getSignatures(methodNode, this.path);
        }

        data.usages = _.sortBy(usages, function(usage) { return (usage.method.name + usage.simpleClassName).toLowerCase(); });

        return data;
    }

});

//# sourceMappingURL=HomeView.js.map
App.HomeView=Marionette.LayoutView.extend({template:"home",regions:{contextRegion:".context-methods-section"},initialize:function(a){this.settings=a.settings;this.dsl=a.dsl;this.plugins=a.plugins;this.listenTo(this.settings,"change",this.render)},onRender:function(){var a=this.dsl.getPathInfo().methodNode,a=this.dsl.getContextSignatures(a.contextClass),a=_.filter(a,function(a){return!a.plugin||!this.settings.isPluginExcluded(a.plugin.id)},this),a=new App.ContextView({signatures:a});this.contextRegion.show(a)},
serializeData:function(){return{plugins:this.plugins}}});App.HomeView = Marionette.LayoutView.extend({

    template: 'home',

    regions: {
        contextRegion: '.context-methods-section'
    },

    initialize: function(options) {
        this.settings = options.settings;
        this.dsl = options.dsl;
        this.plugins = options.plugins;
        this.listenTo(this.settings, 'change', this.render);
    },

    onRender: function() {
        var pathInfo = this.dsl.getPathInfo();
        var methodNode = pathInfo.methodNode;
        var signatures = this.dsl.getContextSignatures(methodNode.contextClass);
        signatures = _.filter(signatures, function(sig) {
            return !sig.plugin || !this.settings.isPluginExcluded(sig.plugin.id);
        }, this);
        var contextView = new App.ContextView({signatures: signatures});
        this.contextRegion.show(contextView);
    },

    serializeData: function() {
        return {plugins: this.plugins};
    }
});

//# sourceMappingURL=PluginDetailView.js.map
App.PluginDetailView=Marionette.ItemView.extend({template:"pluginDetail",serializeData:function(){return{plugin:this.options.plugin,usages:this.options.usages}}});App.PluginDetailView = Marionette.ItemView.extend({

    template: 'pluginDetail',

    serializeData: function() {
        return {
            plugin: this.options.plugin,
            usages: this.options.usages
        };
    }
});

//# sourceMappingURL=PluginsView.js.map
App.PluginsView=Marionette.ItemView.extend({template:"plugins",events:{"click .checkbox-wrapper":"onWrapperClick"},initialize:function(a){this.settings=a.settings;this.pluginList=a.pluginList;this.listenTo(this.settings,"change",this.onRender)},onRender:function(){this.$("li").each(function(a,b){var c=$(b),d=c.data("pluginName"),d=!this.settings.isPluginExcluded(d);c.find("input").prop("checked",d)}.bind(this))},onWrapperClick:function(a){a.stopPropagation();var b=$(a.currentTarget).find("input"),
c=b.closest("li").data("pluginName");$(a.target).is("input")||b.prop("checked",!b.prop("checked"));this.settings.setPluginExcluded(c,!b.prop("checked"))},serializeData:function(){var a=this.pluginList;return{numPlugins:a.length,plugins:a}}});App.PluginsView = Marionette.ItemView.extend({

    template: 'plugins',

    events: {
        'click .checkbox-wrapper': 'onWrapperClick'
    },

    initialize: function(options) {
        this.settings = options.settings;
        this.pluginList = options.pluginList;
        this.listenTo(this.settings, 'change', this.onRender);
    },

    onRender: function() {
        this.$('li').each(function(index, el) {
            var $el = $(el);
            var name = $el.data('pluginName');
            var checked = !this.settings.isPluginExcluded(name);
            $el.find('input').prop('checked', checked);
        }.bind(this));
    },

    onWrapperClick: function(e) {
        e.stopPropagation();
        var $checkbox = $(e.currentTarget).find('input');
        var name = $checkbox.closest('li').data('pluginName');
        if (!$(e.target).is('input')) {
            $checkbox.prop('checked', !$checkbox.prop('checked'));
        }
        this.settings.setPluginExcluded(name, !$checkbox.prop('checked'));
    },

    serializeData: function() {
        var pluginList = this.pluginList;
        return {
            numPlugins: pluginList.length,
            plugins: pluginList
        };
    }
});

//# sourceMappingURL=TreeView.js.map
App.TreeView=Marionette.ItemView.extend({template:"tree",initialize:function(a){this.dsl=a.dsl;this.settings=a.settings;this.listenTo(this.settings,"change",function(){this.jstree.refresh();this._updateNodeIcons(this.$(".tree-body"))})},_updateNodeIcons:function(a){a.parent().find(".jstree-open > i.jstree-icon").removeClass("glyphicon-triangle-right").addClass("glyphicon glyphicon-triangle-bottom");a.parent().find(".jstree-closed > i.jstree-icon").removeClass("glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-right")},
onRender:function(){var a=this.$(".tree-body");a.on("open_node.jstree",this.onOpenNode.bind(this));a.on("close_node.jstree",this.onCloseNode.bind(this));a.jstree("destroy").on("changed.jstree",this.onTreeChanged.bind(this)).on("ready.jstree",this.onTreeReady.bind(this)).jstree({plugins:["wholerow"],core:{animation:!1,data:this.loadTreeData.bind(this),themes:{name:"proton",responsive:!0},multiple:!1,worker:!1}});this.jstree=a.jstree()},loadTreeData:function(a,b){var d="#"===a.id?this.dsl.getRootContextClass():
a.original.methodNode.contextClass,d=_.chain(this.dsl.getContext(d).methods).filter(function(a){return!a.plugin||!this.settings.isPluginExcluded(a.plugin.name)}.bind(this)).sortBy(function(a){return a.name.toLowerCase()}).value().map(function(b){return this.buildJstreeNode(b,a)},this);b(d)},onOpenNode:function(a,b){var d=document.getElementById(b.node.id);this._updateNodeIcons($(d))},onCloseNode:function(a,b){var d=document.getElementById(b.node.id);this._updateNodeIcons($(d))},onTreeReady:function(){this.updateTreeFromHash();
this._updateNodeIcons(this.$(".tree-body"))},onTreeChanged:function(a,b){a.preventDefault();b.node&&(window.location.hash="path/"+b.node.id)},updateTreeFromHash:function(){var a=window.location.hash;this.jstree.deselect_all(!0);if(a&&0===a.indexOf("#path/")){$(".tree-body").show();$(".search-results").hide();var b=a.substring(6).split("-");b.forEach(function(a,f){var c=b.slice(0,f+1).join("-"),c=this.jstree.get_node(c);if(f<b.length-1)this.jstree.open_node(c);else if(this.jstree.select_node(c.id),
c=$("#"+c.id),c.length){var e=$(".tree-wrapper");(c.offset().top<e.offset().top||c.offset().top+c.height()>e.offset().top+e.height())&&c[0].scrollIntoView()}},this)}},buildJstreeNode:function(a,b){var d={id:"#"===b.id?a.name:b.id+"-"+a.name,text:a.name,icon:!1,methodNode:a,children:!!a.contextClass};a.deprecated&&(d.a_attr={"class":"deprecated"});return d}});App.TreeView = Marionette.ItemView.extend({

    template: 'tree',

    initialize: function(options) {
        this.dsl = options.dsl;
        this.settings = options.settings;

        this.listenTo(this.settings, 'change', function() {
            this.jstree.refresh();
            this._updateNodeIcons(this.$('.tree-body'));
        });
    },

    _updateNodeIcons: function($el) {
        $el.parent().find('.jstree-open > i.jstree-icon')
            .removeClass('glyphicon-triangle-right').addClass('glyphicon glyphicon-triangle-bottom');
        $el.parent().find('.jstree-closed > i.jstree-icon')
            .removeClass('glyphicon-triangle-bottom').addClass('glyphicon glyphicon-triangle-right');
    },

    onRender: function() {
        var $treeBody = this.$('.tree-body');
        $treeBody.on('open_node.jstree', this.onOpenNode.bind(this));
        $treeBody.on('close_node.jstree', this.onCloseNode.bind(this));

        $treeBody
            .jstree('destroy')
            .on('changed.jstree', this.onTreeChanged.bind(this))
            .on('ready.jstree', this.onTreeReady.bind(this))
            .jstree({
                'plugins': ['wholerow'],
                'core': {
                    'animation': false,
                    'data': this.loadTreeData.bind(this),
                    'themes': {
                        'name': 'proton',
                        'responsive': true
                    },
                    'multiple': false,
                    'worker': false
                }
            });
        this.jstree = $treeBody.jstree();
    },

    loadTreeData: function(node, cb) {
        var contextClass = node.id === '#' ? this.dsl.getRootContextClass() : node.original.methodNode.contextClass;
        var methods = _.chain(this.dsl.getContext(contextClass).methods)
            .filter(function (method) {
                return !method.plugin || !this.settings.isPluginExcluded(method.plugin.name);
            }.bind(this))
            .sortBy(function (method) {
                return method.name.toLowerCase();
            })
            .value();
        var treeNodes = methods.map(function(method) {
            return this.buildJstreeNode(method, node);
        }, this);

        cb(treeNodes);
    },

    onOpenNode: function(e, data){
        var el = document.getElementById(data.node.id);
        this._updateNodeIcons($(el));
    },

    onCloseNode: function(e, data) {
        var el = document.getElementById(data.node.id);
        this._updateNodeIcons($(el));
    },

    onTreeReady: function() {
        this.updateTreeFromHash();
        this._updateNodeIcons(this.$('.tree-body'));
    },

    onTreeChanged: function(e, data) {
        e.preventDefault();
        if (data.node) {
            var path = data.node.id;
            window.location.hash = 'path/' + path;
        }
    },

    updateTreeFromHash: function() {
        var hashId = window.location.hash;
        this.jstree.deselect_all(true);

        if (hashId && hashId.indexOf('#path/') === 0) {
            $('.tree-body').show();
            $('.search-results').hide();

            var path = hashId.substring(6);
            var tokens = path.split('-');
            tokens.forEach(function(token, index) {
                var id = tokens.slice(0, index + 1).join('-');
                var node = this.jstree.get_node(id);
                if (index < tokens.length - 1) {
                    this.jstree.open_node(node);
                } else {
                    this.jstree.select_node(node.id);
                    var $el = $('#' + node.id);
                    if ($el.length) { // make sure selected node is visible
                        var $wrapper = $('.tree-wrapper');
                        if ($el.offset().top < $wrapper.offset().top ||
                            $el.offset().top + $el.height() > $wrapper.offset().top + $wrapper.height()) {
                            $el[0].scrollIntoView();
                        }
                    }
                }
            }, this);
        }
    },

    buildJstreeNode: function(node, parent) {
        var id = parent.id === '#' ? node.name : parent.id + '-' + node.name;
        var treeNode = {
            id: id,
            text: node.name,
            icon: false,
            methodNode: node,
            children: !!(node.contextClass)
        };

        if (node.deprecated) {
            treeNode.a_attr = {'class': 'deprecated'};
        }
        return treeNode;
    }
});

