/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					// Close.
					var $closeBtn = $('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function(e) {
							// CUSTOM FIX: Smart Navigation
							// 1. If we are inside the 'Poem' article AND a specific poem is open...
							if ($this.attr('id') === 'poem' && $('#poem .poem.active').length > 0) {
								e.preventDefault();
								e.stopPropagation(); // Stop it from closing the whole page
								
								// Go back to the archive list
								$('.poem').removeClass('active').addClass('hidden');
								$('#poem-list').removeClass('hidden').addClass('active').hide().fadeIn(300);
								window.scrollTo(0, 0);
							} 
							// 2. Otherwise, behave normally (Close the article)
							else {
								location.hash = '';
							}
						});
				
				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
    // ==================================================
    // CUSTOM: Pluto & Dwarf Stars + Poem Navigation
    // ==================================================

    var $plutoModal = $('#pluto-modal'),
        $dwarfStars = $('#dwarf-stars');

    // 1. Open Pluto Modal
    $('#pluto-btn').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $plutoModal.removeClass('hidden').css('display', 'flex');
    });

    // 2. Modal "Yes" -> Open Dwarf Stars
    $('#pluto-yes').on('click', function(e) {
        e.stopPropagation();
        $plutoModal.addClass('hidden').css('display', 'none');
        $dwarfStars.removeClass('hidden').css('display', 'block');
    });

    // 3. Modal "No" -> Close Modal
    $('#pluto-no').on('click', function(e) {
        e.stopPropagation();
        $plutoModal.addClass('hidden').css('display', 'none');
    });

    // 4. Close Dwarf Stars Page (Handles click on the button OR the 'x')
    $(document).on('click', '.close-dwarf-stars', function(e) {
		e.stopPropagation();
		$('#dwarf-stars').addClass('hidden').fadeOut(300);
	});
	
    // 5. Prevent clicks inside modals/stars from closing article
    $('.modal-content, .dwarf-header, .starfield').on('click', function(e) {
        e.stopPropagation();
    });

    // 6. Handle Star Clicks
    $('.star-wrapper').on('click', function(e) {
        e.stopPropagation();
    });

    // 7. Poem Navigation
    $('.button-nav, .text-link').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        var targetId = $(this).data('target');
        var $currentSection = $(this).closest('.poem-welcome, .poem-list, .poem');
        var $targetSection = $('#' + targetId);

        if($currentSection.length && $targetSection.length) {
            $currentSection.removeClass('active').addClass('hidden');
            $targetSection.removeClass('hidden').addClass('active');
        }
    });

    // 8. THE KEY FIX: Reset poem when opening from menu
    // This listens for when you click "Poems" in the main navigation
    $('a[href="#poem"]').on('click', function() {
        // Wait a tiny bit for the article to open
        setTimeout(function() {
            // Force everything back to the welcome screen
            $('#poem-list, .poem').removeClass('active').addClass('hidden');
            $('#poem-welcome').removeClass('hidden').addClass('active');
        }, 50); // 50 milliseconds = 0.05 seconds
    });

    // Also reset when closing the article
    $('#main').on('click', '.close', function(e) {
        var $article = $(this).closest('article');
        
        if ($article.attr('id') === 'poem') {
            setTimeout(function() {
                $('#poem-list, .poem').removeClass('active').addClass('hidden');
                $('#poem-welcome').removeClass('hidden').addClass('active');
            }, 350);
        }
    });

    // Reset when clicking background to close
    $('#main').on('click', function(e) {
        if ($(e.target).is('#main')) {
            setTimeout(function() {
                $('#poem-list, .poem').removeClass('active').addClass('hidden');
                $('#poem-welcome').removeClass('hidden').addClass('active');
            }, 350);
        }
    });

    // 9. ESC Key Safety
    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            if (!$dwarfStars.hasClass('hidden')) {
                $dwarfStars.addClass('hidden');
            }
            if (!$plutoModal.hasClass('hidden')) {
                $plutoModal.addClass('hidden');
            }
        }
    });


