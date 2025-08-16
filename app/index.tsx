import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraPreview() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);

  const { squareSize, squareTop, squareLeft } = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const squareSize = Math.min(screenWidth, screenHeight) * 0.95;
    const squareTop = (screenHeight - squareSize) / 2;
    const squareLeft = (screenWidth - squareSize) / 2;
    return { squareSize, squareTop, squareLeft };
  }, []);

  // カメラのパーミッションと初期化を管理
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        if (!permission) {
          // パーミッションの初期化中
          return;
        }

        if (!permission.granted) {
          // パーミッションが拒否されている場合、リクエストする
          const result = await requestPermission();
          if (!result.granted) {
            Alert.alert(
              "カメラのアクセス許可が必要です",
              "アプリの設定からカメラへのアクセスを許可してください。",
            );
            return;
          }
        }

        // 少し遅延してからカメラを準備（安定性向上のため）
        setTimeout(() => {
          setIsReady(true);
        }, 100);
      } catch (error) {
        console.error("Camera initialization error:", error);
        Alert.alert("エラー", "カメラの初期化に失敗しました。");
      }
    };

    initializeCamera();
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // 撮影
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          exif: false,
        });
        console.log("Original Photo URI:", photo.uri);

        // 正方形にトリミング
        const { width, height } = photo;
        const cropSize = Math.min(width, height);
        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: (width - cropSize) / 2,
                originY: (height - cropSize) / 2,
                width: cropSize,
                height: cropSize,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
        );

        // 保存
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(cropped.uri);
          Alert.alert("保存完了", "写真がギャラリーに保存されました。");
        } else {
          Alert.alert(
            "許可が必要です",
            "写真を保存するには写真ライブラリへのアクセスが必要です。",
          );
        }

        setPhotoUri(cropped.uri);
        console.log("Cropped Photo URI:", cropped.uri);
      } catch (error) {
        console.error("Failed to take picture:", error);
        Alert.alert(
          "エラー",
          "写真の撮影に失敗しました。もう一度お試しください。",
        );
      }
    }
  };

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setPhotoUri(null)}
        >
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // パーミッションの確認中または取得中
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>カメラを準備中...</Text>
      </View>
    );
  }

  // パーミッションが拒否された場合
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          カメラへのアクセス許可が必要です
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>許可する</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // カメラの準備中
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>カメラを起動中...</Text>
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing={facing}
      onMountError={(error) => {
        console.error("Camera mount error:", error);
        Alert.alert(
          "カメラエラー",
          "カメラの起動に失敗しました。アプリを再起動してください。",
        );
      }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        {/* 上 */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: squareTop,
            backgroundColor: "black",
          }}
        />
        {/* 下 */}
        <View
          style={{
            position: "absolute",
            top: squareTop + squareSize,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          }}
        />
        {/* 左 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: 0,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "black",
          }}
        />
        {/* 右 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: squareLeft + squareSize,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "black",
          }}
        />
        {/* 正方形フレーム */}
        <View
          style={[
            styles.square,
            {
              top: squareTop,
              left: squareLeft,
              width: squareSize,
              height: squareSize,
            },
          ]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>📸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Text style={styles.text}>🔄</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  square: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: { marginHorizontal: 20, padding: 10 },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  previewImage: { width: 300, height: 300, borderRadius: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
