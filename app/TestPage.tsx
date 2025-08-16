import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import FilterView from '@/components/FilterView';

const TestPage: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSelectImage = async () => {
    try {
      // パーミッションをリクエスト
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'パーミッション必要',
          'カメラロールにアクセスするには写真へのアクセス許可が必要です。'
        );
        return;
      }

      // 画像を選択
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '画像の選択に失敗しました。');
      console.error('Image picker error:', error);
    }
  };


  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <StatusBar style="auto" />
      
      <Text style={styles.title}>ImageMagick Filter Test</Text>

      {imageUri ? (
        <FilterView 
          imageUrl={imageUri}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            カメラロールから画像を選択してください
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.selectButton}
        onPress={handleSelectImage}
      >
        <Text style={styles.selectButtonText}>
          {imageUri ? '別の画像を選択' : '画像を選択'}
        </Text>
      </TouchableOpacity>

      <View style={styles.commandInfo}>
        <Text style={styles.commandTitle}>適用されるImageMagickコマンド:</Text>
        <Text style={styles.commandText}>
          magick input.jpg{'\n'}
          -edge 2 -negate{'\n'}
          -blur 0x1{'\n'}
          -modulate 100,300,100{'\n'}
          -colorize 10,50,80{'\n'}
          output.jpg
        </Text>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60, // 上部に十分な余白を追加
    paddingBottom: 40, // 下部に余白を追加
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderContainer: {
    width: 300,
    height: 225,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  commandInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  commandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  commandText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#555',
    lineHeight: 18,
  },
});

export default TestPage;