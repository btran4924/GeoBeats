import { Image, StyleSheet, Button, View, Text } from "react-native";
import { useState } from "react";
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from "expo-web-browser";
import { MusicEmoji } from "@/components/MusicEmoji";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


const client = "fd3d6f23a06b4bae9b6dc9bcf3794fe4";
const REDIRECT_URI = "http://localhost:8081/";
const SCOPES = "user-read-private user-read-email playlist-modify-public playlist-modify-private";

export default function HomeScreen() {

  const [me, setMe] = useState('');

  const loginWithSpotify = async () => {
    console.log(" loginWithSpotify() was called!");
  
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${client}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&show_dialog=true`;
  
    // Open a new window for authentication
    const authWindow = window.open(authUrl, "_blank", "width=600,height=700");
  
    // Listen for token in the original window
    const checkForToken = setInterval(() => {
      try {
        if (!authWindow || authWindow.closed) {
          clearInterval(checkForToken);
          console.log(" Auth window closed");
          return;
        }
  
        // Check if the new window's URL contains the access token
        const url = authWindow.location.href;
        if (url.includes("#access_token=")) {
          const token = new URLSearchParams(url.split("#")[1]).get("access_token");

  
          if (token) {
            authWindow.close(); // Close the login window
            clearInterval(checkForToken);
            sessionStorage.setItem("spotify_api_token", token);
  
            // Fetch user data with the token
            fetch("https://api.spotify.com/v1/me", {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((response) => response.json())
              .then((data) => {
                sessionStorage.setItem("spotify_user_id", data.id);;
                setMe(data.display_name);
              })
              .catch((error) => console.error(" Error fetching user data:", error));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/geo-beats_logo2.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">GeoBeats</ThemedText>
        <MusicEmoji/>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type='subtitle'>Music to take with you</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Track your location</ThemedText>
        <ThemedText>
          Enable location tracking or enter your current location
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Configure</ThemedText>
        <ThemedText>
          Choose between popularity, origin, or puns
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Enjoy!</ThemedText>
        <ThemedText>
          Listen to some of the tunes that call these places home
        </ThemedText>
      </ThemedView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {me ? <Text style={styles.greetingText}>{`Hi ${me}! ready to go on a road trip? 🚗⛰️`}</Text> : <Button title="Login with Spotify" onPress={loginWithSpotify} />}
    </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  greetingText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

