/**
 * SAFE TOUR — Anomaly Verification Screen (React Native + Expo)
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_ANOMALY } from '../../src/constants/mockData';

export default function AnomalyVerificationScreen() {
  const router = useRouter();

  const handleConfirmSafe = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>ROUTE AWARENESS CHECK</Text>
        </View>

        <Text style={styles.title}>{MOCK_ANOMALY.title}</Text>
        <Text style={styles.desc}>{MOCK_ANOMALY.explanation}</Text>

        <View style={styles.factorCard}>
          <Text style={styles.factorHeader}>Route Divergence</Text>
          <Text style={styles.factorText}>Headed east of the planned NH 206 corridor along Mawryngkneng bypass (+2.4km).</Text>
        </View>

        <View style={styles.factorCard}>
          <Text style={styles.factorHeader}>Buffer Vicinity</Text>
          <Text style={styles.factorText}>Approaching outer perimeter of Mawryngkneng Reserved Forest where cellular coverage drops.</Text>
        </View>

        <View style={styles.guardianNotice}>
          <Text style={styles.guardianTitle}>Automated Guardian Update</Text>
          <Text style={styles.guardianText}>
            If there is no response within 15 minutes, a friendly location check will ping Priya Sharma.
          </Text>
        </View>

        <Pressable style={styles.safeBtn} onPress={handleConfirmSafe}>
          <Text style={styles.safeBtnText}>I'm Safe — Exploring / Detour</Text>
        </Pressable>

        <Pressable style={styles.helpBtn} onPress={() => router.push('/emergency')}>
          <Text style={styles.helpBtnText}>I Need Help or Directions</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  content: {
    padding: 20,
    gap: 12,
  },
  badgePill: {
    backgroundColor: '#94f2f7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007074',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#191c1e',
  },
  desc: {
    fontSize: 13,
    color: '#44474c',
    lineHeight: 18,
  },
  factorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 2,
  },
  factorHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#191c1e',
  },
  factorText: {
    fontSize: 12,
    color: '#44474c',
    lineHeight: 16,
  },
  guardianNotice: {
    backgroundColor: '#f2f4f6',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  guardianTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00696d',
  },
  guardianText: {
    fontSize: 11,
    color: '#44474c',
    lineHeight: 16,
  },
  safeBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  safeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  helpBtn: {
    backgroundColor: '#94f2f7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpBtnText: {
    color: '#007074',
    fontSize: 14,
    fontWeight: '700',
  },
});
