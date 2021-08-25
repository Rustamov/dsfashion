svg4everybody(); //for svg spite in ie
objectFitImages();

let $body,
    wWidth = 0,
    wHeight = 0,
    W_SM = 576,
    W_MD = 768,
    W_LG = 992,
    W_XL = 1200,
    LOADER_HTML =
        '<div class="overlay-loader"><div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';

$(document).ready(function () {
    $body = $("body");
    wWidth =  $(window).width();

    $(window).on('resize', function() {
      wWidth =  $(window).width();
    });

    mobileMenu ();
    formScript();
    item();
    othersScript();
    map();
    stickScript();


    function mobileMenu () {
        let mobileNav = $('.mobile-menu'),
            mobileNavIsOpen = mobileNav.hasClass('open'),
            openClass = 'mobile-menu-open',
            opening = false,
            transitionTime = 300,
            timeout;

        $body.on('click touch', '.js-mobile-menu-trigger', function (e) {
            e.preventDefault();
            console.log(opening);

            navToggle();
        });

        $body.on('keydown', function(e) {
            if ( !opening && mobileNavIsOpen && (e.keyCode  === 27)) { // escape key maps to keycode '27'
                navToggle()
            };
        });

        function navToggle() {
            console.log(opening);
            if ( opening ) {
                return 
            }
        
            opening = true;

            mobileNavIsOpen = mobileNav.hasClass('open');

            mobileNav.toggleClass('open', !mobileNavIsOpen);


            if (!mobileNavIsOpen) {
                window.globalOptions.freeze(true); //true is scroll to top page 
                $body.toggleClass(openClass, true); // aa
            }
        
            if ( timeout ) {
                clearTimeout(timeout)
            }

            timeout = setTimeout(function() {
                mobileNavIsOpen = mobileNav.hasClass('open');

                if (!mobileNavIsOpen) {
                    $body.toggleClass(openClass, false);
                    window.globalOptions.unfreeze();
                }
                opening = false;
            }, transitionTime)
        };       
    }

    function formScript () {

        $('[type=tel]').mask('+7 (000) 000-00-00');

        Parsley
            .addValidator('ruPhone', {
                // string | number | integer | date | regexp | boolean
                requirementType: 'string',

                // validateString | validateDate | validateMultiple
                validateString: function (value, requirement) {
                    let regexp = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                    
                    return  regexp.test(value) 
                },

                messages: {
                    ru: 'Неверный формат номера',
                    en: 'Invalid number format'
                }
            })
            .addValidator('personName', {
                // string | number | integer | date | regexp | boolean
                requirementType: 'string',

                // validateString | validateDate | validateMultiple
                validateString: function (value, requirement) {
                    let regexp = /^[а-яА-ЯёЁa-zA-Z\ ]+$/;

                    return  regexp.test(value) 
                },

                messages: {
                  ru: 'Используйте только буквы',
                  en: 'Use only letters'
                }
            })
            .addMessages('ru', {
                defaultMessage: "Некорректное значение.",
                type: {
                    email:        "Введите правильный е-mail",
                    url:          "Введите URL адрес",
                    number:       "Введите число",
                    integer:      "Введите целое число",
                    digits:       "Введите только цифры",
                    alphanum:     "Введите буквенно-цифровое значение"
                },
                notblank:       "Это поле должно быть заполнено",
                required:       "Поле обязательно для заполнения",
                pattern:        "Это значение некорректно",
                min:            "Это значение должно быть не менее чем %s",
                max:            "Это значение должно быть не более чем %s",
                range:          "Это значение должно быть от %s до %s",
                minlength:      "Это значение должно содержать не менее %s символов",
                maxlength:      "Это значение должно содержать не более %s символов",
                length:         "Это значение должно содержать от %s до %s символов",
                mincheck:       "Выберите не менее %s значений",
                maxcheck:       "Выберите не более %s значений",
                check:          "Выберите от %s до %s значений",
                equalto:        "Это значение должно совпадать"
            })
            .setLocale('ru');

        $('.js-validate').parsley({

        });


        $body.on('focusin', '.input-text input, .input-text textarea', function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.addClass('input-text--dirty');
        });

        $body.on('focusout', '.input-text input, .input-text textarea', function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.toggleClass('input-text--dirty', input.val() !== '');
        });

        $('.input-text input, .input-text textarea').each(function() {
            let input = $(this),
                wrap = input.closest('.input-text');

            wrap.toggleClass('input-text--dirty', input.val() !== '')
        });

    }

    function item() {
        // if ( wWidth > window.globalOptions.sizes.lg ) {

        //     $('.item__big-image').each(function() {
        //         let zoomImageUrl = $(this).attr('href')
                
        //         $(this).zoom({
        //             url: zoomImageUrl
        //         });
        //     });
        // }

        $('.item__big-image').each(function() {
            let zoomImageUrl = $(this).attr('href')
            
            $(this).magnify({
                src: zoomImageUrl
            });
        });

       
        if ( $('.item__big-slider-item').length <= 1 || $('.item__small-slider-item').length <= 1 ) {
           
        }
        let isInfinite = $('.item__big-slider-item').length >= 3;

        $('.js-item-big-slider').slick({
            infinite: isInfinite,
            adaptiveHeight: false,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            fade: true,
            nextArrow: $('.js-item-slider-next'),
            prevArrow: $('.js-item-slider-prev'),
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.js-item-small-slider'
        });

        $('.js-item-small-slider').slick({
            variableWidth: true,
            infinite: isInfinite,
            adaptiveHeight: false,
            arrows: false,
            draggable: false,
            asNavFor: '.js-item-big-slider'
        });

        $body.on('click', '.item__small-slider-item.slick-slide', function() {
            $('.js-item-big-slider').slick('slickGoTo', $(this).data('slick-index'));
        });

        $body.on('click', '.item__big-slider-item.slick-slide .magnify', function() {
            window.globalOptions.galleryOpen($(this).find('.item__big-image'));
            
        });

    }

    function othersScript() {
        $body.on('click touch', '[data-go-link]', function (e) {
            e.preventDefault();
            window.open($(this).data('go-link'));
        });

        $('.back-to-top').click(function(event) {
            $('body,html').animate({scrollTop:0},300);
          });
        
        $(window).scroll(function() {
            var scrollTop = $(window).scrollTop();
        
            if ( scrollTop > 300 ) {
              $('.back-to-top').addClass('show');
            } else {
              $('.back-to-top').removeClass('show');
            };
        
        });

        $.fancybox.defaults.hash = false;
        $('.js-popup').fancybox({});

        var selector = ':not(.slick-cloned) [data-fancybox]';

            // $().fancybox({
            //     selector : selector,
            //     // backFocus : false
            // });


        $body.on('click touch', '.js-form-resset', function(e) {
            let form = $(this).closest('form');

            form.removeClass('is-form-sent');
            window.globalOptions.formResset(form);
        });

        $body.on('click touch', '.slick-slide [data-fancybox]', function(e) {
            e.preventDefault();
            console.log(11);
            window.globalOptions.galleryOpen($(this));           

        });


        if ( $('.js-category-block-slider').length > 0 ) {
            $('.js-category-block-slider').slick({
                // centerMode: true,
                // variableWidth: true,
                infinite: false,
                adaptiveHeight: false,
                nextArrow: $('.js-category-block-slider-next'),
                prevArrow: $('.js-category-block-slider-prev'),
                slidesToShow: 5,
                slidesToScroll: 5,
                responsive: [
                    {
                        breakpoint: window.globalOptions.sizes.lg,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.md,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.sm,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    }
                    // ,
                    // {
                    //     breakpoint: window.globalOptions.sizes.xs,
                    //     settings: {
                    //         slidesToShow: 1,
                    //         slidesToScroll: 1,
                    //     }
                    // }
                ]
            });
        }


        $('.items-block').each(function() {
            let wrap = $(this),
                slider = wrap.find('.js-items-slider'),
                nextBtn = wrap.find('.js-items-slider-next'),
                prevBtn = wrap.find('.js-items-slider-prev');

            slider.slick({
                // centerMode: true,
                // variableWidth: true,
                infinite: false,
                adaptiveHeight: false,
                nextArrow: nextBtn,
                prevArrow: prevBtn,
                slidesToShow: 4,
                slidesToScroll: 4,
                responsive: [
                    {
                        breakpoint: window.globalOptions.sizes.lg,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.md,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.sm,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    }
                    // ,
                    // {
                    //     breakpoint: window.globalOptions.sizes.xs,
                    //     settings: {
                    //         slidesToShow: 1,
                    //         slidesToScroll: 1,
                    //     }
                    // }
                ]
            }); 
        });

        $('.accompanying-items').each(function() {
            let wrap = $(this),
                slider = wrap.find('.js-items-slider'),
                nextBtn = wrap.find('.js-items-slider-next'),
                prevBtn = wrap.find('.js-items-slider-prev');

            slider.slick({
                // centerMode: true,
                // variableWidth: true,
                infinite: false,
                adaptiveHeight: false,
                nextArrow: nextBtn,
                prevArrow: prevBtn,
                slidesToShow: 6,
                slidesToScroll: 6,
                responsive: [
                    {
                        breakpoint: window.globalOptions.sizes.lg,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 6,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.md,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                        }
                    },
                    {
                        breakpoint: window.globalOptions.sizes.sm,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    }
                    // ,
                    // {
                    //     breakpoint: window.globalOptions.sizes.xs,
                    //     settings: {
                    //         slidesToShow: 1,
                    //         slidesToScroll: 1,
                    //     }
                    // }
                ]
            }); 
        });
        

        if ( $('.js-collection-slider').length > 0 ) {
            $('.js-collection-slider').slick({
                // centerMode: true,
                // variableWidth: true,
                infinite: false,
                adaptiveHeight: false,
                nextArrow: $('.js-collection-slider-next'),
                prevArrow: $('.js-collection-slider-prev'),
                slidesToShow: 1,
                slidesToScroll: 1
            });
        }

        
      

        $body.on('click touch', '.js-catalog-nav-item-toggle', function(e) {
            e.preventDefault();

            $(this).closest('.catalog-nav__item').toggleClass('is-open');
            $(document.body).trigger("sticky_kit:recalc");

            setTimeout(function() {
                $(document.body).trigger("sticky_kit:recalc");
            }, 200)
        });

    }

    function map() {
        if ( $('.js-map-yandex').length === 0) {
            return
        } else {
            $('.js-map-yandex').each(function() {
                initMap($(this));
            });
        };


        function initMap(el) {
            var mapWrap = el,
            mapPoints = mapWrap.find('.js-map-yandex-points'),
            mapArea = mapWrap.find('.js-map-yandex-area'),
            map;
      
      
            if (map == undefined && window.ymaps != undefined) {
                mapArea.html('');
                ymaps.ready(function() {
                    map = new ymaps.Map(mapArea[0], {
                        center: [+mapPoints.data('c-lat'), +mapPoints.data('c-long')],
                        zoom: +mapPoints.data('zoom'),
                        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
                    });
            
            
                    map.behaviors.disable('scrollZoom');
                    if ( wWidth < window.globalOptions.sizes.lg ) {
                        map.behaviors.disable('drag');
                    };
            
            
                    mapPoints.find('li').each(function () {
                        if ( $(this).data('lat') ) {
                            var $this = $(this),
                                lat = +$this.data('lat'),
                                lng = +$this.data('long'),
                                title = $this.data('title'),
                                pin = 'img/map-pin.png';
                
                            var placemark = new ymaps.Placemark(
                                [lat, lng], {
                                }, {
                                    iconLayout: 'default#image',
                                    iconImageHref: pin,
                                    iconImageSize: [49, 61],
                                    iconImageOffset: [-25, -61],
                                    hideIconOnBalloonOpen: false,
                                    balloonOffset: [3, -100]
                                });
                
                            map.geoObjects.add(placemark);
                        }
                    });
                });
            };
        }
      

    };


    function stickScript() {
        let stickOffset = 20,
            stikyTimeout = 0,
            $window = $(window);

        stickElements();

        $window.on('resize', function() {
            
            if (stikyTimeout) {
                clearTimeout(stikyTimeout);
            }

            stikyTimeout = setTimeout(function() {
                detachStickElements();
                stickElements();
            }, 500);

        });


        function stickElements() {
            if ($(window).width() > window.globalOptions.sizes.md) {
                $('.js-sticky-element').stick_in_parent({
                    parent: $('.js-sticky-parent'),
                    offset_top: stickOffset,
                        recalc_every: 10,
                });

            }
        };

        function detachStickElements() {
            try {
                $('.js-sticky-element').trigger("sticky_kit:detach");
            } catch (e) {
                console.error(e);
            };

        };



    };
        


});

