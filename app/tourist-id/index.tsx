/**
 * SAFE TOUR — Digital Tourist ID Screen (React Native + Expo)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_TOURIST } from '../../src/constants/mockData';

export default function TouristIdScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(38);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Tourist ID</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeBtn}>Close</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Authority Pass Card */}
        <View style={styles.authorityCard}>
          <Text style={styles.authHeader}>Republic of India • Tourist Authority</Text>
          <Text style={styles.zoneText}>Meghalaya Safety Zone 4</Text>
          <Text style={styles.dtidText}>{MOCK_TOURIST.dtid}</Text>
          <Text style={styles.validText}>Valid: 12 Oct – 28 Oct 2026</Text>

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View>
              <Text style={styles.name}>{MOCK_TOURIST.name}</Text>
              <Text style={styles.profileSub}>
                {MOCK_TOURIST.gender} • {MOCK_TOURIST.age} Yrs • {MOCK_TOURIST.nationality}
              </Text>
              <Text style={styles.badgeLine}>Blood: {MOCK_TOURIST.bloodGroup} • {MOCK_TOURIST.zonePass}</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Pass Token */}
        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Checkpoint Access Pass</Text>
            <Text style={styles.dynamicText}>Dynamic: {countdown}s</Text>
          </View>

          <View style={styles.qrBox}>
            <Text style={styles.qrCodeText}>[ENCRYPTED DYNAMIC QR TOKEN]</Text>
            <Text style={styles.qrHash}>SHA-256: 8F4K-9921-MEG-4019-E2</Text>
          </View>

          <Text style={styles.guidance}>
            Present QR to Tourist Police Kiosk, Wildlife Checkpost, or Forest Range Officer.
          </Text>
        </View>

        {/* 100% Offline */}
        <View style={styles.offlineBox}>
          <Text style={styles.offlineTitle}>100% Valid Offline</Text>
          <Text style={styles.offlineDesc}>
            Cryptographic asymmetric certificate is embedded locally on this device. Official field scanners can verify your legitimacy without cellular connectivity.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eceef0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191c1e',
  },
  closeBtn: {
    fontSize: 14,
    color: '#00696d',
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  authorityCard: {
    backgroundColor: '#0e1c2f',
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  authHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94f2f7',
    textTransform: 'uppercase',
  },
  zoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  dtidText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  validText: {
    fontSize: 12,
    color: '#94f2f7',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#94f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0e1c2f',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileSub: {
    fontSize: 11,
    color: '#bac7e1',
  },
  badgeLine: {
    fontSize: 11,
    color: '#94f2f7',
    marginTop: 2,
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 8,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1e',
  },
  dynamicText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00696d',
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#f2f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    padding: 12,
  },
  qrCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#191c1e',
    textAlign: 'center',
  },
  qrHash: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#44474c',
    marginTop: 8,
    textAlign: 'center',
  },
  guidance: {
    fontSize: 11,
    color: '#44474c',
    textAlign: 'center',
  },
  offlineBox: {
    backgroundColor: '#e6f7f8',
    padding: 14,
    borderRadius: 14,
    gap: 4,
  },
  offlineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007074',
  },
  offlineDesc: {
    fontSize: 11,
    color: '#004f52',
    lineHeight: 16,
  },
});
