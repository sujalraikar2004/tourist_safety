/**
 * SAFE TOUR — Tourist Home Screen (React Native + Expo)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_TOURIST, MOCK_TRIP } from '../../src/constants/mockData';
import { safetyService } from '../../src/services/safety/safetyService';
import { checkInService } from '../../src/services/alerts/alertService';

export default function HomeScreen() {
  const router = useRouter();
  const [telemetry, setTelemetry] = useState(safetyService.getTelemetry());
  const [checkInDone, setCheckInDone] = useState(false);

  const handleCheckIn = async () => {
    await checkInService.completeCheckIn();
    setCheckInDone(true);
    setTimeout(() => setCheckInDone(false), 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>SafeTour</Text>
            <View style={styles.dtidPill}>
              <Text style={styles.dtidPillText}>{MOCK_TOURIST.dtid}</Text>
            </View>
          </View>
          <Text style={styles.subHeader}>Tourist Home</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusPill}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>{telemetry.connectivityState === 'ONLINE' ? 'Online' : 'Offline'}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome & Context */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.badgeText}>NOMINAL TRAVEL MODE</Text>
              <Text style={styles.titleLarge}>Good morning, Arjun</Text>
              <Text style={styles.bodySmall}>Meghalaya Adventure • Exploring Shillong Hills</Text>
            </View>
          </View>
          <View style={styles.pillRow}>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>Day 3 of 7 Active</Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>GPS High Precision (±4m)</Text>
            </View>
          </View>
        </View>

        {/* Safety Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreBar} />
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{telemetry.safetyScore}</Text>
            <Text style={styles.scoreSub}>/ 100</Text>
          </View>
          <View style={styles.safeBadge}>
            <Text style={styles.safeBadgeText}>YOU'RE {telemetry.safetyStatus}</Text>
          </View>
          <Text style={styles.explanationText}>{telemetry.explanation}</Text>

          {/* Metric Bento */}
          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Area Zone</Text>
              <Text style={styles.metricValue}>{telemetry.areaZoneLabel}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Route</Text>
              <Text style={styles.metricValue}>{telemetry.routeStatusLabel}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Check-In</Text>
              <Text style={styles.metricValue}>{telemetry.checkInStatusLabel}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Battery</Text>
              <Text style={styles.metricValue}>{telemetry.batteryPercent}% (Good)</Text>
            </View>
          </View>
        </View>

        {/* Safety Check-In */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Safety Check-In</Text>
              <Text style={styles.bodySmall}>Scheduled window: every 4 hours</Text>
            </View>
            <Text style={styles.scheduleText}>Next: 6:00 PM</Text>
          </View>
          <Pressable
            style={[styles.primaryBtn, checkInDone && styles.successBtn]}
            onPress={handleCheckIn}
          >
            <Text style={styles.btnText}>
              {checkInDone ? 'Check-In Recorded ✓' : 'Check In Now (I am safe)'}
            </Text>
          </Pressable>
        </View>

        {/* Current Safety Zone Card */}
        <View style={styles.card}>
          <Text style={styles.badgeText}>CURRENT SAFETY ZONE</Text>
          <Text style={styles.cardTitle}>Shillong Central Highland</Text>
          <Text style={styles.bodySmall}>Ward 4 • Meghalaya District Police Division</Text>
          <Text style={styles.zoneDesc}>
            Normal-risk zone. Well-lit roads, active mobile signal, tourist assistance booth 650m away. Police patrol frequency: high.
          </Text>
          <Pressable
            style={styles.outlineBtn}
            onPress={() => router.push('/(tabs)/map')}
          >
            <Text style={styles.outlineBtnText}>View On Safety Map</Text>
          </Pressable>
        </View>

        {/* Digital Tourist ID Banner */}
        <Pressable
          style={styles.idBanner}
          onPress={() => router.push('/tourist-id')}
        >
          <View>
            <Text style={styles.idBannerTag}>GOVERNMENT ENCRYPTED</Text>
            <Text style={styles.idBannerTitle}>Digital Tourist ID</Text>
            <Text style={styles.idBannerSub}>{MOCK_TOURIST.dtid} • {MOCK_TOURIST.name}</Text>
          </View>
          <View style={styles.idBtn}>
            <Text style={styles.idBtnText}>Show QR</Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* Floating SOS Action Trigger */}
      <Pressable
        style={styles.floatingSos}
        onPress={() => router.push('/emergency')}
      >
        <Text style={styles.sosText}>SOS</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eceef0',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
  },
  dtidPill: {
    backgroundColor: '#94f2f7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  dtidPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007074',
  },
  subHeader: {
    fontSize: 11,
    color: '#44474c',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#eceef0',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00696d',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00696d',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00696d',
    textTransform: 'uppercase',
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#191c1e',
  },
  bodySmall: {
    fontSize: 12,
    color: '#44474c',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  infoPill: {
    backgroundColor: '#f2f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  infoPillText: {
    fontSize: 11,
    color: '#191c1e',
    fontWeight: '500',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eceef0',
    position: 'relative',
    overflow: 'hidden',
  },
  scoreBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#00696d',
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 4,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#191c1e',
  },
  scoreSub: {
    fontSize: 16,
    color: '#44474c',
    fontWeight: '600',
    marginLeft: 4,
  },
  safeBadge: {
    backgroundColor: '#f2f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  safeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00696d',
  },
  explanationText: {
    fontSize: 12,
    color: '#44474c',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  metricBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f2f4f6',
    padding: 10,
    borderRadius: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#44474c',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#191c1e',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
  },
  scheduleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00696d',
  },
  primaryBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  successBtn: {
    backgroundColor: '#00696d',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  zoneDesc: {
    fontSize: 13,
    color: '#191c1e',
    lineHeight: 18,
    marginTop: 4,
  },
  outlineBtn: {
    backgroundColor: '#f2f4f6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  outlineBtnText: {
    color: '#00696d',
    fontSize: 12,
    fontWeight: '700',
  },
  idBanner: {
    backgroundColor: '#0e1c2f',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idBannerTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94f2f7',
  },
  idBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  idBannerSub: {
    fontSize: 12,
    color: '#bac7e1',
    marginTop: 2,
  },
  idBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  idBtnText: {
    color: '#0e1c2f',
    fontSize: 12,
    fontWeight: '700',
  },
  floatingSos: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ba1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ba1a1a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
