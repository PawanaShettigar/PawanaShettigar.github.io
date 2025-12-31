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

    // 4. Close Dwarf Stars Page
    $('.close-dwarf-stars').on('click', function(e) {
        e.stopPropagation();
        $dwarfStars.addClass('hidden').fadeOut(300);
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

})(jQuery);  // ← Don't delete this line! Just add code BEFORE it


})(jQuery);


/* 
   ==========================================================================
   CUSTOM POEM NAVIGATION (Robust Button Version)
   ==========================================================================
   This logic handles the internal navigation inside the "Poems" article.
   It works by listening for clicks on <button> elements with a "data-target" attribute.
   
   Why Buttons? 
   Using <button> instead of <a href> prevents the main site template from 
   detecting a URL change (hash change) and closing the article unexpectedly.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Helper Function: Switch Visible Section ---
    // Hides all poem parts and shows only the one matching targetId
    function switchPoemSection(targetId) {
        
        // 1. Hide everything inside the #poem article
        const allSections = document.querySelectorAll('.poem-welcome, .poem-list, .poem');
        allSections.forEach(el => {
            el.classList.add('hidden');   // CSS class to display: none
            el.classList.remove('active'); // CSS class to fade in/display: block
        });

        // 2. Find and Show the specific target section
        const target = document.getElementById(targetId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
            
            // 3. Auto-scroll to top of the article
            // This ensures the user sees the title of the new poem, not the bottom footer
            const mainArticle = document.getElementById('poem');
            if(mainArticle) {
                mainArticle.scrollTop = 0;
            }
        } else {
            console.warn(`Target section #${targetId} not found in HTML.`);
        }
    }

    // --- Main Event Listener ---
    // We attach one listener to the body to catch clicks on ANY navigation button
        // --- Main Event Listener (Use Capture Phase) ---
    // The {capture: true} ensures this runs BEFORE the template's click listeners
    window.addEventListener('click', (e) => {
        
        const btn = e.target.closest('[data-target]');
        
        if (btn) {
            // STOP everything else immediately
            e.preventDefault(); 
            e.stopImmediatePropagation(); // Stronger than stopPropagation()
            
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                switchPoemSection(targetId);
            }
        }
    }, { capture: true }); // <--- IMPORTANT: Capture Phase


});

/* ==========================================================================
   PLUTO / DWARF STARS FUNCTIONALITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    const plutoBtn = document.getElementById('pluto-btn');
    const plutoModal = document.getElementById('pluto-modal');
    const plutoYes = document.getElementById('pluto-yes');
    const plutoNo = document.getElementById('pluto-no');
    const dwarfStarsPage = document.getElementById('dwarf-stars');
    const closeDwarfStars = document.querySelector('.close-dwarf-stars');
    
    // Open modal when pluto button clicked
    if (plutoBtn) {
        plutoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            plutoModal.classList.remove('hidden');
        });
    }
    
    // Close modal on "No" button
    if (plutoNo) {
        plutoNo.addEventListener('click', () => {
            plutoModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside the thought bubble
    if (plutoModal) {
        plutoModal.addEventListener('click', (e) => {
            if (e.target === plutoModal) {
                plutoModal.classList.add('hidden');
            }
        });
    }
    
    // Open Dwarf Stars page on "Yes"
    if (plutoYes) {
        plutoYes.addEventListener('click', () => {
            plutoModal.classList.add('hidden');
            dwarfStarsPage.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }
    
    // Close Dwarf Stars page
    if (closeDwarfStars) {
        closeDwarfStars.addEventListener('click', () => {
            dwarfStarsPage.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (plutoModal && !plutoModal.classList.contains('hidden')) {
                plutoModal.classList.add('hidden');
            }
            if (dwarfStarsPage && !dwarfStarsPage.classList.contains('hidden')) {
                dwarfStarsPage.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
    });
       














