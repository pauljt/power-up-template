/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var bugSelector = document.getElementById('secbug');

t.render(function(){
  return Promise.all([
    t.get('card', 'shared', 'secbug'),
  ])
  .spread(function(savedBug){
    if(savedBug){
      bugSelector.value = savedBug;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('card', 'shared', 'secbug', bugSelector.value)
  .then(function(){
    t.closePopup();
  })
})
