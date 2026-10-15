/**
 * SAFE TOUR — Profile & Settings Screen (React Native + Expo)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { MOCK_TOURIST, MOCK_EMERGENCY_CONTACTS } from '../../src/constants/mockData';

export default function ProfileScreen() {
  const [geofenceConsent, setGeofenceConsent] = useState(true);
  const [kinRelay, setKinRelay] = useState(false);
  const [anomalyDetection, setAnomalyDetection] = useState(true);
  const [smsFallback, setSmsFallback] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.name}>{MOCK_TOURIST.name}</Text>
            <Text style={styles.dtid}>{MOCK_TOURIST.dtid} • {MOCK_TOURIST.nationality}</Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {MOCK_EMERGENCY_CONTACTS.map(c => (
            <View key={c.id} style={styles.contactItem}>
              <View>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>
              {c.isPrimary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>Primary</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Data & Privacy Consent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy Consent</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Safety-Only Geofence</Text>
              <Text style={styles.toggleSub}>Active strictly during trips</Text>
            </View>
            <Switch
              value={geofenceConsent}
              onValueChange={setGeofenceConsent}
              trackColor={{ false: '#e0e3e5', true: '#00696d' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Kin Breadcrumb Relay</Text>
              <Text style={styles.toggleSub}>Pings sent every 30m to Priya</Text>
            </View>
            <Switch
              value={kinRelay}
              onValueChange={setKinRelay}
              trackColor={{ false: '#e0e3e5', true: '#00696d' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Edge Anomaly Detection</Text>
              <Text style={styles.toggleSub}>100% On-device processing</Text>
            </View>
            <Switch
              value={anomalyDetection}
              onValueChange={setAnomalyDetection}
              trackColor={{ false: '#e0e3e5', true: '#00696d' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Offline Encrypted SMS Fallback</Text>
              <Text style={styles.toggleSub}>Auto-transmits when 4G drops</Text>
            </View>
            <Switch
              value={smsFallback}
              onValueChange={setSmsFallback}
              trackColor={{ false: '#e0e3e5', true: '#00696d' }}
            />
          </View>
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
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#94f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00696d',
  },
  profileMeta: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
  },
  dtid: {
    fontSize: 12,
    color: '#44474c',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191c1e',
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1e',
  },
  contactPhone: {
    fontSize: 11,
    color: '#44474c',
  },
  primaryBadge: {
    backgroundColor: '#94f2f7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  primaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007074',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleText: {
    flex: 1,
    paddingRight: 12,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#191c1e',
  },
  toggleSub: {
    fontSize: 11,
    color: '#44474c',
    marginTop: 1,
  },
});
