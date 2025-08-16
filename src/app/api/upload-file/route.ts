import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64String}`

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`

    const uploadFormData = new FormData()
    uploadFormData.append('file', dataURI)
    uploadFormData.append('upload_preset', 'nishu-portfolio/images')
    uploadFormData.append('folder', 'nishu-portfolio/files')

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to upload to Cloudinary: ${text}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 