$(document).ready(function() {
    
    // Smooth transition function
    function switchSection($current, $next) {
        // 1. Get the natural height of the NEXT section
        // We clone it, make it invisible, check height, then destroy it.
        var $clone = $next.clone().css({
            'display': 'block', 
            'visibility': 'hidden', 
            'position': 'absolute', 
            'width': $current.width()
        }).appendTo($current.parent());
        
        var newHeight = $clone.outerHeight();
        $clone.remove();

        // 2. Fade out current
        $current.fadeOut(300, function() {
            $current.removeClass('active').addClass('hidden');
            
            // 3. Fade in next
            $next.removeClass('hidden').css('display', 'none').fadeIn(400, function(){
                 $next.addClass('active');
            });
        });
    }

    // 1. Enter Poem from Card
    $('.star-card').on('click', function() {
        var target = $(this).attr('data-target');
        var $current = $('#poem-list');
        var $next = $('#' + target);
        switchSection($current, $next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 2. BACK TO ARCHIVE
    $('.back-to-archive').on('click', function(e) {
        e.preventDefault();
        var $current = $(this).closest('.poem');
        var $next = $('#poem-list');
        switchSection($current, $next);
    });

    // 3. PREVIOUS & NEXT POEM
    $('.next-poem, .prev-poem').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        var $current = $(this).closest('.poem');
        var $next = $('#' + target);
        switchSection($current, $next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Create a "Return to Stars" button dynamically
$(document).ready(function() {
    var $btn = $('<div id="backToTop"><i class="fas fa-chevron-up"></i></div>').appendTo('body');
    
    $btn.css({
        'position': 'fixed', 'bottom': '20px', 'right': '20px',
        'width': '50px', 'height': '50px', 'background': '#ff3b9d',
        'color': '#fff', 'border-radius': '50%', 'display': 'none',
        'align-items': 'center', 'justify-content': 'center',
        'cursor': 'pointer', 'z-index': '2000', 'box-shadow': '0 0 15px rgba(255,59,157,0.5)'
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) { $btn.fadeIn().css('display', 'flex'); }
        else { $btn.fadeOut(); }
    });

   // UPDATED Back to Top Logic
    $btn.on('click', function(e) {
        e.preventDefault();    // Stop any default link behavior
        e.stopPropagation();   // Stop the click from reaching the background (This fixes the redirect issue!)
        
        $('html, body').animate({scrollTop: 0}, 800);
    });
});

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
 
$(window).on('keydown', function(event) {
    // Only handle keys when an article is visible
    if (!$body.hasClass('is-article-visible')) {
        return;
    }
    
    var $activeArticle = $main_articles.filter('.active');
    
    // ESC key - Close article (CRITICAL escape route)
    if (event.keyCode === 27 && $activeArticle.length > 0) {
        $main._hide($activeArticle.attr('id'));
        event.preventDefault();
        
        // IMPROVED: Return focus to the nav link that opened it
        var articleId = $activeArticle.attr('id');
        $('#nav a[href="#' + articleId + '"]').focus();
        return;
    }
    
    // Arrow keys - Navigate between articles (optional feature)
    // LEFT arrow or UP arrow - Previous article
    if (event.keyCode === 37 || event.keyCode === 38) {
        navigateArticle('prev');
        event.preventDefault();
    }
    
    // RIGHT arrow or DOWN arrow - Next article  
    if (event.keyCode === 39 || event.keyCode === 40) {
        navigateArticle('next');
        event.preventDefault();
    }
});
 
// ==========================================
// ARTICLE NAVIGATION HELPER
// ==========================================
 
function navigateArticle(direction) {
    var $activeArticle = $main_articles.filter('.active');
    
    if ($activeArticle.length === 0) {
        return;
    }
    
    var articles = [];
    $main_articles.each(function() {
        if ($(this).attr('id') !== undefined) {
            articles.push($(this).attr('id'));
        }
    });
    
    var currentIndex = articles.indexOf($activeArticle.attr('id'));
    var nextIndex;
    
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % articles.length;
    } else {
        nextIndex = (currentIndex - 1 + articles.length) % articles.length;
    }
    
    // IMPROVED: Interruptible transition
    $main._hide($activeArticle.attr('id'), true); // Pass flag for immediate close
    
    setTimeout(function() {
        $main._show(articles[nextIndex]);
    }, 300); // Match animation duration
}
 
// ==========================================
// SCROLL DETECTION
// Hide scroll hint when user scrolls
// ==========================================
 
$main_articles.each(function() {
    var $article = $(this);
    var scrollTimeout;
    
    $article.on('scroll', function() {
        // IMPROVED: Debounced scroll detection
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(function() {
            if ($article.scrollTop() > 50) {
                $article.addClass('scrolled');
            } else {
                $article.removeClass('scrolled');
            }
        }, 100); // Debounce by 100ms
    });
});
 
// ==========================================
// MOBILE TOUCH SWIPE DETECTION
// Swipe down from top to close
// ==========================================
 
var touchStartY = 0;
var touchEndY = 0;
var touchStartX = 0;
var touchEndX = 0;
 
$main_articles.on('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
    touchStartX = e.changedTouches[0].screenX;
});
 
$main_articles.on('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});
 
function handleSwipe() {
    var $activeArticle = $main_articles.filter('.active');
    
    // Only close if at the top of the article (no scroll position)
    if ($activeArticle.scrollTop() !== 0) {
        return;
    }
    
    var verticalDiff = touchEndY - touchStartY;
    var horizontalDiff = Math.abs(touchEndX - touchStartX);
    
    // IMPROVED: Prevent gesture conflicts
    // Only register as swipe-down if:
    // 1. Vertical movement > 100px
    // 2. Vertical movement > horizontal movement (avoid diagonal swipes)
    if (verticalDiff > 100 && verticalDiff > horizontalDiff) {
        if ($activeArticle.length > 0) {
            $main._hide($activeArticle.attr('id'));
        }
    }
}
 
// ==========================================
// SCROLL TO TOP WHEN ARTICLE OPENS
// ==========================================
 
$main_articles.each(function() {
    var $article = $(this);
    
    // IMPROVED: Use MutationObserver for better performance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if ($article.hasClass('active')) {
                    // Immediate scroll to top
                    $article.scrollTop(0);
                    $article.removeClass('scrolled');
                    
                    // IMPROVED: Focus management for accessibility
                    // Set focus to the article for screen readers
                    setTimeout(function() {
                        $article.attr('tabindex', '-1').focus();
                    }, 100); // After animation settles
                }
            }
        });
    });
    
    observer.observe($article[0], {
        attributes: true,
        attributeFilter: ['class']
    });
});
 
