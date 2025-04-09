import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (// pathname
      ) => {
        // Here you should validate that the user is an admin
        // For now, we'll proceed without authentication
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          // tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
          // }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // This won't work on localhost, but will work in production
        console.log('Product image upload completed', blob);
        
        try {
          // Your additional logic here
          // - Updating image references in a database
          // - Processing the image
          // - Sending notifications
        } catch (error) {
          // Include the original error in your message for better debugging
          throw new Error(`Post-upload processing failed: ${(error as Error).message}`);
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}