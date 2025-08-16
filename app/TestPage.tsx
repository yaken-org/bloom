import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import FilterView, { FilterViewRef } from '@/components/FilterView';
import FilterControls from '@/components/FilterControls';
import type { FilterType, FilterState } from '@/types/filters';

const TestPage: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [filterStates, setFilterStates] = useState<FilterState>({
    imageMagick: false,
    glittery: false,
    overlay: false,
  });
  const [filterOrder, setFilterOrder] = useState<FilterType[]>(['overlay', 'imageMagick', 'glittery']);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
  const filterViewRef = useRef<FilterViewRef>(null);

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

  const handleSelectOverlayImage = async () => {
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
        setOverlayImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', 'オーバーレイ画像の選択に失敗しました。');
      console.error('Overlay image picker error:', error);
    }
  };

  const handleToggleFilter = (filterType: keyof FilterState) => {
    setFilterStates(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleReorderFilter = (newOrder: FilterType[]) => {
    setFilterOrder(newOrder);
  };

  const handleSaveImage = async () => {
    try {
      // メディアライブラリのパーミッションをリクエスト
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'パーミッション必要',
          '画像を保存するにはメディアライブラリへのアクセス許可が必要です。'
        );
        return;
      }

      // FilterViewからスナップショットを取得
      const snapshot = filterViewRef.current?.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert('エラー', '画像のスナップショットを取得できませんでした。');
        return;
      }

      // スナップショットをBase64に変換
      const base64Data = snapshot.encodeToBase64();
      if (!base64Data) {
        Alert.alert('エラー', '画像のエンコードに失敗しました。');
        return;
      }

      // 一時的にファイルシステムに保存
      const filename = `filtered_image_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // メディアライブラリに保存
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Bloom', asset, false);

      Alert.alert(
        '保存完了',
        'フィルター適用済みの画像を写真アルバムに保存しました。',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Save image error:', error);
      Alert.alert('エラー', '画像の保存に失敗しました。');
    }
  };

  // アクティブなフィルターのリストを生成
  const activeFilters = filterOrder.filter(filter => filterStates[filter]);


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
      
      <Text style={styles.title}>複数フィルター合成システム</Text>

      {imageUri ? (
        <>
          <FilterView 
            ref={filterViewRef}
            imageUrl={imageUri}
            filters={activeFilters}
            overlayImageUrl={overlayImageUrl || undefined}
          />
          <FilterControls
            filterStates={filterStates}
            filterOrder={filterOrder}
            overlayImageUrl={overlayImageUrl}
            onToggleFilter={handleToggleFilter}
            onReorderFilter={handleReorderFilter}
            onSelectOverlayImage={handleSelectOverlayImage}
          />
          
          {/* 保存ボタンを追加 */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveImage}
          >
            <Text style={styles.saveButtonText}>
              画像を保存
            </Text>
          </TouchableOpacity>
        </>
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
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
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