// ==========================================
// IMPROVED SHOW/HIDE FUNCTIONS
// With better body scroll management
// ==========================================
 
// Wrap the original _show function
$main._show = (function() {
    var cached_function = $main._show;
    
    return function(id, initial) {
        cached_function.apply(this, arguments);
        
        // IMPROVED: Prevent body scroll (better cross-browser)
        $('body').css({
            'overflow': 'hidden',
            'position': 'fixed',
            'width': '100%',
            'height': '100%'
        });
        
        // IMPROVED: Trap focus within article for keyboard users
        trapFocus($main_articles.filter('#' + id));
    };
})();
 
// Wrap the original _hide function
$main._hide = (function() {
    var cached_function = $main._hide;
    
    return function(id, immediate) {
        cached_function.apply(this, arguments);
        
        // IMPROVED: Restore body scroll (remove all restrictions)
        $('body').css({
            'overflow': '',
            'position': '',
            'width': '',
            'height': ''
        });
        
        // IMPROVED: Release focus trap
        releaseFocus();
    };
})();
 
// ==========================================
// FOCUS TRAP FOR ACCESSIBILITY
// Keep keyboard focus within active article
// ==========================================
 
var focusableElementsSelector = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
var firstFocusableElement;
var lastFocusableElement;
 
function trapFocus($article) {
    var focusableElements = $article.find(focusableElementsSelector).filter(':visible');
    
    if (focusableElements.length === 0) {
        return;
    }
    
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    // Listen for tab key
    $article.on('keydown.focustrap', function(e) {
        if (e.key === 'Tab' || e.keyCode === 9) {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}
 
function releaseFocus() {
    $main_articles.off('keydown.focustrap');
}
 
// ==========================================
// TOUCH FEEDBACK (100ms response time)
// ==========================================
 
$main_articles.on('touchstart', '.close', function() {
    // IMPROVED: Immediate visual feedback (<100ms)
    $(this).css('transform', 'scale(0.95)');
});
 
$main_articles.on('touchend touchcancel', '.close', function() {
    $(this).css('transform', '');
});
 
/* ==========================================
   OPTIONAL: ARTICLE PROGRESS INDICATOR
   Uncomment this section if you want a progress
   bar at the top showing scroll position
   ========================================== */
 
/*
// Create progress bar element
$('<div id="article-progress"></div>').appendTo('body');
 
// Style it with CSS
$('head').append(`
    <style>
        #article-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, rgba(255, 59, 157, 0.8), rgba(255, 59, 157, 1));
            z-index: 10002;
            transition: width 0.1s ease;
            display: none;
        }
        
        body.is-article-visible #article-progress {
            display: block;
        }
    </style>
`);
 
// IMPROVED: Throttled scroll updates for better performance
var progressUpdateTimeout;
 
$main_articles.on('scroll', function() {
    var $this = $(this);
    
    // Throttle updates to ~60fps
    if (!progressUpdateTimeout) {
        progressUpdateTimeout = setTimeout(function() {
            requestAnimationFrame(function() {
                var scrollTop = $this.scrollTop();
                var scrollHeight = $this[0].scrollHeight - $this.height();
                var progress = (scrollTop / scrollHeight) * 100;
                
                $('#article-progress').css('width', Math.min(progress, 100) + '%');
                
                progressUpdateTimeout = null;
            });
        }, 16); // ~60fps
    }
});
 
// Reset progress when article closes
$main._hide = (function() {
    var cached_function = $main._hide;
    
    return function(id) {
        cached_function.apply(this, arguments);
        $('#article-progress').css('width', '0%');
        $('body').css({
            'overflow': '',
            'position': '',
            'width': '',
            'height': ''
        });
        releaseFocus();
    };
})();
*/
})(jQuery);  

































