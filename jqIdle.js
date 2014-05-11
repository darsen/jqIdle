(function ($) {
    jQuery.sessionTimeout = function (options) {
        var defaults = {
            title: 'Session Timeout',
            message: 'Your session is about to expire in: ',
            keepAliveUrl: '/keep-alive',
            redirUrl: '/timed-out',
            logoutUrl: '/log-out',
            warnAfter: 900000, // 15 minutes
            redirAfter: 1200000 // 20 minutes
        };

        // Extend user-set options over defaults
        var o = defaults;

        if (options) {
            o = $.extend(defaults, options);
        }
        var latestActivity = new Date();
        var count=o.redirAfter/1000;
            var counter=setInterval(timer, 1000)
        resetOnUser();
        checkActivity();


        // Create timeout warning dialog
        $('body').append('<div title="' 
                         + o.title 
                         + '" id="sessionTimeout-dialog"><p>' 
                         + o.message 
                         + '</p><span id="sessionTimeout-timer"></span>&nbsp;seconds.</div>');
        $('#sessionTimeout-dialog').dialog({
            autoOpen: false,
            width: 400,
            modal: true,
            closeOnEscape: false,
            open: function () {
                $(".ui-dialog-titlebar-close").hide();
            },
            buttons: {
                // Button one - takes user to logout URL
                "Log Out Now": function () {
                    window.location = o.logoutUrl;
                },
                // Button two - closes dialog and makes call to keep-alive URL
                "Stay Connected": function () {
                    latestActivity = new Date();
                    $(this).dialog('close');

                    $.ajax({
                        type: 'POST',
                        url: o.keepAliveUrl
                    });
                }
            }
        });

        function resetOnUser() {
            $(this).mousemove(function (e) {
                latestActivity = new Date();
            });
            $(this).keypress(function (e) {
                latestActivity = new Date();
            });
        }

        function elapsed() {
            return (new Date() - latestActivity);
        }

        function checkActivity() {
            var check = setInterval(

            function () {
                if (elapsed() > o.warnAfter) {
                    $('#sessionTimeout-dialog').dialog('open');
                }
                if (elapsed() > o.redirAfter) {
                    window.location = o.redirUrl;
                }

            }, 3000);
        }
        
        function timer()  {
          count=count-1;
          if (count <= 0)
          {
             clearInterval(counter);             
             return;
          }

          $("#sessionTimeout-timer").html(count);
       }

    };
})(jQuery);