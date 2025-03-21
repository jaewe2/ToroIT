import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, SafeAreaView, View, Text, Appearance, Linking, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function ContactScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const imgColor = colorScheme === 'dark' ? 'papayawhip' : '#333';
  const styles = createStyles(theme, colorScheme);

  const openMap = () => {
    const address = '555 Coffee Lane, Kansas City, KS 55555-1234';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Ionicons name="coffee" size={250} color={imgColor} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Coffee Shop</Text>

        <View style={styles.textView}>
          <Text style={styles.text}>
            <Text>555 Coffee Lane</Text>{'\n'}
            <Text>Kansas City, KS 55555-1234</Text>
          </Text>
          <TouchableOpacity onPress={openMap} accessibilityLabel="View location on map">
            <Text style={[styles.link, { color: theme.primary }]}>View on Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>
            Phone:{'\n'}
            <Link href="tel:5555555555" style={[styles.link, { color: theme.primary }]} accessibilityLabel="Call us">
              555-555-5555
            </Link>{'\n'}
            or{' '}
            <Link href="sms:5555555555" style={[styles.link, { color: theme.primary }]} accessibilityLabel="Text us">
              Click Here to Text!
            </Link>
          </Text>
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>
            Hours:{'\n'}
            <Text>Open 6am to 4pm daily.</Text>{'\n'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    imgContainer: {
      backgroundColor: colorScheme === 'dark' ? '#353636' : '#D0D0D0',
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      backgroundColor: theme.background,
      padding: 20,
      flex: 1,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
      marginBottom: 20,
      textAlign: 'center',
    },
    textView: {
      marginBottom: 20,
    },
    text: {
      color: theme.text,
      fontSize: 16,
      lineHeight: 24,
    },
    link: {
      textDecorationLine: 'underline',
      fontSize: 16,
      marginTop: 5,
    },
  });
}