window.globalOptions = {
    animationDuration: 200,
    sizes: {
        xl: 1920,
        lg: 1200,
        md: 992,
        sm: 768,
        xs: 576
    },

    freeze: function(scrollTop) {
        const h = $('html');

        if (h.css('position') !== 'fixed') {
            const top = scrollTop ? 0 : h.scrollTop() ? h.scrollTop() : $body.scrollTop();

            if (window.innerWidth > h.width()) {
                h.css('overflow-y', 'scroll');
            }

            h.css({
                width: '100%',
                position: 'fixed',
                top: -top,
            });
        }
    },

    unfreeze: function() {
        const h = $('html');

        if (h.css('position') === 'fixed') {
            h.css('position', 'static');

            $('html, body').scrollTop(-parseInt(h.css('top'), 10));

            h.css({
                position: '',
                width: '',
                top: '',
                'overflow-y': '',
            });
        }
    },

    scrollToId: function(href, delay) {
        let scrollOnMenuBtn = false,
            scrollOnHeaderHide = false,
            scrollSpeed = 800;


        if ( href == '#interior' 
            || href == '#magazines'
        ) {
            scrollOnMenuBtn = true;
        }


        setTimeout(function() {
            scrollTo();
        }, delay)

        function scrollTo() {

            let targetOffset = $(href).offset().top;

            // if ( wWidth >= W_MD && scrollOnMenuBtn ) {
            //     targetOffset -= $('.side-nav__trigger-icon-line--1').offset().top - $('.header').offset().top;
            // } else if (wWidth < W_MD && !scrollOnHeaderHide) {
            //     targetOffset -= $('.header').outerHeight();
            // }

            try {
                scrollSpeed = Math.abs($window.scrollTop() - targetOffset) / Math.abs($body[0].scrollHeight) * 4000
            } catch(event) {
                console.error(event);
            }

            scrollSpeed = ( scrollSpeed < 500 ) ? 500 : scrollSpeed;
     
            $('html, body').animate({ scrollTop: targetOffset }, scrollSpeed);

            location.replace(href);
            
        }
    },

    headerMenuClose: function() {
        $('.header-menu').removeClass('open');
        $body.removeClass('header-menu-open');
        this.unfreeze();
    },

    formResset: function(form) {
        if ( !form.length ) {
            return
        }
    
        $('.input-text input, .input-text textarea', form).each(function() {
            let input = $(this),
                wrap = input.closest('.input-text');
    
            input.val('').trigger('input');
    
            wrap.toggleClass('input-text--dirty', input.val() != '');
        });
    
        form.parsley().reset();
    
    },
    
    galleryOpen: function(item) {
        let clickItem = item,
            selector = '[data-fancybox=' + clickItem.data('fancybox') + ']';
    
        let imagesArr = [];

        $(selector).filter(function(index, item) {
            let currentItem = $(item);

            if (currentItem.is(clickItem)) {
                imagesArr.unshift(currentItem.attr('href'))
            } else if (!currentItem.closest('.slick-slide').hasClass('slick-cloned')) {
                imagesArr.push(currentItem.attr('href'))
            }

        });

        let fancyboxArr = [];
        
        imagesArr.forEach(function(item) {
            let obj = {};

            obj.src = item;

            fancyboxArr.push(obj);
        });

        $.fancybox.open(
            fancyboxArr,
            {
                type : 'image'
            }
        );
    }
    
    
};
