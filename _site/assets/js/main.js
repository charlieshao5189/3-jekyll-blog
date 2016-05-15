$(function() {
  var toc     = $('.toc-link'),
      sidebar = $('#sidebar'),
      main    = $('#main'),
      menu    = $('#menu'),
      x1, y1;

  // run this function after pjax load.
  var afterPjax = function() {
    // open links in new tab.
    $('#main').find('a').filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

    // discus comment.
    
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//charlieshaoblog' + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
    

    // your scripts
    
    //搜索框文字变化时间
    $("#search-input").keyup(function(){
        //$("#s-box").hide("slow");
        var text = $("#search-input").val().toLowerCase();
        //console.log(text);

        if(text =="" || text==undefined){
            $(".toc-link").show();
        }else{
            $(".toc-link").hide();
            $(".toc-link").each(function(){
                var htmlstr = $(this).html().toLowerCase();
                if(htmlstr.indexOf(text) != -1){
                    console.log(htmlstr);
                    $(this).show();
                }
            })
        };

	// Enable fullscreen.
	$('#sidebar-tags').on('click', function() {
	  if (button.hasClass('fullscreen')) {
	    sidebar.removeClass('fullscreen');
	    button.removeClass('fullscreen');
	    content.delay(300).queue(function(){
	      $(this).removeClass('fullscreen').dequeue();
	    });
	  } else {
	    sidebar.addClass('fullscreen');
	    button.addClass('fullscreen');
	    content.delay(200).queue(function(){
	      $(this).addClass('fullscreen').dequeue();
	    });
	  }
	});

    })
  };
  afterPjax();


  // NProgress
  NProgress.configure({ showSpinner: false });


  // Pjax
  $(document).pjax('#sidebar-avatar, .toc-link', '#main', {
    fragment: '#main',
    timeout: 3000
  });

  $(document).on({
    'pjax:click': function() {
      NProgress.start();
      main.removeClass('fadeIn');
    },
    'pjax:end': function() {
      afterPjax();
      NProgress.done();
      main.scrollTop(0).addClass('fadeIn');
      menu.add(sidebar).removeClass('open');
      
      ga('set', 'location', window.location.href);
      ga('send', 'pageview');
      
    }
  });


  // Tags Filter
  $('#sidebar-tags').on('click', '.sidebar-tag', function() {
    var filter = $(this).data('filter');
    if (filter === 'all') {
      toc.fadeIn(350);
    } else {
      toc.hide();
      $('.toc-link[data-tags~=' + filter + ']').fadeIn(350);
    }
    $(this).addClass('active').siblings().removeClass('active');
  });


  // Menu
  menu.on('click', function() {
    $(this).add(sidebar).toggleClass('open');
  });

});
