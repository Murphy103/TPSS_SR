/**
 * Created by ezgoing on 14/9/2014.
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox = function(options, el){
        var el = el || $(options.imageBox),
            obj =
            {
                state : {},
                ratio : 1,
                options : options,
                imageBox : el,
                thumbBox : el.find(options.thumbBox),
                spinner : el.find(options.spinner),
                image : new Image(),
                getDataURL: function ()
                {
                	 var canvas = document.createElement("canvas");
                	 canvas.width = 480;
                     canvas.height = 480;
                     var context = '' ; 
                     if (typeof window.G_vmlCanvasManager!="undefined") { 
                         canvas=window.G_vmlCanvasManager.initElement(canvas);
                         context=canvas.getContext("2d");
                     }else {
                    	 context=canvas.getContext("2d");
                     }
                    //var context = canvas.getContext("2d");
                    //context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    context.drawImage(this.image, 0, 0, 480, 480);
                    var imageData = canvas.toDataURL('image/png');
//                    //var imageData2 = context.getImageData(0, 0, 1024, 768) ; 
//                    if(imageData == imageData2){
//                    	alert(11) ; 
//                    }
                    return imageData;
                },
                getBlob: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function ()
                {
                    this.ratio*=1.1;
                    setBackground();
                },
                zoomOut: function ()
                {
                    this.ratio*=0.9;
                    setBackground();
                }
            },
            setBackground = function()
            {
                var w =  parseInt(obj.image.width)*obj.ratio;
                var h =  parseInt(obj.image.height)*obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown = function(e)
            {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function(e)
            {
                e.stopImmediatePropagation();

                if (obj.state.dragable)
                {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.css('background-position', bgX +'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function(e)
            {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground();
            }

        obj.spinner.show();
        obj.image.onload = function() {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

        return obj;
    };

    jQuery.fn.cropbox = function(options){
        return new cropbox(options, this);
    };
}));

/*www.jq22.com*/
