import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function AuthorsScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/geo-beats-large.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Developer 1 */}
      <ThemedView style={styles.authorContainer}>
        <ThemedText type="title">Alan Zhang</ThemedText>
        <ThemedText type="subtitle">3rd-Year CS Major</ThemedText>
        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/alanlzhang')}>
          <ThemedText type="subtitle">LinkedIn</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://github.com/alanZhang0813')}>
          <ThemedText type="subtitle">GitHub</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Developer 2 */}
      <ThemedView style={styles.authorContainer}>
        <ThemedText type="title">Jessica Luo</ThemedText>
        <ThemedText type="subtitle">3rd-Year CS Major</ThemedText>
        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/jessica-luo-68b143232/')}>
          <ThemedText type="subtitle">LinkedIn</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://github.com/JLetsGitIt')}>
          <ThemedText type="subtitle">GitHub</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Developer 3 */}
      <ThemedView style={styles.authorContainer}>
        <ThemedText type="title">Ben Tran</ThemedText>
        <ThemedText type="subtitle">4th-Year CS Major</ThemedText>
        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/benjaminvtran/')}>
          <ThemedText type="subtitle">LinkedIn</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://github.com/btran4924')}>
          <ThemedText type="subtitle">GitHub</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Developer 4 */}
      <ThemedView style={styles.authorContainer}>
        <ThemedText type="title">Alex Vuong</ThemedText>
        <ThemedText type="subtitle">2nd-Year CS Major</ThemedText>
        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/emilybrown')}>
          <ThemedText type="subtitle">LinkedIn</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://github.com/alvg123')}>
          <ThemedText type="subtitle">GitHub</ThemedText>
        </TouchableOpacity>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  authorContainer: {
    gap: 8,
    marginBottom: 24,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});