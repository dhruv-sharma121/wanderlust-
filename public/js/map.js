           
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat].
        zoom: 9 ,// starting zoom
        style: 'mapbox://styles/mapbox/streets-v12',
    });
   
    // console.log(coordinates);
  const marker= new mapboxgl.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates)
    .addTo(map)


    const popup = new mapboxgl.Popup({offset:25})
    .setLngLat(listing.geometry.coordinates)
    .setHTML(` <h4> ${listing.location}</h4><p>Exact location will be provided after booking</p>`)
    // .setMaxWidth("300px")
    .addTo(map);