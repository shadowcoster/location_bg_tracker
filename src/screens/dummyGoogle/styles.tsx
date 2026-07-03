import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  googleMark: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    marginBottom: 24,
    width: 64,
  },
  googleMarkText: {
    color: '#4285F4',
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#C9C9C9',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  backButtonPressed: {
    opacity: 0.88,
  },
  backButtonText: {
    color: '#252525',
    fontSize: 15,
    fontWeight: '700',
  },
});
