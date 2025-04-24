import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Check if running on a native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Hide splash screen
export const hideSplashScreen = async (): Promise<void> => {
  if (isNativePlatform()) {
    await SplashScreen.hide();
  }
};

// Set status bar to dark style
export const setStatusBarStyleDark = async (): Promise<void> => {
  if (isNativePlatform()) {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#2d2d3a' });
  }
};

// Set status bar to light style
export const setStatusBarStyleLight = async (): Promise<void> => {
  if (isNativePlatform()) {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
};

// Take a picture using device camera
export const takePicture = async (): Promise<string | undefined> => {
  if (!isNativePlatform()) {
    console.warn('Camera is only available on native platforms');
    return undefined;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    return image.webPath;
  } catch (error) {
    console.error('Error taking picture:', error);
    return undefined;
  }
};

// Select picture from gallery
export const selectPictureFromGallery = async (): Promise<string | undefined> => {
  if (!isNativePlatform()) {
    console.warn('Gallery access is only available on native platforms');
    return undefined;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    return image.webPath;
  } catch (error) {
    console.error('Error selecting picture from gallery:', error);
    return undefined;
  }
};
