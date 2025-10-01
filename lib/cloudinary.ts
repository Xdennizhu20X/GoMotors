/**
 * Cloudinary Service for image uploads
 * Handles profile photos and other image uploads
 */

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

interface CloudinaryError {
  error: {
    message: string;
  };
}

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey?: string;
  private apiSecret?: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
    this.apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;

  }

  /**
   * Upload image to Cloudinary using unsigned upload preset
   * @param file - File object or base64 string
   * @param options - Additional upload options
   */
  async uploadImage(
    file: File | string,
    options: {
      folder?: string;
      publicId?: string;
      tags?: string[];
      transformation?: any[];
    } = {}
  ): Promise<CloudinaryUploadResponse> {
    // Validate configuration
    if (!this.cloudName) {
      throw new Error('Cloudinary cloud name no está configurado. Verifica NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME en .env.local');
    }
    if (!this.uploadPreset) {
      throw new Error('Cloudinary upload preset no está configurado. Verifica NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local');
    }

    const formData = new FormData();

    // Handle both File objects and base64 strings
    if (typeof file === 'string') {
      formData.append('file', file);
    } else {
      formData.append('file', file);
    }

    formData.append('upload_preset', this.uploadPreset);

    // Add folder for organization
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    // Add public_id if provided
    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }

    // Add tags if provided
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Add transformations if provided
    if (options.transformation && options.transformation.length > 0) {
      formData.append('transformation', JSON.stringify(options.transformation));
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Cloudinary error response:', responseData);
        const errorMessage = responseData.error?.message || 'Error al subir la imagen';
        throw new Error(errorMessage);
      }

      return responseData as CloudinaryUploadResponse;
    } catch (error: any) {
      console.error('Cloudinary upload error details:', error);
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }

  /**
   * Upload profile photo with automatic transformations
   * @param file - Profile photo file
   * @param userId - User ID for unique identification
   */
  async uploadProfilePhoto(file: File, userId?: string): Promise<string> {
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Formato de imagen no válido. Use JPG, PNG o WebP.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('La imagen no debe superar los 5MB');
      }

      const timestamp = Date.now();
      const publicId = userId ? `profile_${userId}_${timestamp}` : `profile_${timestamp}`;

      const result = await this.uploadImage(file, {
        folder: 'ruedaya/profiles',
        publicId,
        tags: ['profile', 'user', userId || 'anonymous'].filter(Boolean)
      });

      return result.secure_url;
    } catch (error: any) {
      console.error('Profile photo upload error:', error);
      throw new Error(error.message || 'Error al subir la foto de perfil');
    }
  }

  /**
   * Upload vehicle image with optimizations
   * @param file - Vehicle image file
   * @param vehicleId - Vehicle ID for organization
   */
  async uploadVehicleImage(file: File, vehicleId?: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const publicId = vehicleId ? `vehicle_${vehicleId}_${timestamp}` : `vehicle_${timestamp}`;

      const result = await this.uploadImage(file, {
        folder: 'ruedaya/vehicles',
        publicId,
        tags: ['vehicle', vehicleId || 'unknown'].filter(Boolean)
      });

      return result.secure_url;
    } catch (error: any) {
      console.error('Vehicle image upload error:', error);
      throw new Error(error.message || 'Error al subir la imagen del vehículo');
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Public ID of the image to delete
   */
  async deleteImage(publicId: string): Promise<boolean> {
    // Note: Deletion requires signed requests with API credentials
    // This should be done from the backend for security
    console.warn('Image deletion should be handled by the backend for security');
    return false;
  }

  /**
   * Get optimized image URL with transformations
   * @param url - Original Cloudinary URL
   * @param transformations - Transformation options
   */
  getOptimizedUrl(url: string, transformations: any = {}): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    const defaultTransformations = {
      quality: 'auto:good',
      fetch_format: 'auto',
      dpr: 'auto',
      responsive: true,
      width: 'auto'
    };

    const mergedTransformations = { ...defaultTransformations, ...transformations };

    // Build transformation string
    const transformString = Object.entries(mergedTransformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');

    // Insert transformation into URL
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformString}/${parts[1]}`;
    }

    return url;
  }
}

// Export singleton instance
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;

// Export type definitions
export type { CloudinaryUploadResponse, CloudinaryError };