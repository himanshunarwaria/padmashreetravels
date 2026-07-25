document.addEventListener('DOMContentLoaded',function(){
  // ── Analytics helpers (single GTM container, no PII) ──────────────────────
  window.dataLayer=window.dataLayer||[];
  function pushEvent(name,params){var e={event:name,page_path:location.pathname};if(params){for(var k in params){if(params[k]!==''&&params[k]!=null)e[k]=params[k];}}window.dataLayer.push(e);}
  window.pstPushEvent=pushEvent;
  function inferSource(a){if(a.closest('.mcta-bar'))return'sticky_bar';if(a.classList&&a.classList.contains('waf')||a.closest('.waf'))return'float_button';if(a.closest('.hero'))return'hero';if(a.closest('.cta'))return'final_cta';if(a.closest('.rcard'))return'route_card';if(a.closest('.fcard'))return'fleet_card';if(a.closest('.ft'))return'footer';if(a.closest('.mnav'))return'mobile_nav';if(a.closest('.hdr'))return'header';return'body';}
  function routeSlug(href){return (href||'').replace(/^https?:\/\/[^\/]+/,'').replace(/[#?].*$/,'').replace(/^(\.\.\/)+/,'').replace(/^\//,'').replace(/\/$/,'')||'home';}

  var ham=document.getElementById('ham'),mn=document.getElementById('mnav');
  if(ham&&mn){ham.addEventListener('click',function(){ham.classList.toggle('open');mn.classList.toggle('open');document.body.style.overflow=mn.classList.contains('open')?'hidden':''});mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ham.classList.remove('open');mn.classList.remove('open');document.body.style.overflow=''})})}
  var hdr=document.querySelector('.hdr');
  if(hdr)window.addEventListener('scroll',function(){hdr.classList.toggle('scrolled',window.scrollY>20)},{passive:true});
  document.querySelectorAll('.fi__q').forEach(function(b){b.addEventListener('click',function(){var i=b.closest('.fi'),o=i.classList.contains('open');i.parentNode.querySelectorAll('.fi').forEach(function(s){s.classList.remove('open')});if(!o)i.classList.add('open')})});
  var form=document.getElementById('bookingForm'),suc=document.getElementById('formSuccess');
  if(form){var ffStarted=false;form.addEventListener('input',function(){if(!ffStarted){ffStarted=true;pushEvent('fare_finder_start',{source_component:'homepage_form'});}});
    form.addEventListener('submit',function(e){e.preventDefault();var ok=true;
    form.querySelectorAll('.fg').forEach(function(g){g.classList.remove('has-error')});
    form.querySelectorAll('.finput').forEach(function(i){i.classList.remove('error')});
    var n=form.querySelector('[name="name"]');if(n&&n.value.trim().length<2){se(n,'Enter your full name');ok=false}
    var p=form.querySelector('[name="phone"]');if(p&&p.value.replace(/\D/g,'').length<10){se(p,'Enter valid 10-digit number');ok=false}
    var pk=form.querySelector('[name="pickup"]');if(pk&&pk.value.trim().length<2){se(pk,'Enter pickup location');ok=false}
    var dr=form.querySelector('[name="drop"]');if(dr&&dr.value.trim().length<2){se(dr,'Enter drop location');ok=false}
    var dt=form.querySelector('[name="date"]');if(dt&&!dt.value){se(dt,'Select travel date');ok=false}
    if(ok){form.style.display='none';if(suc)suc.style.display='block';
      pushEvent('fare_finder_complete',{source_component:'homepage_form',trip_type:'enquiry'});
      var msg='Hello! I want to book a cab.\nName: '+n.value.trim()+'\nPhone: '+p.value.trim()+'\nPickup: '+pk.value.trim()+'\nDrop: '+dr.value.trim()+'\nDate: '+dt.value;
      setTimeout(function(){window.open('https://wa.me/918720081102?text='+encodeURIComponent(msg),'_blank')},1000)}
  })}
  function se(inp,msg){var g=inp.closest('.fg');if(g){g.classList.add('has-error');inp.classList.add('error');var e=g.querySelector('.ferr');if(e)e.textContent=msg}}
  var today=new Date().toISOString().split('T')[0];document.querySelectorAll('input[type="date"]').forEach(function(d){d.setAttribute('min',today)});
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});

  // ── Mobile nav accordion ─────────────────────────────────────────────────
  // Close accordion subs when ham is closed
  if(mn){mn.querySelectorAll('.mnav__cat').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var sub=btn.nextElementSibling;
      var isOpen=sub.classList.contains('open');
      // close all
      mn.querySelectorAll('.mnav__sub').forEach(function(s){s.classList.remove('open')});
      mn.querySelectorAll('.mnav__cat').forEach(function(b){b.setAttribute('aria-expanded','false')});
      if(!isOpen){sub.classList.add('open');btn.setAttribute('aria-expanded','true')}
    });
  });}

  // ── Nav dropdown keyboard accessibility ──────────────────────────────────
  document.querySelectorAll('.nav__dd').forEach(function(dd){
    var trigger=dd.querySelector(':scope > .nav__a');
    if(!trigger)return;
    trigger.setAttribute('aria-haspopup','true');
    trigger.setAttribute('aria-expanded','false');

    // Track focus within the dropdown
    dd.addEventListener('focusin',function(){
      dd.classList.add('nav__dd--open');
      trigger.setAttribute('aria-expanded','true');
    });
    dd.addEventListener('focusout',function(e){
      // Only close if focus moves completely outside this dropdown
      if(!dd.contains(e.relatedTarget)){
        dd.classList.remove('nav__dd--open');
        trigger.setAttribute('aria-expanded','false');
      }
    });

    // Escape key — collapse and return focus to trigger
    dd.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        dd.classList.remove('nav__dd--open');
        trigger.setAttribute('aria-expanded','false');
        trigger.focus();
      }
    });
  });

  // ── Consolidated click analytics (one delegated handler, no PII) ──────────
  // Each named event fires once per click; external navigation is not blocked
  // (dataLayer.push is synchronous, links open normally). Google Ads
  // conversion event (whatsapp_booking) is preserved alongside GA4 events.
  var isBlog=/\/blog\//.test(location.pathname);
  document.addEventListener('click',function(e){
    var a=e.target.closest('a');
    if(!a)return;
    var href=a.getAttribute('href')||'';
    var src=inferSource(a);
    var route=a.getAttribute('data-route')||'';

    if(href.indexOf('wa.me')>-1){
      pushEvent('whatsapp_enquiry',{source_component:src,route:route});
      window.dataLayer.push({event:'whatsapp_booking',conversion_id:'AW-18103087307',conversion_label:'XY8MCNfs7Z4CEMvhnLhD'});
    } else if(href.indexOf('tel:')===0){
      pushEvent('phone_click',{call_number:href.replace('tel:',''),source_component:src});
    }
    if(href.indexOf('g.page')>-1) pushEvent('review_link_click',{source_component:src});
    if(href.indexOf('google.com/maps')>-1||href.indexOf('maps.app.goo')>-1||href.indexOf('goo.gl/maps')>-1) pushEvent('map_click',{source_component:src});

    // Route card click (View Details etc. inside a route card)
    var card=a.closest('.rcard');
    if(card && href && href.indexOf('wa.me')===-1 && href.indexOf('tel:')!==0){
      var dest=card.querySelector('.rcard__dest');
      pushEvent('route_card_click',{route:routeSlug(href),route_name:dest?dest.textContent.trim():'',source_component:src});
    }
    // Fleet vehicle CTA
    if(a.getAttribute('data-vehicle')){
      pushEvent('vehicle_selected',{vehicle:a.getAttribute('data-vehicle'),source_component:'fleet_card'});
      if(href.indexOf('wa.me')>-1||/fares/.test(href)) pushEvent('fleet_fare_click',{vehicle:a.getAttribute('data-vehicle')});
    }
    // Guide -> service link (from a blog article body to a service/route page)
    if(isBlog && href && href.indexOf('http')!==0 && href.indexOf('#')!==0 && a.closest('.prose,.article,article,main') && /(taxi|cab|sightseeing|tour|fares|fleet|route-finder|airport|station|balaji|mathura|vrindavan|jaipur|gwalior)/.test(href)){
      pushEvent('guide_to_service_click',{target:routeSlug(href),source_component:'blog_body'});
    }
  });
});
