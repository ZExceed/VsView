/**
 * VsView - v0.9
 * author : ZExceed
 * project: https://github.com/ZExceed/VsView
 * licensed under the MIT
 */

(function($){
    'use strict';

    var mo = function(options){
        this.options = $.extend({
            borderColor: '000000',
            drawRect: true
        }, options);

        var container = $(this.options.container),
            canvas    = $('<canvas/>')[0];

        container.css('position', 'relative');

        this.canvas    = canvas;
        this.container = container;
        this.context   = canvas.getContext('2d');
        this._rect     = {top: null, right: null, bottom: null, left: null};
        this.callback  = null;
        this.init();
    };

    mo.prototype.init = function(){
        var _self = this,
            img   = new Image();
        if(!this.options.image){
            return;
        }
        img.onload = function() {
            _self.load(img);
        };

        img.crossOrigin = ''; // Access-Control-Allow-Origin *
        img.src = this.options.image;
    };

    mo.prototype.load = function(img){
        var _self     = this;
        _self.canvas.width  = img.width;
        _self.canvas.height = img.height;
        _self.context.drawImage(img, 0, 0);

        _self.container.append(_self.canvas).on('click', function(e){
            if($(e.target).is('div.rect')){
                return false;
            }
            var rect = _self.rect(e.offsetX, e.offsetY);
            _self.callback && _self.callback(rect, _self.draw(rect));
        });
    };

    mo.prototype.rect = function(x ,y){
        this._rect = {top: null, right: null, bottom: null, left: null};
        this.scan('top', x, y);
        this.scan('right', x, y);
        this.scan('bottom', x, y);
        this.scan('left', x, y);

        if(isRect(this._rect, null)) do {
            var r = this._rect;
            if(isRect(r, 0)){
                var position = {
                        x: r.left[0],
                        y: r.top[1],
                        w: r.right[0] - r.left[0],
                        h: r.bottom[1] - r.top[1]
                    };
                return isRect(position, 0) ? position : null;
            }else{
                return null;
            }
        }while(!isRect(this._rect, null));
    };

    mo.prototype.scan = function(p, x, y){
        var px  = this.context.getImageData(x, y, 1, 1).data,
            pxs = [px[0], px[1], px[2]].toString();

        if(pxs === '0,0,0' && px[3]===0){
            this._rect[p] = 0;
        }else if(pxs === hex2rgb(this.options.borderColor).toString()){
            this._rect[p] = [x, y];
        }else{
            p === 'top'    && y --;
            p === 'right'  && x ++;
            p === 'bottom' && y ++;
            p === 'left'   && x --;
            this.scan(p, x, y);
        }
    };

    mo.prototype.active = function(cb){
        this.callback = isFunction(cb) ? cb : null;
    };

    mo.prototype.draw = function(r){
        if(!this.options.drawRect || !isRect(r, 0)){
            return;
        }
        var rect = $('<div class="rect" />').css({
            position: 'absolute',
            'z-index': 9,
            top: r.y,
            left: r.x,
            width: r.w-1,
            height:r.h-1,
            border: '1px solid rgba(0, 255, 0, 0.7)',
            background: 'rgba(0, 255, 100, 0.25)'
        });
        rect.appendTo(this.container);
        return rect;
    };

    // 16进制转RGB
    var hex2rgb = function(color){
        var num = parseInt(color, 16);
        return [num >> 16, num >> 8 & 255, num & 255];
    };

    var isRect = function(obj, val){
        if(!obj){
            return false;
        }
        for(var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] === val) {
                return false;
            }
        }
        return true;
    };

    var isFunction = function(obj){
        var type = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && type === 'Function';
    };

    $.fn.VsView = function(opts){
        var options = $.extend({
            container: this
        }, opts);
        return new mo(options);
    };

}(jQuery));
