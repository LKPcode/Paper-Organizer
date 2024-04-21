declare interface Window {
    highlighter: any;
    frame: any;
    PDFViewerApplication: any;
    Highlighter: any;
  }

// supabase types
 
 declare interface Credentials {
  email?: string | undefined
  password?: string | undefined
  provider?: 'bitbucket' | 'github' | 'gitlab' | 'google' | undefined
}