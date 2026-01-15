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
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
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

	/* --- IMPROVED POEM NAVIGATION --- */
$(document).ready(function() {
    
    // 1. CLICKING A STAR CARD (To see the poem)
    $('.star-card').on('click', function(e) {
        var targetId = $(this).attr('data-target'); // gets 'poem-1'
        
        $('#poem-list').fadeOut(200, function() {
            $(this).addClass('hidden').removeClass('active');
            $('#' + targetId).fadeIn(300).removeClass('hidden').addClass('active');
        });
    });

    // 2. CLICKING BACK TO ARCHIVE (To see the Grid again)
    $('.back.button-nav').on('click', function(e) {
        var targetId = $(this).attr('data-target'); // gets 'poem-list'
        var $currentPoem = $(this).closest('.poem');

        $currentPoem.fadeOut(200, function() {
            $currentPoem.addClass('hidden').removeClass('active');
            $('#' + targetId).fadeIn(300).removeClass('hidden').addClass('active');
        });
    });

    // 3. NEXT POEM BUTTON
    $('.next-poem').on('click', function(e) {
        var targetId = $(this).attr('data-target');
        var $currentPoem = $(this).closest('.poem');

        $currentPoem.fadeOut(200, function() {
            $currentPoem.addClass('hidden').removeClass('active');
            $('#' + targetId).fadeIn(300).removeClass('hidden').addClass('active');
        });
    });
});
$(document).ready(function() {
	
    // 1. Enter Poem from Star Card
    $('.star-card').on('click', function() {
        var target = $(this).attr('data-target');
        $('#poem-list').fadeOut(200, function() {
            $(this).addClass('hidden');
            $('#' + target).fadeIn(300).removeClass('hidden');
        });
    });

    // 2. Back to Archive Button
    $('.back.button-nav').on('click', function() {
        var $currentPoem = $(this).closest('.poem');
        $currentPoem.fadeOut(200, function() {
            $(this).addClass('hidden');
            $('#poem-list').fadeIn(300).removeClass('hidden');
        });
    });

    // 3. Next Poem Button
    $('.next-poem').on('click', function() {
        var target = $(this).attr('data-target');
        var $currentPoem = $(this).closest('.poem');
        $currentPoem.fadeOut(200, function() {
            $(this).addClass('hidden');
            $('#' + target).fadeIn(300).removeClass('hidden');
        });
    });

    // 4. Reset logic when closing the main article
    $('.close').on('click', function() {
        // When user clicks 'X', reset the poem section to show the list next time
        setTimeout(function() {
            $('.poem').addClass('hidden');
            $('#poem-list').removeClass('hidden').show();
        }, 500);
    });
});
  
})(jQuery);  
























