import { Redirect } from 'expo-router';

export default function Index() {
  // Directs to active tab navigation
  return <Redirect href="/(tabs)" />;
}
