import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <Collapsible title="Spotify Integration">
        <ThemedText>
          Connect your Spotify account to sync your music preferences and enhance your experience.
          This feature allows the app to detect your currently playing song and generate recommendations based on your listening habits.
        </ThemedText>
        <ExternalLink href="https://developer.spotify.com/documentation/web-api/">
          <ThemedText type="link">Manage Spotify connections</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Location Tracking">
        <ThemedText>
          Enable location tracking to receive personalized suggestions based on your surroundings.
          This feature helps improve recommendations and enhances real-time features.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/location/">
          <ThemedText type="link">Learn more about location settings</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="App Preferences">
        <ThemedText>
          Customize your experience by enabling or disabling the following settings:
        </ThemedText>
        <ThemedText>🔘 Dark Mode</ThemedText>
        <ThemedText>🔘 Music-based Recommendations</ThemedText>
        <ThemedText>🔘 Location-based Suggestions</ThemedText>
      </Collapsible>

      <Collapsible title="Appearance">
        <ThemedText>
          Switch between light and dark mode based on your preference. The app automatically detects your system setting, but you can manually override it here.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Privacy & Data">
        <ThemedText>
          Your privacy matters. You can manage your data, clear saved preferences, and control how your information is used.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});