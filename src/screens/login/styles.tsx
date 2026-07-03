import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: '#252525',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#C9C9C9',
    fontSize: 16,
    marginBottom: 32,
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  googleButtonPressed: {
    opacity: 0.88,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 20,
    fontWeight: '700',
  },
  googleButtonText: {
    color: '#252525',
    fontSize: 16,
    fontWeight: '700',
  },
});
