import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Button, FlatList, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

type Coords = {
  latitude: number;
  longitude: number;
};

type NameResponse = {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

export default function MapScreen() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [locName, setLocName] = useState('');

  const [userId, setUserId] = useState(''); //The user's ID for exporting the playlist
  const [spotifyToken, setSpotifyToken] = useState('');
  const [playlistId, setPlaylistId] = useState('');

  const [songIdList, setSongIdList] = useState<string[]>([]);
  const [songList, setSongList] = useState<string[]>([]); // For storing song names

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setCoords(userLocation.coords);

      const user_data = sessionStorage.getItem("spotify_user_id");
      if (user_data) {
        setUserId(user_data);
        console.log(user_data);
      } else {
        setUserId('');
      }

      const spotify_token = sessionStorage.getItem("spotify_api_token");
      if (spotify_token) {
        setSpotifyToken(spotify_token);
        console.log(spotifyToken);
      }
    };

    getLocation();
  }, []);

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (coords) {
    text = `Lat: ${coords.latitude}, Lon: ${coords.longitude}`;
  }

  function isNameResponse(data: unknown): data is NameResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'display_name' in data &&
      typeof (data as NameResponse).display_name === 'string'
    );
  }

  const fetchLocationName = async () => {
    if (!coords) return;

    const { latitude, longitude } = coords;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    if (!latitude || !longitude) {
      console.error('Invalid coordinates');
      setLocName('Invalid coordinates');
      return;
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (isNameResponse(data) && data.address.city) {
        // console.log(data.display_name);
        setLocName(data.address.city)
        return data.display_name || 'Location name not found';
      } else {
        throw new Error('Invalid API response');
      }

    } catch (error) {
      console.error('Error fetching location name:', error);
      throw error;
    }
  };

  const sendLocNameToBackend = async () => {
    console.log("Location:", locName);
    try {
      const response = await fetch('http://localhost:5001/api/location', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location : locName }),
      });

      const data = await response.json();
      if (data.success) {
        const playlistsObject = data.playlists;

        const songsNameMap = new Map(
          Object.entries(playlistsObject).map(([key, value]) => {
            const songName = key.split(',')[1].slice(0, -1); // Extract song name from the key
            return [songName, value]; // Store it as a key-value pair
          })
        );

        const songsIdMap = new Map(
          Object.entries(playlistsObject).map(([key, value]) => {
            const songId = key.split(',')[0].slice(1); // Extract song name from the key
            // console.log(songId);
            return [songId, value]; // Store it as a key-value pair
          })
        );

        // Convert Map to array of song names to display
        const songNames = Array.from(songsNameMap.keys());
        const songIds = Array.from(songsIdMap.keys());
        setSongList(songNames); // Update the song list
        setSongIdList(songIds);
      }

    } catch (error) {
      console.error('Error at the try:', error);
      Alert.alert('Error', 'Failed at the catch block.');
    }
  };

  const exportToSpotify = async () => {
    const newPlaylistId = await createPlaylist(); // Wait for playlist creation
    if (newPlaylistId) {
      await addSongs(newPlaylistId); // Pass playlistId explicitly
    } else {
      console.error("Failed to create playlist, skipping addSongs()");
    }
  };
 
  const createPlaylist = async (): Promise<string | null> => {
    console.log("User ID:", userId);
    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "name": `GeoBeats ${locName}`, "description": "", "public": false }),
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log("Playlist ID:", data.id);
        return data.id; // Return the playlist ID
      } else {
        console.error("Failed to create playlist. Response:", await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  };

  const addSongs = async (playlistId: string) => {
    try {
      const uris = songIdList.map((songId) => `spotify:track:${songId}`);
      const requestBody = {
        uris: uris,
      };
      console.log("Request Body:", requestBody);
      console.log("Playlist ID:", playlistId);
 
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Fix JSON structure
      });
 
      if (response.ok) {
        console.log("Successfully added songs!");
      } else {
        console.error("Failed to add songs. Response:", await response.text());
      }
    } catch (error) {
      console.error('Error adding songs:', error);
    }
  };



  // const exportToSpotify = async () => {
  //   await createPlaylist();
  //   await addSongs();
  // };

  // const createPlaylist = async () => {
  //   console.log("User ID:", userId);
  //   try {
  //     const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
  //       method: "POST",
  //       headers: {
  //         'Authorization': `Bearer ${spotifyToken}`,
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ "name" : "GeoBeats", "description" : "", "public" : false })
  //     })
  //     if (response) {
  //       const data = await response.json();
  //       console.log("Playlist ID:", data.id);
  //       setPlaylistId(data.id);
  //     }
  //   } catch (error) {
  //     console.error('Error at the try:', error);
  //   }
  // }

  // const addSongs = async () => {
  //   try {
  //     const uris = songIdList.map((songId) => `spotify:track:${songId}`);
  //     const requestBody = {
  //       uris: uris,
  //     };
  //     console.log(requestBody);
  //     const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
  //       method: "POST",
  //       headers: {
  //         'Authorization': `Bearer ${spotifyToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ requestBody })
  //     })
  //     // if (response) {
  //     //   console.log("Success");
  //     // } else {
  //     //   console.error("An error occurred");
  //     // }
  //   } catch (error) {
  //     console.error('Error at the try:', error);
  //   }
  // }

  return (
    <View style={styles.container}>
      <ThemedText>{text}</ThemedText>
      {locName ? (
        <ThemedText style={{ fontSize: 20 }}>Location: {locName}</ThemedText>
      ) : null}

      <Button title="Set Location" onPress={fetchLocationName} />
      <Button title="Get New Playlist" onPress={sendLocNameToBackend} />

      {/* Parallax Scroll View */}
      <ScrollView style={styles.scrollContainer}>
        {songList.map((song, index) => (
          <View key={index} style={styles.songItem}>
            <ThemedText style={styles.songName}>{song}</ThemedText>
          </View>
        ))}
      </ScrollView>

      {songList.length != 0 && <Button title="Export to Spotify" onPress={exportToSpotify} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },
  songItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  songName: {
    fontSize: 18,
  },
});