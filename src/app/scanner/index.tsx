// src/app/scanner/index.tsx
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useScannerStore } from '../../store/scannerStore';

export default function CameraScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isCapturing, setIsCapturing] = useState(false);

  const { addPage, pages } = useScannerStore();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.permissionView}>
          <Ionicons name="camera-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            FODX Scanner needs your camera to scan documents securely.
          </Text>
          <TouchableOpacity
            style={[styles.grantButton, { backgroundColor: colors.accent }]}
            onPress={requestPermission}
          >
            <Text style={styles.grantButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo && photo.uri) {
        addPage(photo.uri);
        if (pages.length === 0) {
          router.push('/scanner/edit');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Top Bar */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={24} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Document Framing Guide (Now centered and responsive) */}
        <View style={styles.frameGuideContainer} pointerEvents="none">
          <View style={styles.frameGuide}>
             {/* Corner markers for a professional look */}
             <View style={[styles.corner, styles.topLeft]} />
             <View style={[styles.corner, styles.topRight]} />
             <View style={[styles.corner, styles.bottomLeft]} />
             <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.frameText}>Align document within the frame</Text>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.sidePlaceholder} />
          
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sidePlaceholder} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
  },
  frameGuideContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameGuide: {
    width: '85%',
    height: '65%', // Fixed height percentage works better on web and mobile
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    position: 'relative',
  },
  frameText: {
    color: '#FFF',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFF',
  },
  topLeft: { top: -1, left: -1, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  topRight: { top: -1, right: -1, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bottomLeft: { bottom: -1, left: -1, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  bottomRight: { bottom: -1, right: -1, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
    zIndex: 10,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  sidePlaceholder: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  permissionView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permissionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  permissionText: { fontSize: 16, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  grantButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  grantButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});