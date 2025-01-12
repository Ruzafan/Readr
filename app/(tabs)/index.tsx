import { SafeAreaView, StyleSheet } from 'react-native';
import { BookGrid } from '@/components/BookGrid';

export default function HomeScreen() {
  return (<SafeAreaView>
    <BookGrid />
  </SafeAreaView>
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
});