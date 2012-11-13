//	jquery.docorder.js 1.0
//	2012 Adam Mangum

;(function($, window, document, undefined){

	var 
	name = 'docorder',
	defaults = {
		'autoUpdate': true,
		'latency': 1000,
		'queries': [],
	},
	/**
	     Debounce function from:
		 Underscore.js 1.4.2
	     http://underscorejs.org
	     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
	     Underscore may be freely distributed under the MIT license.
	
	*/
	_debounce = function debounce(func, wait, immediate) {
	    var timeout, result;
	    return function() {
	      var context = this, args = arguments;
	      var later = function() {
	        timeout = null;
	        if (!immediate) result = func.apply(context, args);
	      };
	      var callNow = immediate && !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(later, wait);
	      if (callNow) result = func.apply(context, args);
	      return result;
	    };
	  },
	_move = function move( mappings ){
		var map, sibs;
		$.each(mappings, function(){
			map = this;
			map.parent 	= map.parent instanceof jQuery ? map.parent : $(map.parent);
			map.child 	= map.child instanceof jQuery ? map.child : $(map.child);
			sibs 		= map.parent.children();
			if( !map.parent || !map.child )
				return;
			if( map.index === 0 ){
				map.child.prependTo( map.parent );
			}else if( typeof map.index == 'number' && map.index < sibs.length ){
				sibs.eq(map.index).before(map.child);
			}else{
				map.child.appendTo( map.parent );
			}
		});
	},
	DocOrder = function(element, options){
		this._defaults = defaults;
		this._name = name;
		this.$element = element;
		this.settings = $.extend({}, defaults, options);
		this.$win = $(window);
		this.init();
	};
	
	DocOrder.prototype.init = function(){
		this._initState = (function(){
			var state = [], parent, child;
			$.each(this.settings.queries, function(){
				$.each(this.map, function(){
					child 	= $(this.child);
					parent 	= child.parent();
					if(child.length && parent.length == 1){
						state[state.length] = {
							'parent': parent,
							'child'	: child,
							'index'	: child.index(),
						};
					}
				});
			});
			return state;
		}).apply(this);
		if( this.settings.autoUpdate ){
			var api = this;
			this.$win.resize(
				_debounce(function(){
					api.update();		
				}, this.settings.latency)
			);
		}
	};
	
	DocOrder.prototype.update = function(){
		var w = this.$win.width();
		_move( this._initState );
		$.each( this.settings.queries, function(i){
			var q = this;
			/**
			*	Check if the query applies to the current
			*	window width
			*/
			if( (q.min == undefined || q.min <= w) &&
				(q.max == undefined || q.max >= w) ){
				_move(q.map);				
			}
		});
		return this;
	};
	
	$.fn.docorder = function( options ){
		
		if( !$.data(this, 'docorder') ){
			$.data(this, 'docorder', new DocOrder(this, options));
		}
		return this;
	};
	
})(jQuery, window, document);