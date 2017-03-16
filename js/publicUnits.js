;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery, window, document);
    }
}(function($, window, document, undefined){

    //判断数组函数
    function isArray(obj){
        return obj && typeof obj==='object' && Array == obj.constructor;
    }

    function udgeDisplay(obj){
        switch (obj){
            case 'table':
                return 'table';
                break;
            case 'table-cell':
                return 'table-cell';
                break;
            case 'inline-block':
                return 'inline-block';
                break;
            default:
                return 'block';
        }
    }

    //简单获取、设置cookie
    $.fn.cookie = function(name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };

    //个人中心拉伸
    $.fn.showPerson = function(options){
        var opts = $.extend({}, {
            btn: '.user-block',
            content: '.public-info'
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $btn = $this.find(opts.btn);
            var $content = $this.find(opts.content);

            $btn.on('click', function(ev){
                ev.stopPropagation();
                $content.slideToggle('fast');
                $(document).on('click', function(){
                    $content.slideUp('fast');
                });
            });
        });
    }

    //通用选项卡功能
    $.fn.showTabs = function(options){
        var opts = $.extend({}, {
            title: '.public-tab-title',
            content: '.public-tab-list',
            initialize: true
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $title = $this.find(opts.title);
            var $content = $this.find(opts.content);
            var display = udgeDisplay($content.css('display'));
            if(opts.initialize){
                $title.removeClass('cur');
                $content.css('display', 'none');
                $title.eq(0).addClass('cur');
                $content.eq(0).css('display', display);
            }

            $this.on('click', opts.title, function(ev){
                var that = $(this);
                $title.removeClass('cur');
                $content.css('display', 'none');
                $title.eq(that.index()).addClass('cur');
                $content.eq(that.index()).css('display', display);
            });
        });
    }

    //通用checkbox全选功能
    $.fn.checkboxAll = function(ele){
        return this.each(function(){
            var $this = $(this);
            var $ele = $(ele);
            var swit = false;
            $this.on('click', function(){
                swit = $this.prop('checked');
                if(swit){
                    $ele.each(function(){
                        var that = $(this);
                        if(!that.prop('checked')){
                            that.trigger('click');
                        }
                        
                    });
                    swit = true;
                }else{
                    $ele.each(function(){
                        var that = $(this);
                        if(that.prop('checked')){
                            that.trigger('click');
                        }
                    });
                    swit = false;
                }
            });
        });
    }

    //通用select下拉样式
    $.fn.changeSelect = function(options){
        var opts = $.extend({}, {
            style: '',
            width: '',
            height: '',
        }, options);
        return this.each(function(){
            var $this = $(this);            
            if(!$this.hasClass('also-has-change')) {
                $this.addClass('also-has-change');
                var defaultWidth = $this.innerWidth();
                var defaultHeight = $this.innerHeight();
                var $options = $this.find('option');
                var $selectBlock = $('<div class="public-select "'+opts.style+'></div>');
                var $selectText = $('<div class="select-text"></div>');
                var $selectInput = $('<div class="select-input"></div>');
                var $selectBtn = $('<div class="select-btn"></div>');
                var $selectOptions = $('<ul class="select-options"></ul>');
                var $selectOptionLi = '',
                    initText = '';
                var selectBtnWidth, selectInputPadding;

                $selectInput.text($options.eq(0).text());
                $options.each(function(index){
                    var that = $(this);
                    $selectOptionLi += '<li>'+that.text()+'</li>';
                    if(that.prop('selected')){
                        initText = that.text()
                        $selectInput.text(initText);
                    }
                });

                $selectText.append($selectInput).append($selectBtn);
                $selectOptions.html($selectOptionLi);
                $selectBlock.append($selectText);
                $selectBlock.append($selectOptions);
                $this.after($selectBlock);

                if(opts.width != '') {
                    defaultWidth = opts.width;
                }
                if(opts.height != '') {
                    defaultHeight = opts.height;
                }
                $selectBlock.css({'width': defaultWidth, 'height': defaultHeight});

                defaultHeight = $selectBlock.innerHeight();
                selectBtnWidth = $selectBtn.innerWidth();
                selectInputPadding = parseInt($selectInput.css('paddingLeft')) + parseInt($selectInput.css('paddingRight'));

                $selectText.css({'height': defaultHeight + 'px'});
                $selectInput.css({'height': defaultHeight + 'px', 'line-height': defaultHeight + 'px'});
                $selectBtn.css('height', defaultHeight + 'px');
                $selectOptions.css({'top': ( defaultHeight + 2 ) + 'px', 'display': 'none'});

                
                $selectText.on('click', function(ev){
                    ev.stopPropagation();
                    if(!$this.attr('disabled')) {
                        $selectOptions.toggle();
                        $(document).on('click', function(){
                            $selectOptions.hide();
                        });
                    }
                });
                $selectOptions.on('click', 'li', function(){
                    var that = $(this);
                    if(initText != that.text()){
                        initText = that.text();
                        $selectInput.text(initText);
                        $options.prop('selected', false);
                        $options.eq(that.index()).prop('selected', true);
                        $this.trigger('change');
                    }
                });
                

                $this.change(function(){
                    var that = $(this);
                    initText = that.find('option:selected').text();
                    $selectInput.text(initText);
                });
                $this.css('display', 'none');
            }
        });
    }

    //通用checkbox多选框样式
    $.fn.changeCheckbox = function(options){
        var opts = $.extend({}, {
            style: ''
        }, options);
        return this.each(function(){
            var $this = $(this);
            var swit = false;
            var defaultWidth = $this.innerWidth();
            var defaultDisplay = $this.css('display');
            var $checkbox = $('<div class="public-checkbox"></div>');
            if(defaultWidth == 0){
                defaultWidth = 13;
            }
            if(defaultDisplay == 'inline') defaultDisplay = 'inline-block'
            $this.wrap($checkbox);
            $checkbox = $this.parent();
            $checkbox.css({
                'display': defaultDisplay,
                'width': defaultWidth + 'px',
                'height': defaultWidth + 'px',
                'line-height': defaultWidth + 'px',
                'overflow': 'hidden'
            });
            if($this.prop('checked')){
                $checkbox.addClass('public-checkbox-choose');
            }
            $this.on('change', function(){
                console.log('aaa');
                swit = $this.prop('checked');
                if(!swit){
                    $checkbox.removeClass('public-checkbox-choose');
                }else{
                    $checkbox.addClass('public-checkbox-choose');
                }
                
            });
            $this.css({'opacity': 0, 'margin': 0});
        });
    }

    //通用单选radio样式框
    $.fn.changeRadio = function(options){
        var ops = $.extend({}, {
            initSrc: 'images/publicUnits/public-radio-icon.png',
            curSrc: 'images/publicUnits/public-radio-cur.png',
            style: ''
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $ele = $('<img src="'+ops.initSrc+'">');
            var thisName = $this.attr('name');
            var eleDisplay = $this.css('display');
            var eleWidth = $this.width();
            var eleHeight = $this.height();

            var $radio = $('<div class="public-radio '+ops.style+'"></div>');
            $radio.css({'display': eleDisplay, 'position': 'relative','width': eleWidth + 'px', 'height': eleHeight + 'px'});
            $this.wrap($radio);
            $this.before($ele);
            $this.css({'position': 'absolute', 'top': 0, 'zIndex': '3', 'opacity': 0});
            $ele.css({'position': 'absolute', 'top': 0, 'left': 0, 'width': '100%', 'zIndex': '1'});

            if($this.attr('checked')) {
                $('input[name="'+thisName+'"]').siblings('img').attr('src', ops.initSrc);
                $this.siblings('img').attr('src', ops.curSrc);
            }

            $this.on('click', function(){
                $('input[name="'+thisName+'"]').siblings('img').attr('src', ops.initSrc);
                $this.siblings('img').attr('src', ops.curSrc);
            });
        });
    }

    //通用左右滚动查看
    $.fn.aroundRoll = function(options){
        var ops = $.extend({}, {
            leftBtn: '.public-roll-left',
            rightBtn: '.public-roll-right',
            mask: '.public-roll-mask',
            content: 'ul',
            contentList: 'li',
            style: '',
            adapt: false
        }, options);
        //    左按钮   右按钮，内容浮动的ul，内容单个li，  ul的宽度，总容器的宽度。
        //n->li的个数，k->li隐藏的个数，j->已经滚动的个数。
        var $leftBtn, $rightBtn, $content, $contentList, contentWidth, thisWidth, n, k, j = 0 ;
        var contentLeft = 0;
        var $safeLayer = $('<div class="safe-layer"></div>');
        $safeLayer.css({'position': 'relative', 'width': '100%', 'height': 'auto'});

        //初始化
        function init(eleW, eleH){
            contentWidth = eleW * n;
            k = Math.round((contentWidth - thisWidth) / eleW);
            $mask.css({'height': '100%', 'overflow': 'hidden'});
            $contentList.css({'width': eleW + 'px'});
            $content.css({'width': contentWidth + 'px', 'height': '100%'});
        }

        function play(left){
            contentWidth = left * n;
            $rightBtn.off('click');
            $leftBtn.off('click');
            $rightBtn.on('click', function(){
                j++;
               contentLeft = -(j * left);
                if(contentLeft + contentWidth < thisWidth){
                    contentLeft = thisWidth - contentWidth;
                    j = k;
                }
                $content.stop().animate({
                    'marginLeft': contentLeft + 'px'
                }, 'fast');
            });
            $leftBtn.on('click', function(){
                j--;
                contentLeft = -(j * left);
                if(contentLeft >= 0){
                    j = 0;
                    contentLeft = 0
                }
                $content.stop().animate({
                    'marginLeft': contentLeft + 'px'
                }, 'fast');
            });
        }

        return this.each(function(){
            var $this = $(this);
            $this.html($safeLayer.addClass(ops.style).append($this.html()));
            $leftBtn = $this.find(ops.leftBtn);
            $rightBtn = $this.find(ops.rightBtn);
            $mask = $this.find(ops.mask);
            $content = $this.find(ops.content);
            $contentList = $this.find(ops.contentList);
            n = $contentList.length;
            thisWidth = $this.width();
            var listWidth = $contentList.eq(0).outerWidth(true);
            var listHeight = $contentList.eq(0).outerHeight(true);
            var m, newListW;

            if(!ops.adapt){
                newListW = listWidth;
                init(newListW, listHeight);
                play(newListW);
            }else{
                m =  listWidth / thisWidth;
                newListW = parseInt(m * thisWidth);

                //初始化
                init(newListW, listHeight);
                play(newListW);
                $(window).resize(function(){
                    thisWidth = $this.width();
                    newListW = parseInt(m * thisWidth);
                    listHeight = $contentList.eq(0).outerHeight(true);
                    init(newListW, listHeight);
                    play(newListW);
                });
            }
        });
    }

    //逐条向上滚动公告栏
    $.fn.noticer = function(options){
        var ops = $.extend({}, {
            playEle: 'ul',      //整体滚动对象
            showEle: 'li',      //展示对象
            playTime: 4000,    //滚动间隔
            speed: 'fast',   //滚动速度
            prevBtn: '.prev-btn',
            nextBtn: '.next-btn'
        }, options);

        function reChange(positon, num){
            var json = {};
            if(positon == 'absolute' || positon == 'fixed'){
                json.top = num;
            }else{
                json.marginTop = num;
            }
            return json;
        }

        return this.each(function(){
            var $this = $(this);
            var $playEle = $this.find(ops.playEle);
            var $showEle = $this.find(ops.showEle);
            var positon = $playEle.css('position');
            var start = $playEle.position().top;
            var length = $showEle.length;
            var height = $showEle.eq(0).outerHeight(true);
            var $prevBtn = $this.find(ops.prevBtn);
            var $nextBtn = $this.find(ops.nextBtn);
            var range = start;
            var n = 0;
            var timer = null;

            function play(){
                if(n >= (length -1) ) {
                    n = -1;
                    range = start;
                }else{
                    range += height;
                }
                ele = reChange(positon, -range + 'px');
                $playEle.animate(ele, ops.speed);
                n++;
            }

            if(length > 1){
                var ele = reChange(positon, -range + 'px');
                clearInterval(timer);
                timer = setInterval(function(){
                    play();
                }, ops.playTime);

                $this.hover(function(){
                    clearInterval(timer);
                }, function(){
                    timer = setInterval(function(){
                        play();
                    }, ops.playTime);
                });

                $prevBtn.on('click', function(){
                    n = n - 1;
                    play();
                });
                $nextBtn.on('click', function(){
                    n = n + 1;
                    play();
                });
            }
        });
    }
}));