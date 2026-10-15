/**
 * SAFE TOUR — Safe Radar Map Screen (React Native + Expo)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { MOCK_RISK_ZONE } from '../../src/constants/mockData';
import { geofenceService } from '../../src/services/geofencing/geofenceService';

export default function MapScreen() {
  const [isBypassActive, setIsBypassActive] = useState(geofenceService.isBypassRouteEngaged());

  const toggleBypass = () => {
    const next = !isBypassActive;
    setIsBypassActive(next);
    geofenceService.setBypassActive(next);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Telemetry Strip */}
      <View style={styles.topStrip}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Offline Map: Cached (48 MB)</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillTextMono}>25.5788° N, 91.8933° E</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Map Placeholder Canvas Container */}
        <View style={styles.mapCanvas}>
          <View style={styles.geofenceBadge}>
            <Text style={styles.geofenceBadgeText}>Mawryngkneng Geofence</Text>
            <Text style={styles.geofenceSubText}>High-Sensitivity Zone (420m away)</Text>
          </View>
          <View style={styles.userPin}>
            <View style={styles.userDot} />
            <Text style={styles.userLabel}>Arjun (You) • Active Corridor</Text>
          </View>
        </View>

        {/* Intelligence Dossier */}
        <View style={styles.dossierCard}>
          <View style={styles.hazardBar} />
          <Text style={styles.dossierTitle}>High-Sensitivity Area Ahead</Text>
          <Text style={styles.dossierSub}>Boundary 420m away • Mawryngkneng Forest</Text>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>WHY THIS ALERT EXISTS</Text>
            <Text style={styles.sectionBody}>{MOCK_RISK_ZONE.whyExists}</Text>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>WHAT TO COMPLY WITH</Text>
            <Text style={styles.sectionBody}>{MOCK_RISK_ZONE.whatToComply}</Text>
          </View>

          <Pressable
            style={[styles.actionBtn, isBypassActive && styles.bypassActiveBtn]}
            onPress={toggleBypass}
          >
            <Text style={styles.actionBtnText}>
              {isBypassActive
                ? 'Bypass Route Engaged (+12 min, Safe)'
                : 'View Safer Alternate Route (Bypasses Forest)'}
            </Text>
          </Pressable>
        </View>

        {/* Patrol & Daylight Bento */}
        <View style={styles.bentoRow}>
          <View style={styles.bentoBox}>
            <Text style={styles.bentoLabel}>Patrol Unit #14</Text>
            <Text style={styles.bentoValue}>In Vicinity</Text>
            <Text style={styles.bentoSub}>Meghalaya Tourist Police</Text>
          </View>
          <View style={styles.bentoBox}>
            <Text style={styles.bentoLabel}>Daylight Window</Text>
            <Text style={styles.bentoValue}>5:24 PM Fog</Text>
            <Text style={styles.bentoSub}>1h 14m left</Text>
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
  topStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#eceef0',
  },
  pillText: {
    fontSize: 11,
    color: '#191c1e',
    fontWeight: '600',
  },
  pillTextMono: {
    fontSize: 11,
    color: '#44474c',
    fontFamily: 'monospace',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  mapCanvas: {
    height: 320,
    borderRadius: 16,
    backgroundColor: '#e6e8ea',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  geofenceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ba1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  geofenceBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  geofenceSubText: {
    color: '#ffffff',
    fontSize: 9,
    opacity: 0.9,
  },
  userPin: {
    alignItems: 'center',
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00696d',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#191c1e',
    color: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dossierCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
    position: 'relative',
    overflow: 'hidden',
    gap: 8,
  },
  hazardBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#ba1a1a',
  },
  dossierTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
    marginLeft: 6,
  },
  dossierSub: {
    fontSize: 11,
    color: '#ba1a1a',
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionBox: {
    backgroundColor: '#f2f4f6',
    padding: 10,
    borderRadius: 10,
    marginLeft: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#44474c',
    textTransform: 'uppercase',
  },
  sectionBody: {
    fontSize: 12,
    color: '#191c1e',
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
    marginTop: 6,
  },
  bypassActiveBtn: {
    backgroundColor: '#00696d',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eceef0',
  },
  bentoLabel: {
    fontSize: 11,
    color: '#44474c',
  },
  bentoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191c1e',
    marginTop: 2,
  },
  bentoSub: {
    fontSize: 10,
    color: '#44474c',
    marginTop: 2,
  },
});
