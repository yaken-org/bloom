import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * DebugPage - デバッグ用のメニューページ
 *
 * 主な機能:
 * 1. 端末の写真を選択
 * 2. 選択した写真でTestPageを開く
 */
const DebugPage: React.FC = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const router = useRouter();

  /**
   * 端末から写真を選択するハンドラー
   */
  const handleSelectImage = async () => {
    try {
      // メディアライブラリのパーミッションをリクエスト
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "パーミッション必要",
          "カメラロールにアクセスするには写真へのアクセス許可が必要です。",
        );
        return;
      }

      // 写真選択器を起動
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("エラー", "写真の選択に失敗しました。");
      console.error("Image picker error:", error);
    }
  };

  /**
   * TestPageを開くハンドラー
   */
  const handleOpenTestPage = () => {
    if (!selectedImageUri) {
      Alert.alert("画像未選択", "まず写真を選択してください。");
      return;
    }

    // TestPageに画像URIを渡して遷移
    router.push({
      pathname: "./TestPage" as any,
      params: {
        imageUri: selectedImageUri,
      },
    });
  };

  /**
   * カメラで写真を撮影するハンドラー
   */
  const handleTakePhoto = async () => {
    try {
      // カメラのパーミッションをリクエスト
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "パーミッション必要",
          "カメラを使用するにはカメラへのアクセス許可が必要です。",
        );
        return;
      }

      // カメラを起動
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("エラー", "写真の撮影に失敗しました。");
      console.error("Camera error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>デバッグメニュー</Text>
        <Text style={styles.subtitle}>フィルターテスト用ページ</Text>

        {/* 選択された画像のプレビュー */}
        {selectedImageUri && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.imagePreviewLabel}>選択された画像:</Text>
            <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
          </View>
        )}

        {/* 写真選択ボタン */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSelectImage}
        >
          <Text style={styles.buttonText}>📱 端末から写真を選択</Text>
        </TouchableOpacity>

        {/* カメラ撮影ボタン */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePhoto}
        >
          <Text style={styles.buttonText}>📷 カメラで写真を撮影</Text>
        </TouchableOpacity>

        {/* TestPage開くボタン */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.testPageButton,
            !selectedImageUri && styles.buttonDisabled,
          ]}
          onPress={handleOpenTestPage}
          disabled={!selectedImageUri}
        >
          <Text
            style={[
              styles.buttonText,
              styles.testPageButtonText,
              !selectedImageUri && styles.buttonTextDisabled,
            ]}
          >
            🧪 TestPageを開く
          </Text>
        </TouchableOpacity>

        {!selectedImageUri && (
          <Text style={styles.instructionText}>
            写真を選択してからTestPageを開いてください
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreviewLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  testPageButton: {
    backgroundColor: "#28a745",
    marginTop: 20,
  },
  testPageButtonText: {
    fontSize: 20,
    fontWeight: "700",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonTextDisabled: {
    color: "#999",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default DebugPage;