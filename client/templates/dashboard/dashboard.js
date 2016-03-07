Template.dashboard.rendered = function() {
  $(function() {

      //shit for morris charts
      //this shit doesn't work it just looks good
      //needs to be linked to our backend for data results
      Morris.Area({
          element: 'morris-area-chart',
          data: [{
              period: '2016 JAN',
              anger: 2666,
              sadness: null,
              joy: 2647
          }, {
              period: '2010 FEB',
              anger: 2778,
              sadness: 2294,
              joy: 2441
          }, {
              period: '2010 MAR',
              anger: 4912,
              sadness: 1969,
              joy: 2501
          }, {
              period: '2010 APR',
              anger: 3767,
              sadness: 3597,
              joy: 5689
          }, {
              period: '2011 JAN',
              anger: 6810,
              sadness: 1914,
              joy: 2293
          }, {
              period: '2011 FEB',
              anger: 5670,
              sadness: 4293,
              joy: 1881
          }, {
              period: '2011 MAR',
              anger: 4820,
              sadness: 3795,
              joy: 1588
          }, {
              period: '2011 APR',
              anger: 15073,
              sadness: 5967,
              joy: 5175
          }, {
              period: '2012 JAN',
              anger: 10687,
              sadness: 4460,
              joy: 2028
          }, {
              period: '2012 FEB',
              anger: 8432,
              sadness: 5713,
              joy: 1791
          }],
          xkey: 'period',
          ykeys: ['anger', 'sadness', 'joy'],
          labels: ['anger', 'sadness', 'joy'],
          pointSize: 2,
          hideHover: 'auto',
          resize: true
      });

      Morris.Donut({
          element: 'morris-donut-chart',
          data: [{
              label: "Anger Tone",
              value: 12
          }, {
              label: "Sadness Tone",
              value: 30
          }, {
              label: "Disgust Tone",
              value: 20
          }],
          resize: true
      });
  });

  $(function() {

      $('#side-menu').metisMenu();

  });


  $(function() {
      $(window).bind("load resize", function() {
          topOffset = 50;
          width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
          if (width < 768) {
              $('div.navbar-collapse').addClass('collapse');
              topOffset = 100; // 2-row-menu
          } else {
              $('div.navbar-collapse').removeClass('collapse');
          }

          height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
          height = height - topOffset;
          if (height < 1) height = 1;
          if (height > topOffset) {
              $("#page-wrapper").css("min-height", (height) + "px");
          }
      });

      var url = window.location;
      var element = $('ul.nav a').filter(function() {
          return this.href == url || url.href.indexOf(this.href) == 0;
      }).addClass('active').parent().parent().addClass('in').parent();
      if (element.is('li')) {
          element.addClass('active');
      }
  });
};

Template.dashboard.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.dashboard.events({
  "click #foo": function(event, template){

  }
});
