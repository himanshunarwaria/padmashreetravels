document.addEventListener('DOMContentLoaded',function(){
  var ham=document.getElementById('ham'),mn=document.getElementById('mnav');
  if(ham&&mn){ham.addEventListener('click',function(){ham.classList.toggle('open');mn.classList.toggle('open');document.body.style.overflow=mn.classList.contains('open')?'hidden':''});mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ham.classList.remove('open');mn.classList.remove('open');document.body.style.overflow=''})})}
  var hdr=document.querySelector('.hdr');
  if(hdr)window.addEventListener('scroll',function(){hdr.classList.toggle('scrolled',window.scrollY>20)},{passive:true});
  document.querySelectorAll('.fi__q').forEach(function(b){b.addEventListener('click',function(){var i=b.closest('.fi'),o=i.classList.contains('open');i.parentNode.querySelectorAll('.fi').forEach(function(s){s.classList.remove('open')});if(!o)i.classList.add('open')})});
  var form=document.getElementById('bookingForm'),suc=document.getElementById('formSuccess');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();var ok=true;
    form.querySelectorAll('.fg').forEach(function(g){g.classList.remove('has-error')});
    form.querySelectorAll('.finput').forEach(function(i){i.classList.remove('error')});
    var n=form.querySelector('[name="name"]');if(n&&n.value.trim().length<2){se(n,'Enter your full name');ok=false}
    var p=form.querySelector('[name="phone"]');if(p&&p.value.replace(/\D/g,'').length<10){se(p,'Enter valid 10-digit number');ok=false}
    var pk=form.querySelector('[name="pickup"]');if(pk&&pk.value.trim().length<2){se(pk,'Enter pickup location');ok=false}
    var dr=form.querySelector('[name="drop"]');if(dr&&dr.value.trim().length<2){se(dr,'Enter drop location');ok=false}
    var dt=form.querySelector('[name="date"]');if(dt&&!dt.value){se(dt,'Select travel date');ok=false}
    if(ok){form.style.display='none';if(suc)suc.style.display='block';
      var msg='Hello! I want to book a cab.\nName: '+n.value.trim()+'\nPhone: '+p.value.trim()+'\nPickup: '+pk.value.trim()+'\nDrop: '+dr.value.trim()+'\nDate: '+dt.value;
      setTimeout(function(){window.open('https://wa.me/918720081102?text='+encodeURIComponent(msg),'_blank')},1000)}
  })}
  function se(inp,msg){var g=inp.closest('.fg');if(g){g.classList.add('has-error');inp.classList.add('error');var e=g.querySelector('.ferr');if(e)e.textContent=msg}}
  var today=new Date().toISOString().split('T')[0];document.querySelectorAll('input[type="date"]').forEach(function(d){d.setAttribute('min',today)});
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});
});
