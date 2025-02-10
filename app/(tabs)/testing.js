// // npm install node-fetch
// // node test.js

// // const fetch = require('node-fetch');

// const fetchLocationName = async (lat, lng) => {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       return data.display_name || 'Location name not found';
//     } catch (error) {
//       console.error('Error fetching location name:', error);
//       throw error;
//     }
//   };

//   (async () => {
//     const lat = 51.505;
//     const lng = -0.09;
//     try {
//       const locationName = await fetchLocationName(lat, lng);
//       console.log('Location Name:', locationName);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();