declare module 'ml5' {
    interface FaceApiOptions {
      withLandmarks?: boolean
      withDescriptors?: boolean
      withExpressions?: boolean
    }
  
    export interface FaceApi {
      detect: (input: HTMLVideoElement) => Promise<any>
    }
  
    export default function ml5(): {
      faceApi: (
        video: HTMLVideoElement, 
        options: FaceApiOptions, 
        callback?: () => void
      ) => Promise<FaceApi>
    }
  }
  