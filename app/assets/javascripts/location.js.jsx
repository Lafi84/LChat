getLocationID = function(location){
  return $.get('/locations?location='+location, (data) =>{
      return data;
}, 'JSON');
};